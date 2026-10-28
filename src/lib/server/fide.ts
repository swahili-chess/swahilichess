import type { LeaderboardPlayer } from '../types/leaderboard.js';
import { isObject as object, readSnapshot, type Snapshot } from './ratings.ts';

const categories = ['standard', 'rapid', 'blitz'] as const;

/** Validate the API boundary and construct profile links from FIDE IDs only. */
export function parseFideSnapshot(value: unknown): Snapshot {
	if (
		!object(value) ||
		value.provider !== 'fide' ||
		value.federation !== 'TAN' ||
		typeof value.ratingMonth !== 'string' ||
		!/^20\d{2}-(0[1-9]|1[0-2])$/.test(value.ratingMonth) ||
		typeof value.fetchedAt !== 'string' ||
		!Number.isFinite(Date.parse(value.fetchedAt)) ||
		typeof value.stale !== 'boolean' ||
		!Array.isArray(value.players) ||
		value.players.length > 10000
	)
		throw new Error('Invalid FIDE snapshot');
	const seen = new Set<string>();
	const players: LeaderboardPlayer[] = value.players.map((player: unknown) => {
		if (
			!object(player) ||
			typeof player.id !== 'string' ||
			!/^[1-9]\d{0,11}$/.test(player.id) ||
			seen.has(player.id) ||
			typeof player.name !== 'string' ||
			!player.name.trim() ||
			player.name.length > 200 ||
			!object(player.ratings) ||
			(player.title !== undefined && (typeof player.title !== 'string' || player.title.length > 10))
		) {
			throw new Error('Invalid FIDE player');
		}
		seen.add(player.id);
		const ratings: LeaderboardPlayer['ratings'] = {};
		for (const category of categories) {
			const rating = player.ratings[category];
			if (rating === null || rating === undefined) {
				ratings[category] = null;
				continue;
			}
			if (
				!object(rating) ||
				typeof rating.value !== 'number' ||
				!Number.isInteger(rating.value) ||
				rating.value <= 0 ||
				rating.value > 3500
			) {
				throw new Error('Invalid FIDE rating');
			}
			ratings[category] = { value: rating.value };
		}
		return {
			id: player.id,
			name: player.name,
			title: player.title as string | undefined,
			profileUrl: `https://ratings.fide.com/profile/${player.id}`,
			ratings
		};
	});
	return {
		players,
		snapshotAt: value.fetchedAt,
		ratingMonth: value.ratingMonth,
		state: value.stale ? 'stale' : 'ready'
	};
}

export const readFideSnapshot = (baseURL: string | undefined, fetcher: typeof fetch) =>
	readSnapshot(baseURL, fetcher, '/fide/leaderboard', parseFideSnapshot, 'FIDE');

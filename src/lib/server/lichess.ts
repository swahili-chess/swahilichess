import type { LeaderboardPlayer } from '../types/leaderboard.js';
import { isObject, readSnapshot, type Snapshot } from './ratings.ts';

const categories = ['rapid', 'blitz', 'bullet'] as const;
const userID = /^[a-z0-9][a-z0-9_-]{0,29}$/;

/** Validate the API boundary and construct profile links from Lichess IDs only. */
export function parseLichessSnapshot(value: unknown): Snapshot {
	if (
		!isObject(value) ||
		value.provider !== 'lichess' ||
		value.team !== 'nyumbani-mates' ||
		typeof value.fetchedAt !== 'string' ||
		!Number.isFinite(Date.parse(value.fetchedAt)) ||
		typeof value.stale !== 'boolean' ||
		!Array.isArray(value.players) ||
		value.players.length > 5000
	)
		throw new Error('Invalid Lichess snapshot');
	const seen = new Set<string>();
	const players: LeaderboardPlayer[] = value.players.map((player: unknown) => {
		if (
			!isObject(player) ||
			typeof player.id !== 'string' ||
			!userID.test(player.id) ||
			seen.has(player.id) ||
			typeof player.name !== 'string' ||
			player.name.toLowerCase() !== player.id ||
			!isObject(player.ratings) ||
			(player.title !== undefined && (typeof player.title !== 'string' || player.title.length > 10))
		) {
			throw new Error('Invalid Lichess player');
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
				!isObject(rating) ||
				typeof rating.value !== 'number' ||
				!Number.isInteger(rating.value) ||
				rating.value <= 0 ||
				rating.value > 4000 ||
				(rating.provisional !== undefined && typeof rating.provisional !== 'boolean')
			) {
				throw new Error('Invalid Lichess rating');
			}
			ratings[category] = rating.provisional
				? { value: rating.value, provisional: true }
				: { value: rating.value };
		}
		return {
			id: player.id,
			name: player.name,
			title: player.title as string | undefined,
			profileUrl: `https://lichess.org/@/${player.id}`,
			ratings
		};
	});
	return {
		players,
		snapshotAt: value.fetchedAt,
		ratingMonth: null,
		state: value.stale ? 'stale' : 'ready'
	};
}

export const readLichessSnapshot = (baseURL: string | undefined, fetcher: typeof fetch) =>
	readSnapshot(baseURL, fetcher, '/lichess/ratings', parseLichessSnapshot, 'Lichess');

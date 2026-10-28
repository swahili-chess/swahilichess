import type { LeaderboardPlayer } from '../types/leaderboard.js';
import { isObject, readSnapshot, type Snapshot } from './ratings.ts';

const categories = ['rapid', 'blitz', 'bullet'] as const;
const username = /^[a-z0-9][a-z0-9_-]{1,49}$/;

/** Validate the API boundary and construct profile links from Chess.com usernames only. */
export function parseChessComSnapshot(value: unknown): Snapshot {
	if (
		!isObject(value) ||
		value.provider !== 'chesscom' ||
		value.country !== 'TZ' ||
		typeof value.fetchedAt !== 'string' ||
		!Number.isFinite(Date.parse(value.fetchedAt)) ||
		typeof value.stale !== 'boolean' ||
		!Array.isArray(value.players) ||
		value.players.length > 20000
	)
		throw new Error('Invalid Chess.com snapshot');
	const seen = new Set<string>();
	const players: LeaderboardPlayer[] = value.players.map((player: unknown) => {
		if (
			!isObject(player) ||
			typeof player.id !== 'string' ||
			!username.test(player.id) ||
			seen.has(player.id) ||
			typeof player.name !== 'string' ||
			player.name.toLowerCase() !== player.id ||
			!isObject(player.ratings) ||
			(player.title !== undefined && (typeof player.title !== 'string' || player.title.length > 10))
		) {
			throw new Error('Invalid Chess.com player');
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
				rating.value > 4000
			) {
				throw new Error('Invalid Chess.com rating');
			}
			ratings[category] = { value: rating.value };
		}
		return {
			id: player.id,
			name: player.name,
			title: player.title as string | undefined,
			profileUrl: `https://www.chess.com/member/${player.id}`,
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

export const readChessComSnapshot = (baseURL: string | undefined, fetcher: typeof fetch) =>
	readSnapshot(baseURL, fetcher, '/chesscom/ratings', parseChessComSnapshot, 'Chess.com');

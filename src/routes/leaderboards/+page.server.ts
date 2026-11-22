import { dev } from '$app/env';
import { RATINGS_API_URL } from '$app/env/private';
import { readFideSnapshot } from '#lib/server/fide.js';
import { readLichessSnapshot } from '#lib/server/lichess.js';
import { readChessComSnapshot } from '#lib/server/chesscom.js';
import { rankLeaderboard, readLeaderboardQuery } from '#lib/leaderboard.js';
import type { LeaderboardState } from '#lib/types/leaderboard.js';
import type { PageServerLoad } from './$types';

const previewStates: LeaderboardState[] = ['empty', 'error', 'loading', 'stale'];

export const load: PageServerLoad = async ({ url, fetch }) => {
	const query = readLeaderboardQuery(url.searchParams);
	const read = {
		fide: readFideSnapshot,
		lichess: readLichessSnapshot,
		chesscom: readChessComSnapshot
	}[query.provider];
	const snapshot = await read(RATINGS_API_URL, fetch);
	// Development-only: show a state over the real snapshot without inventing players.
	const preview = dev
		? previewStates.find((state) => state === url.searchParams.get('fixture'))
		: undefined;
	const players = preview === 'empty' || preview === 'error' ? [] : snapshot.players;
	return {
		board: rankLeaderboard(players, query),
		state: preview ?? snapshot.state,
		snapshotAt: preview === 'error' ? null : snapshot.snapshotAt,
		ratingMonth: snapshot.ratingMonth
	};
};

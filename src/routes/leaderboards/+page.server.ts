import { dev } from '$app/env';
import { RATINGS_API_URL } from '$app/env/private';
import { readFideSnapshot } from '#lib/server/fide.js';
import { leaderboardFixture, sampleSnapshotAt } from '#lib/fixtures/leaderboard.js';
import { rankLeaderboard, readLeaderboardQuery } from '#lib/leaderboard.js';
import type { LeaderboardState } from '#lib/types/leaderboard.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, fetch }) => {
	const query = readLeaderboardQuery(url.searchParams);
	const fixture = dev ? url.searchParams.get('fixture') : null;
	const fixtureMode =
		fixture === 'ready' ||
		fixture === 'empty' ||
		fixture === 'error' ||
		fixture === 'loading' ||
		fixture === 'stale';
	if (query.provider === 'fide' && !fixtureMode) {
		const snapshot = await readFideSnapshot(RATINGS_API_URL, fetch);
		return {
			board: rankLeaderboard(snapshot.players, query),
			state: snapshot.state,
			sample: false,
			snapshotAt: snapshot.snapshotAt,
			ratingMonth: snapshot.ratingMonth
		};
	}
	const state: LeaderboardState =
		fixture === 'empty' || fixture === 'error' || fixture === 'loading' || fixture === 'stale'
			? fixture
			: 'ready';
	const players = state === 'empty' || state === 'error' ? [] : leaderboardFixture(query.provider);
	return {
		board: rankLeaderboard(players, query),
		state,
		sample: true,
		snapshotAt: sampleSnapshotAt,
		ratingMonth: null
	};
};

import { dev } from '$app/env';
import { leaderboardFixture, sampleSnapshotAt } from '#lib/fixtures/leaderboard.js';
import { rankLeaderboard, readLeaderboardQuery } from '#lib/leaderboard.js';
import type { LeaderboardState } from '#lib/types/leaderboard.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ url }) => {
	const query = readLeaderboardQuery(url.searchParams);
	const fixture = dev ? url.searchParams.get('fixture') : null;
	const state: LeaderboardState =
		fixture === 'empty' || fixture === 'error' || fixture === 'loading' || fixture === 'stale'
			? fixture
			: 'ready';
	const players = state === 'empty' || state === 'error' ? [] : leaderboardFixture(query.provider);
	return {
		board: rankLeaderboard(players, query),
		state,
		sample: true,
		snapshotAt: sampleSnapshotAt
	};
};

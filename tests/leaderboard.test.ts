import test from 'node:test';
import assert from 'node:assert/strict';
import {
	categoriesFor,
	leaderboardHref,
	rankLeaderboard,
	readLeaderboardQuery
} from '../src/lib/leaderboard.ts';
import type { LeaderboardPlayer, LeaderboardQuery } from '../src/lib/types/leaderboard.ts';

const query: LeaderboardQuery = { provider: 'lichess', category: 'rapid', q: '', page: 1 };
const players: LeaderboardPlayer[] = Array.from({ length: 24 }, (_, index) => ({
	id: `player-${String(index).padStart(2, '0')}`,
	name: `Player ${index}`,
	handle: `handle_${index}`,
	ratings: { rapid: { value: index === 10 ? 2300 - 9 * 30 : 2300 - index * 30 } }
}));

test('each provider has exactly its valid categories', () => {
	assert.deepEqual(categoriesFor('fide'), ['standard', 'rapid', 'blitz']);
	for (const provider of ['lichess', 'chesscom'] as const)
		assert.deepEqual(categoriesFor(provider), ['rapid', 'blitz', 'bullet']);
	assert.equal(
		readLeaderboardQuery(new URLSearchParams('provider=fide&category=bullet')).category,
		'standard'
	);
	assert.equal(
		readLeaderboardQuery(new URLSearchParams('provider=lichess&category=standard')).category,
		'rapid'
	);
});
test('invalid query values are bounded', () => {
	assert.deepEqual(readLeaderboardQuery(new URLSearchParams('provider=unknown&page=-5')), query);
	for (const page of ['1.5', 'Infinity', 'NaN', '9007199254740992'])
		assert.equal(readLeaderboardQuery(new URLSearchParams({ page })).page, 1);
	assert.equal(readLeaderboardQuery(new URLSearchParams({ q: ' x '.repeat(200) })).q.length, 100);
});
test('tied ranks remain correct across page boundaries', () => {
	const first = rankLeaderboard(players, query);
	const second = rankLeaderboard(players, { ...query, page: 2 });
	assert.equal(first.rows[9].rank, 10);
	assert.equal(second.rows[0].rank, 10);
	assert.equal(second.rows[1].rank, 12);
});
test('search preserves global rank and matches handles without case sensitivity', () => {
	const result = rankLeaderboard(players, { ...query, q: 'HANDLE_10' });
	assert.equal(result.total, 1);
	assert.equal(result.rows[0].rank, 10);
	assert.equal(result.rows[0].id, 'player-10');
});
test('missing and zero ratings are excluded; provisional ratings remain ranked', () => {
	const result = rankLeaderboard(
		[
			...players,
			{ id: 'null', name: 'Null', ratings: { rapid: null } },
			{ id: 'missing', name: 'Missing', ratings: {} },
			{ id: 'zero', name: 'Zero', ratings: { rapid: { value: 0 } } },
			{
				id: 'provisional',
				name: 'Provisional',
				ratings: { rapid: { value: 2600, provisional: true } }
			}
		],
		query
	);
	assert.equal(result.unratedCount, 3);
	assert.equal(result.ratedCount, 25);
	assert.equal(result.rows[0].rating.provisional, true);
});
test('inactive FIDE players are excluded before ranking, search, and pagination in every category', () => {
	for (const category of categoriesFor('fide')) {
		const entries: LeaderboardPlayer[] = players.map((player, index) => ({
			...player,
			inactive: index === 0 || index === 1,
			ratings: { [category]: player.ratings.rapid }
		}));
		entries.push({ id: 'unrated', name: 'Unrated', ratings: {} });
		const selection: LeaderboardQuery = { ...query, provider: 'fide', category };
		const result = rankLeaderboard(entries, selection);
		assert.equal(result.total, 22);
		assert.equal(result.ratedCount, 22);
		assert.equal(result.unratedCount, 1);
		assert.equal(result.rows[0].id, 'player-02');
		assert.equal(result.rows[0].rank, 1);
		assert.equal(
			result.rows.some((player) => player.inactive),
			false
		);
		assert.equal(rankLeaderboard(entries, { ...selection, q: 'handle_0' }).total, 0);
		assert.equal(rankLeaderboard(entries, { ...selection, page: 3 }).rows.length, 2);
	}
});
test('out of range pages clamp, including empty searches', () => {
	assert.equal(rankLeaderboard(players, { ...query, page: 999 }).page, 3);
	const empty = rankLeaderboard(players, { ...query, page: 999, q: 'nobody' });
	assert.equal(empty.page, 1);
	assert.equal(empty.total, 0);
	assert.deepEqual(empty.rows, []);
});
test('links preserve searches and repair incompatible provider changes', () => {
	const url = new URL(
		leaderboardHref({ ...query, category: 'bullet', q: 'A & B' }, { provider: 'fide' }),
		'http://localhost'
	);
	assert.equal(url.searchParams.get('category'), 'standard');
	assert.equal(url.searchParams.get('q'), 'A & B');
});

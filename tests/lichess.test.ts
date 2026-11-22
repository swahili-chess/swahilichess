import test from 'node:test';
import assert from 'node:assert/strict';
import { parseLichessSnapshot, readLichessSnapshot } from '../src/lib/server/lichess.ts';
import { rankLeaderboard } from '../src/lib/leaderboard.ts';

const snapshot = {
	provider: 'lichess',
	team: 'nyumbani-mates',
	fetchedAt: '2026-10-28T12:00:00Z',
	stale: false,
	players: [
		{
			id: 'swahilix',
			name: 'SwahiliX',
			title: 'FM',
			ratings: { rapid: { value: 2304, provisional: true }, blitz: { value: 2091 } }
		},
		{ id: 'creed2001', name: 'creed2001', ratings: { rapid: { value: 2201 } } }
	]
};

test('Lichess snapshot keeps provisional flags, null categories and safe profile links', () => {
	const result = parseLichessSnapshot(snapshot);
	assert.equal(result.state, 'ready');
	assert.equal(result.ratingMonth, null);
	const [first, second] = result.players;
	assert.deepEqual(first.ratings.rapid, { value: 2304, provisional: true });
	assert.deepEqual(first.ratings.blitz, { value: 2091 });
	assert.equal(first.ratings.bullet, null);
	assert.equal(second.ratings.blitz, null);
	assert.equal(first.profileUrl, 'https://lichess.org/@/swahilix');
	assert.equal(parseLichessSnapshot({ ...snapshot, stale: true }).state, 'stale');
});

test('unplayed Lichess categories are not ranked', () => {
	const board = rankLeaderboard(parseLichessSnapshot(snapshot).players, {
		provider: 'lichess',
		category: 'blitz',
		q: '',
		page: 1
	});
	assert.equal(board.ratedCount, 1);
	assert.equal(board.unratedCount, 1);
	assert.equal(board.rows[0].id, 'swahilix');
});

test('invalid Lichess data cannot become leaderboard data', () => {
	const [player] = snapshot.players;
	for (const invalid of [
		null,
		{ ...snapshot, provider: 'fide' },
		{ ...snapshot, team: 'another-team' },
		{ ...snapshot, fetchedAt: 'yesterday' },
		{ ...snapshot, players: [player, player] },
		{ ...snapshot, players: [{ ...player, id: '../admin' }] },
		{ ...snapshot, players: [{ ...player, name: 'SomeoneElse' }] },
		{ ...snapshot, players: [{ ...player, ratings: { rapid: { value: 0 } } }] },
		{
			...snapshot,
			players: [{ ...player, ratings: { rapid: { value: 2000, provisional: 'yes' } } }]
		}
	]) {
		assert.throws(() => parseLichessSnapshot(invalid));
	}
});

test('Lichess API failure returns an unavailable state without sample players', async () => {
	let requested = '';
	const fetcher = (async (url: string | URL | Request) => {
		requested = String(url);
		return new Response('{}', { status: 503 });
	}) as typeof fetch;
	const result = await readLichessSnapshot('http://127.0.0.1:8081', fetcher);
	assert.equal(requested, 'http://127.0.0.1:8081/lichess/ratings');
	assert.deepEqual(result, { state: 'error', players: [], snapshotAt: null, ratingMonth: null });
});

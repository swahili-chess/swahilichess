import test from 'node:test';
import assert from 'node:assert/strict';
import { parseChessComSnapshot, readChessComSnapshot } from '../src/lib/server/chesscom.ts';

const snapshot = {
	provider: 'chesscom',
	country: 'TZ',
	fetchedAt: '2026-10-28T12:00:00Z',
	stale: false,
	players: [
		{ id: 'alice', name: 'Alice', playerId: 1, title: 'IM', ratings: { rapid: { value: 2100 } } },
		{ id: 'bob', name: 'bob', playerId: 2, ratings: {} }
	]
};

test('Chess.com snapshot keeps missing ratings null and builds profile links from usernames', () => {
	const result = parseChessComSnapshot(snapshot);
	assert.equal(result.state, 'ready');
	assert.equal(result.ratingMonth, null);
	const [alice, bob] = result.players;
	assert.deepEqual(alice.ratings.rapid, { value: 2100 });
	assert.equal(alice.ratings.blitz, null);
	assert.equal(bob.ratings.rapid, null);
	assert.equal(alice.profileUrl, 'https://www.chess.com/member/alice');
	assert.equal(parseChessComSnapshot({ ...snapshot, stale: true }).state, 'stale');
});

test('invalid Chess.com data cannot become leaderboard data', () => {
	const [player] = snapshot.players;
	for (const invalid of [
		null,
		{ ...snapshot, provider: 'lichess' },
		{ ...snapshot, country: 'KE' },
		{ ...snapshot, fetchedAt: 'today' },
		{ ...snapshot, players: [player, player] },
		{ ...snapshot, players: [{ ...player, id: 'https://evil.example' }] },
		{ ...snapshot, players: [{ ...player, name: 'Mallory' }] },
		{ ...snapshot, players: [{ ...player, ratings: { blitz: { value: -1 } } }] }
	]) {
		assert.throws(() => parseChessComSnapshot(invalid));
	}
});

test('Chess.com API failure returns an unavailable state without sample players', async () => {
	let requested = '';
	const fetcher = (async (url: string | URL | Request) => {
		requested = String(url);
		return new Response('{}', { status: 503 });
	}) as typeof fetch;
	const result = await readChessComSnapshot('http://127.0.0.1:8081', fetcher);
	assert.equal(requested, 'http://127.0.0.1:8081/chesscom/ratings');
	assert.deepEqual(result, { state: 'error', players: [], snapshotAt: null, ratingMonth: null });
});

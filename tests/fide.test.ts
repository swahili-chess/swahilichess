import test from 'node:test';
import assert from 'node:assert/strict';
import { parseFideSnapshot, readFideSnapshot } from '../src/lib/server/fide.ts';

const snapshot = {
	provider: 'fide',
	federation: 'TAN',
	ratingMonth: '2026-10',
	fetchedAt: '2026-10-28T12:00:00Z',
	stale: false,
	players: [
		{
			id: '12345',
			name: 'Test Player',
			title: 'FM',
			ratings: { standard: { value: 2200 }, rapid: null }
		}
	]
};

test('FIDE snapshot preserves its month, missing ratings and safe profile links', () => {
	const result = parseFideSnapshot(snapshot);
	assert.equal(result.state, 'ready');
	assert.equal(result.ratingMonth, '2026-10');
	assert.equal(result.players[0].ratings.standard?.value, 2200);
	assert.equal(result.players[0].ratings.rapid, null);
	assert.equal(result.players[0].ratings.blitz, null);
	assert.equal(result.players[0].profileUrl, 'https://ratings.fide.com/profile/12345');
	assert.equal(parseFideSnapshot({ ...snapshot, stale: true }).state, 'stale');
});

test('invalid provider data cannot silently become real leaderboard data', () => {
	for (const invalid of [
		null,
		{},
		{ ...snapshot, provider: 'lichess' },
		{ ...snapshot, ratingMonth: '2026-13' },
		{ ...snapshot, fetchedAt: 'not a date' },
		{ ...snapshot, players: [...snapshot.players, ...snapshot.players] },
		{ ...snapshot, players: [{ ...snapshot.players[0], id: 'https://evil.example' }] },
		{ ...snapshot, players: [{ ...snapshot.players[0], ratings: { standard: { value: 0 } } }] }
	]) {
		assert.throws(() => parseFideSnapshot(invalid));
	}
});

test('API failure returns an honest unavailable state without sample players or a fake timestamp', async () => {
	let requested = '';
	const fetcher = (async (url: string | URL | Request) => {
		requested = String(url);
		return new Response('{}', { status: 503 });
	}) as typeof fetch;
	const result = await readFideSnapshot('http://127.0.0.1:8081', fetcher);
	assert.equal(requested, 'http://127.0.0.1:8081/fide/leaderboard');
	assert.deepEqual(result, { state: 'error', players: [], snapshotAt: null, ratingMonth: null });
});

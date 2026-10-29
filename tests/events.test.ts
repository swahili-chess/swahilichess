import test from 'node:test';
import assert from 'node:assert/strict';
import { parseEventsSnapshot, readEventsSnapshot, timeControl } from '../src/lib/server/events.ts';

const snapshot = {
	fetchedAt: '2026-10-28T12:00:00Z',
	stale: false,
	clubs: [
		{ id: 'jordan-chess-club', name: 'Jordan Chess Club', url: 'https://example.com/ignored' }
	],
	events: [
		{
			id: 'lichess-arena-pU7LJr6J',
			provider: 'lichess',
			system: 'arena',
			origin: 'club',
			clubs: ['jordan-chess-club'],
			name: 'XXVIII Jordan Arena',
			url: 'https://evil.example',
			startsAt: '2026-11-01T16:40:00Z',
			finishesAt: '2026-11-01T18:00:00Z',
			status: 'upcoming',
			variant: 'standard',
			speed: 'rapid',
			clock: { limit: 600, increment: 5 },
			rated: true
		},
		{
			id: 'lichess-swiss-C3u9YJKO',
			provider: 'lichess',
			system: 'swiss',
			origin: 'official',
			name: 'Daily Chess960 Swiss',
			startsAt: '2026-10-31T21:30:00Z',
			status: 'upcoming',
			variant: 'chess960',
			speed: 'blitz',
			clock: { limit: 30, increment: 2 },
			rounds: 7,
			rated: true
		}
	]
};

test('events become calendar entries with rebuilt links and local dates', () => {
	const result = parseEventsSnapshot(snapshot);
	assert.equal(result.state, 'ready');
	const [arena, swiss] = result.events;
	assert.equal(arena.source, 'club');
	assert.deepEqual(arena.clubs, [
		{ name: 'Jordan Chess Club', url: 'https://lichess.org/team/jordan-chess-club' }
	]);
	assert.deepEqual(arena.location, {
		kind: 'online',
		platform: 'Lichess',
		url: 'https://lichess.org/tournament/pU7LJr6J'
	});
	assert.equal(arena.format, 'Rapid Arena');
	assert.equal(arena.timeControl, '10+5');
	assert.equal(arena.endsAt, '2026-11-01T18:00:00Z');
	assert.equal(swiss.source, 'lichess');
	assert.equal(swiss.format, 'Blitz Chess960 Swiss · 7 rounds');
	assert.equal(swiss.timeControl, '½+2');
	assert.deepEqual(swiss.date, { start: '2026-11-01' });
	assert.equal(parseEventsSnapshot({ ...snapshot, stale: true }).state, 'stale');
});

test('time controls show minutes', () => {
	assert.equal(timeControl(180, 2), '3+2');
	assert.equal(timeControl(15, 0), '¼+0');
	assert.equal(timeControl(90, 0), '1.5+0');
});

test('invalid events cannot reach the calendar', () => {
	const [arena] = snapshot.events;
	for (const invalid of [
		null,
		{ ...snapshot, fetchedAt: 'never' },
		{ ...snapshot, events: [arena, arena] },
		{ ...snapshot, events: [{ ...arena, id: 'lichess-arena-../admin' }] },
		{ ...snapshot, events: [{ ...arena, provider: 'chesscom' }] },
		{ ...snapshot, events: [{ ...arena, clubs: ['unknown-club'] }] },
		{ ...snapshot, events: [{ ...arena, speed: 'hyper' }] },
		{ ...snapshot, events: [{ ...arena, startsAt: 'soon' }] },
		{ ...snapshot, clubs: [{ id: 'Bad Club!', name: 'x' }] }
	]) {
		assert.throws(() => parseEventsSnapshot(invalid));
	}
});

test('an unavailable events API returns no online events', async () => {
	const fetcher = (async () => new Response('{}', { status: 503 })) as typeof fetch;
	assert.deepEqual(await readEventsSnapshot('http://127.0.0.1:8081', fetcher), {
		events: [],
		fetchedAt: null,
		state: 'error'
	});
});

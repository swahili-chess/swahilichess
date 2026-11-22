import test from 'node:test';
import assert from 'node:assert/strict';
import { projectWeeklySeries } from '../src/lib/recurring.ts';
import { buildTimeline } from '../src/lib/clock.ts';
import type { CalendarEvent } from '../src/lib/types/event.ts';

const jordan = { name: 'Jordan Chess Club', url: 'https://lichess.org/team/jordan-chess-club' };
const nyumbani = { name: 'Nyumbani Mates', url: 'https://lichess.org/team/nyumbani-mates' };
const club = (
	id: string,
	name: string,
	startsAt: string,
	clubs = [jordan],
	timeControl = '10+5'
): CalendarEvent => ({
	id,
	slug: id,
	source: 'club',
	clubs,
	name,
	date: { start: startsAt.slice(0, 10) },
	startsAt,
	endsAt: new Date(Date.parse(startsAt) + 80 * 60_000).toISOString(),
	location: { kind: 'online', platform: 'Lichess', url: `https://lichess.org/tournament/${id}` },
	format: 'Rapid Arena',
	speed: 'rapid',
	timeControl
});
// Sundays at 19:40 EAT (16:40 UTC).
const history = [
	club('a', 'XXV Jordan Arena', '2026-10-11T16:40:00Z'),
	club('b', 'XXVI Jordan Arena', '2026-10-18T16:40:00Z'),
	club('c', 'XXVII Jordan Arena', '2026-10-25T16:40:00Z'),
	club('d', 'XXVIII Jordan Arena', '2026-11-01T16:40:00Z')
];
const now = Date.parse('2026-10-28T12:00:00Z');

test('a weekly club series projects the coming weeks, skipping dates the club already created', () => {
	const projected = projectWeeklySeries(history, now);
	assert.deepEqual(
		projected.map((event) => [event.startsAt, event.name, event.expected]),
		[
			['2026-11-08T16:40:00.000Z', 'Jordan Arena', true],
			['2026-11-15T16:40:00.000Z', 'Jordan Arena', true],
			['2026-11-22T16:40:00.000Z', 'Jordan Arena', true]
		]
	);
	const [first] = projected;
	assert.equal(first.location.kind === 'online' && first.location.url, jordan.url);
	assert.equal(first.endsAt, '2026-11-08T18:00:00.000Z');
	assert.deepEqual(first.date, { start: '2026-11-08' });
});

test('fewer than three matching tournaments are not a series', () => {
	assert.deepEqual(projectWeeklySeries(history.slice(0, 2), now), []);
	const differentTime = [...history.slice(0, 2), club('x', 'Jordan Arena', '2026-10-25T17:00:00Z')];
	assert.deepEqual(projectWeeklySeries(differentTime, now), []);
	const oldHistory = history.map((event) => ({ ...event, clubs: [nyumbani] }));
	assert.deepEqual(projectWeeklySeries(oldHistory, Date.parse('2027-01-15T12:00:00Z')), []);
});

test('the timeline keeps a lookback, splits lanes and stacks overlapping events', () => {
	const official = (id: string, speed: CalendarEvent['speed'], start: string, minutes: number) => ({
		...club(id, id, start, []),
		source: 'lichess' as const,
		clubs: [],
		speed,
		endsAt: new Date(Date.parse(start) + minutes * 60_000).toISOString()
	});
	const timeline = buildTimeline(
		[
			official('b1', 'bullet', '2026-10-28T12:00:00Z', 27),
			official('b2', 'bullet', '2026-10-28T12:10:00Z', 27),
			official('b3', 'bullet', '2026-10-28T12:30:00Z', 27),
			official('old', 'bullet', '2026-10-28T10:00:00Z', 27),
			official('hyper', 'ultraBullet', '2026-10-28T12:00:00Z', 27),
			club('j', 'Jordan Arena', '2026-10-28T13:00:00Z')
		],
		now
	);
	assert.equal(timeline.start, Date.parse('2026-10-28T11:30:00Z'));
	assert.deepEqual(
		timeline.lanes.map((lane) => [
			lane.key,
			lane.rows.map((row) => row.map((item) => item.event.id))
		]),
		[
			['clubs', [['j']]],
			['bullet', [['b1', 'b3'], ['b2']]]
		]
	);
	assert.ok(timeline.end >= Date.parse('2026-10-28T14:00:00Z'));
});

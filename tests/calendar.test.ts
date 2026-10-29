import test from 'node:test';
import assert from 'node:assert/strict';
import {
	buildCalendar,
	calendarHref,
	dateLabel,
	eventSpan,
	groupByDay,
	isPast,
	localDate,
	readCalendarQuery,
	sortEvents
} from '../src/lib/calendar.ts';
import type { CalendarEvent } from '../src/lib/types/event.ts';

const event = (overrides: Partial<CalendarEvent> & Pick<CalendarEvent, 'slug'>): CalendarEvent => ({
	id: overrides.slug,
	source: 'community',
	name: overrides.slug,
	date: { start: '2026-11-01' },
	location: { kind: 'otb' },
	...overrides
});
const at = (iso: string) => Date.parse(iso);

test('local dates use Africa/Dar_es_Salaam, not UTC', () => {
	assert.equal(localDate('2026-10-31T21:30:00Z'), '2026-11-01');
	assert.equal(localDate('2026-10-31T20:30:00Z'), '2026-10-31');
});

test('a whole-day event ends at local midnight; a month event spans its month', () => {
	const day = event({ slug: 'day', date: { start: '2026-11-01', end: '2026-11-02' } });
	assert.equal(isPast(day, at('2026-11-02T20:59:00Z')), false);
	assert.equal(isPast(day, at('2026-11-02T21:00:00Z')), true);
	const month = event({ slug: 'month', date: { month: '2026-10' } });
	assert.equal(isPast(month, at('2026-10-31T20:00:00Z')), false);
	assert.equal(isPast(month, at('2026-10-31T21:00:00Z')), true);
	assert.equal(eventSpan(month).start, at('2026-09-30T21:00:00Z'));
});

test('an exact end time wins over the date', () => {
	const timed = event({
		slug: 'timed',
		startsAt: '2026-11-01T16:40:00Z',
		endsAt: '2026-11-01T18:00:00Z'
	});
	assert.equal(isPast(timed, at('2026-11-01T18:01:00Z')), true);
});

test('labels cover single days, ranges and unannounced days', () => {
	assert.equal(dateLabel(event({ slug: 'a' })), 'Sun, 1 Nov 2026');
	assert.match(
		dateLabel(event({ slug: 'b', date: { start: '2026-12-11', end: '2026-12-13' } })),
		/^Fri, 11\sDec\s–\sSun, 13 Dec 2026$/
	);
	assert.equal(dateLabel(event({ slug: 'c', date: { month: '2026-06' } })), 'June 2026');
});

test('an unannounced day sorts after dated events in its month', () => {
	const events = [
		event({ slug: 'tba', date: { month: '2026-11' } }),
		event({ slug: 'late', date: { start: '2026-11-30' } }),
		event({ slug: 'early', date: { start: '2026-11-01' } }),
		event({ slug: 'december', date: { start: '2026-12-01' } })
	];
	assert.deepEqual(
		sortEvents(events, 'upcoming').map((item) => item.slug),
		['early', 'late', 'tba', 'december']
	);
	assert.deepEqual(
		sortEvents(events, 'past').map((item) => item.slug),
		['december', 'tba', 'late', 'early']
	);
});

test('filters by view, type and month, leaves Lichess tournaments out, and groups by month', () => {
	const now = at('2026-10-28T12:00:00Z');
	const events = [
		event({ slug: 'past', date: { start: '2026-10-01' } }),
		event({ slug: 'otb', date: { start: '2026-11-01' } }),
		event({
			slug: 'club',
			source: 'club',
			date: { start: '2026-11-05' },
			location: { kind: 'online' }
		}),
		event({
			slug: 'official',
			source: 'lichess',
			date: { start: '2026-11-02' },
			location: { kind: 'online' }
		}),
		event({ slug: 'december', date: { start: '2026-12-01' } })
	];
	const upcoming = buildCalendar(events, readCalendarQuery(new URLSearchParams()), now);
	assert.deepEqual(upcoming.months, ['2026-11', '2026-12']);
	assert.deepEqual(
		upcoming.groups.map((group) => [group.month, group.events.map((item) => item.slug)]),
		[
			['2026-11', ['otb', 'club']],
			['2026-12', ['december']]
		]
	);
	const online = buildCalendar(events, readCalendarQuery(new URLSearchParams('type=online')), now);
	assert.deepEqual(
		online.groups[0].events.map((item) => item.slug),
		['club']
	);
	const month = buildCalendar(events, readCalendarQuery(new URLSearchParams('month=2026-12')), now);
	assert.equal(month.total, 1);
	const past = buildCalendar(events, readCalendarQuery(new URLSearchParams('view=past')), now);
	assert.deepEqual(
		past.groups.flatMap((group) => group.events.map((item) => item.slug)),
		['past']
	);
	const missingMonth = buildCalendar(
		events,
		readCalendarQuery(new URLSearchParams('month=2027-05')),
		now
	);
	assert.equal(missingMonth.query.month, '');
	assert.equal(missingMonth.total, 3);
});

test('queries are bounded and links omit defaults', () => {
	const query = readCalendarQuery(new URLSearchParams('view=x&month=2026-13&type=x'));
	assert.deepEqual(query, { view: 'upcoming', month: '', type: 'all' });
	assert.equal(calendarHref(query), '/calendar');
	assert.equal(
		calendarHref(query, { view: 'past', month: '2026-11', type: 'otb' }),
		'/calendar?view=past&month=2026-11&type=otb'
	);
});

test('events group by local day, then by start hour', () => {
	const at = (slug: string, startsAt: string) =>
		event({ slug, date: { start: localDate(startsAt) }, startsAt });
	const days = groupByDay([
		at('a', '2026-10-28T21:00:00Z'),
		at('b', '2026-10-28T21:30:00Z'),
		at('c', '2026-10-28T22:00:00Z'),
		event({ slug: 'allday', date: { start: '2026-10-29' } }),
		at('d', '2026-10-29T16:40:00Z'),
		event({ slug: 'tba', date: { month: '2026-10' } })
	]);
	assert.deepEqual(
		days.map((day) => [
			day.key,
			day.label,
			day.hours.map((group) => [group.hour, group.events.map((item) => item.slug)])
		]),
		[
			[
				'2026-10-29',
				'Thu, 29 Oct 2026',
				[
					[null, ['allday']],
					['00:00', ['a', 'b']],
					['01:00', ['c']],
					['19:00', ['d']]
				]
			],
			['2026-10', 'Day to be announced', [[null, ['tba']]]]
		]
	);
});

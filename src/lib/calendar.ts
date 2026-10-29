import type { CalendarEvent } from './types/event.js';

export const timeZone = 'Africa/Dar_es_Salaam';
/** Tanzania has no daylight saving time. */
const offset = '+03:00';

export type CalendarView = 'upcoming' | 'past';
export type CalendarType = 'all' | 'otb' | 'online';
export interface CalendarQuery {
	view: CalendarView;
	month: string;
	type: CalendarType;
}

const isoMonth = /^20\d{2}-(0[1-9]|1[0-2])$/;

/** The local YYYY-MM-DD for an instant. */
export const localDate = (instant: string | number | Date) =>
	new Intl.DateTimeFormat('en-CA', { timeZone, dateStyle: 'short' }).format(new Date(instant));

const lastDayOfMonth = (month: string) => {
	const [year, value] = month.split('-').map(Number);
	return new Date(Date.UTC(year, value, 0)).getUTCDate();
};

/** Start and end instants. Unknown days span the whole month; unknown times span whole days. */
export function eventSpan(event: CalendarEvent): { start: number; end: number } {
	if ('month' in event.date) {
		const { month } = event.date;
		return {
			start: Date.parse(`${month}-01T00:00:00${offset}`),
			end: Date.parse(`${month}-${lastDayOfMonth(month)}T23:59:59${offset}`)
		};
	}
	const start = event.startsAt
		? Date.parse(event.startsAt)
		: Date.parse(`${event.date.start}T00:00:00${offset}`);
	const end = event.endsAt
		? Date.parse(event.endsAt)
		: Date.parse(`${event.date.end ?? event.date.start}T23:59:59${offset}`);
	return { start, end };
}

export const eventMonth = (event: CalendarEvent) =>
	'month' in event.date ? event.date.month : event.date.start.slice(0, 7);

export const isPast = (event: CalendarEvent, now: number) => eventSpan(event).end < now;

/** Upcoming events run soonest first; a day to be announced follows dated events in its month. */
export function sortEvents(events: CalendarEvent[], view: CalendarView): CalendarEvent[] {
	const key = (event: CalendarEvent) =>
		'month' in event.date
			? Date.parse(`${event.date.month}-${lastDayOfMonth(event.date.month)}T23:59:59${offset}`)
			: eventSpan(event).start;
	return events.toSorted((a, b) => {
		const order = key(a) - key(b) || a.name.localeCompare(b.name);
		return view === 'upcoming' ? order : -order;
	});
}

const dayFormat = new Intl.DateTimeFormat('en-GB', {
	timeZone: 'UTC',
	weekday: 'short',
	day: 'numeric',
	month: 'short',
	year: 'numeric'
});
const monthFormat = new Intl.DateTimeFormat('en-GB', {
	timeZone: 'UTC',
	month: 'long',
	year: 'numeric'
});
const asUTC = (date: string) => new Date(`${date}T00:00:00Z`);

export const monthLabel = (month: string) => monthFormat.format(asUTC(`${month}-01`));

/** For example "Sat, 5 Dec 2026", "Sat, 5 – Sun, 6 Dec 2026" or "December 2026". */
export function dateLabel(event: CalendarEvent): string {
	if ('month' in event.date) return monthLabel(event.date.month);
	const { start, end } = event.date;
	if (!end || end === start) return dayFormat.format(asUTC(start));
	return dayFormat.formatRange(asUTC(start), asUTC(end));
}

export function readCalendarQuery(params: URLSearchParams): CalendarQuery {
	const view = params.get('view') === 'past' ? 'past' : 'upcoming';
	const month = params.get('month') ?? '';
	const type = params.get('type');
	return {
		view,
		month: isoMonth.test(month) ? month : '',
		type: type === 'otb' || type === 'online' ? type : 'all'
	};
}

export function calendarHref(query: CalendarQuery, changes: Partial<CalendarQuery> = {}): string {
	const next = { ...query, ...changes };
	const params = new URLSearchParams();
	if (next.view === 'past') params.set('view', 'past');
	if (next.month) params.set('month', next.month);
	if (next.type !== 'all') params.set('type', next.type);
	const search = params.toString();
	return search ? `/calendar?${search}` : '/calendar';
}

export interface CalendarListing {
	query: CalendarQuery;
	months: string[];
	groups: { month: string; events: CalendarEvent[] }[];
	total: number;
}

/** Apply view, type and month, then group by month. Official Lichess tournaments belong to 24/7 chess, not the calendar. */
export function buildCalendar(
	events: CalendarEvent[],
	query: CalendarQuery,
	now: number
): CalendarListing {
	const inView = events.filter(
		(event) =>
			isPast(event, now) === (query.view === 'past') &&
			event.source !== 'lichess' &&
			(query.type === 'all' || event.location.kind === query.type)
	);
	const months = [...new Set(sortEvents(inView, query.view).map(eventMonth))];
	const month = months.includes(query.month) ? query.month : '';
	const shown = sortEvents(
		inView.filter((event) => !month || eventMonth(event) === month),
		query.view
	);
	const groups: { month: string; events: CalendarEvent[] }[] = [];
	for (const event of shown) {
		const key = eventMonth(event);
		if (groups.at(-1)?.month === key) groups.at(-1)!.events.push(event);
		else groups.push({ month: key, events: [event] });
	}
	return { query: { ...query, month }, months, groups, total: shown.length };
}

export interface CalendarDay {
	/** YYYY-MM-DD, or the month for events whose day is not announced. */
	key: string;
	label: string;
	hours: { hour: string | null; events: CalendarEvent[] }[];
}

const hourFormat = new Intl.DateTimeFormat('en-GB', {
	timeZone,
	hour: '2-digit',
	hour12: false
});

/**
 * One node per local day, keeping the given order. Within a day, events that
 * start in the same local hour share a group; events without a time come first.
 */
export function groupByDay(events: CalendarEvent[]): CalendarDay[] {
	const days: CalendarDay[] = [];
	for (const event of events) {
		const key = 'month' in event.date ? event.date.month : event.date.start;
		let day = days.find((item) => item.key === key);
		if (!day) {
			day = {
				key,
				label:
					'month' in event.date
						? 'Day to be announced'
						: dayFormat.format(new Date(`${key}T00:00:00Z`)),
				hours: []
			};
			days.push(day);
		}
		const hour = event.startsAt ? `${hourFormat.format(new Date(event.startsAt))}:00` : null;
		const group = day.hours.find((item) => item.hour === hour);
		if (group) group.events.push(event);
		else day.hours.push({ hour, events: [event] });
	}
	for (const day of days) day.hours.sort((a, b) => (a.hour ?? '').localeCompare(b.hour ?? ''));
	return days;
}

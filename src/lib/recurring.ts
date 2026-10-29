import { localDate, timeZone } from './calendar.ts';
import type { CalendarEvent } from './types/event.js';

const week = 7 * 24 * 60 * 60 * 1000;
/** A series needs this many tournaments in the lookback window. */
const minOccurrences = 3;
const lookbackWeeks = 6;

const localTime = new Intl.DateTimeFormat('en-GB', {
	timeZone,
	weekday: 'short',
	hour: '2-digit',
	minute: '2-digit',
	hour12: false
});

/** Drop edition numbers such as "XXVIII" or "5th", so numbered editions share a name. */
const seriesName = (name: string) =>
	name
		.replace(/^(?:[IVXLCDM]+|\d+(?:st|nd|rd|th)?)\s+/i, '')
		.replace(/\s+(?:#?\d+|[IVXLCDM]+)$/i, '')
		.trim();

/**
 * Clubs often create their weekly tournaments only on the day. When a club has
 * played the same weekday, local start time and time control at least three
 * times in six weeks, project the coming weeks as expected events. A real
 * tournament from the club on that date replaces the projection.
 */
export function projectWeeklySeries(
	events: CalendarEvent[],
	now: number,
	weeks = 4
): CalendarEvent[] {
	const series = new Map<string, CalendarEvent[]>();
	for (const event of events) {
		if (event.source !== 'club' || !event.startsAt || !event.clubs?.length) continue;
		const start = Date.parse(event.startsAt);
		if (start < now - lookbackWeeks * week) continue;
		const key = [event.clubs[0].url, localTime.format(start), event.format, event.timeControl].join(
			'|'
		);
		series.set(key, [...(series.get(key) ?? []), event]);
	}
	const projected: CalendarEvent[] = [];
	for (const group of series.values()) {
		if (group.length < minOccurrences) continue;
		const latest = group.toSorted((a, b) => Date.parse(b.startsAt!) - Date.parse(a.startsAt!))[0];
		const names = new Map<string, number>();
		for (const event of group) {
			const name = seriesName(event.name);
			names.set(name, (names.get(name) ?? 0) + 1);
		}
		const name = [...names].toSorted((a, b) => b[1] - a[1])[0][0];
		const club = latest.clubs![0];
		const duration = latest.endsAt ? Date.parse(latest.endsAt) - Date.parse(latest.startsAt!) : 0;
		const taken = new Set(
			events
				.filter((event) => event.clubs?.some((item) => item.url === club.url) && event.startsAt)
				.map((event) => localDate(event.startsAt!))
		);
		let start = Date.parse(latest.startsAt!);
		while (start < now) start += week;
		for (let index = 0; index < weeks; index++, start += week) {
			const date = localDate(start);
			if (taken.has(date)) continue;
			const id = `expected-${club.url.split('/').pop()}-${date}-${new Date(start).toISOString().slice(11, 16).replace(':', '')}`;
			projected.push({
				id,
				slug: id,
				source: 'club',
				clubs: [club],
				name,
				date: { start: date },
				startsAt: new Date(start).toISOString(),
				...(duration > 0 ? { endsAt: new Date(start + duration).toISOString() } : {}),
				location: { kind: 'online', platform: 'Lichess', url: club.url },
				format: latest.format,
				speed: latest.speed,
				timeControl: latest.timeControl,
				expected: true
			});
		}
	}
	return projected;
}

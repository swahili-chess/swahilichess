import type { CalendarEvent } from './types/event.js';

export interface TimelineItem {
	event: CalendarEvent;
	start: number;
	end: number;
}
export interface TimelineLane {
	key: 'clubs' | 'bullet' | 'blitz' | 'rapid';
	label: string;
	/** Items in one row never overlap. */
	rows: TimelineItem[][];
}
export interface Timeline {
	start: number;
	end: number;
	lanes: TimelineLane[];
}

const minute = 60_000;
/** Show what has just started, and what Lichess has scheduled ahead. */
const lookBehind = 30 * minute;
const maxAhead = 8 * 60 * minute;
const fallbackLength = 60 * minute;

const lanes: { key: TimelineLane['key']; label: string }[] = [
	{ key: 'clubs', label: 'Tanzanian clubs' },
	{ key: 'bullet', label: 'Bullet' },
	{ key: 'blitz', label: 'Blitz' },
	{ key: 'rapid', label: 'Rapid' }
];

const laneFor = (event: CalendarEvent): TimelineLane['key'] | null =>
	event.source === 'club'
		? 'clubs'
		: event.speed === 'bullet' || event.speed === 'blitz' || event.speed === 'rapid'
			? event.speed
			: null;

/** Lay out timed online events that overlap the window into lanes and non-overlapping rows. */
export function buildTimeline(events: CalendarEvent[], now: number): Timeline {
	const windowStart = Math.floor((now - lookBehind) / (10 * minute)) * 10 * minute;
	const items: (TimelineItem & { lane: TimelineLane['key'] })[] = [];
	for (const event of events) {
		const lane = laneFor(event);
		if (!lane || event.location.kind !== 'online' || !event.startsAt || event.status) continue;
		const start = Date.parse(event.startsAt);
		const end = event.endsAt ? Date.parse(event.endsAt) : start + fallbackLength;
		if (end <= windowStart || start > now + maxAhead) continue;
		items.push({ event, start, end, lane });
	}
	const windowEnd = Math.min(
		now + maxAhead,
		Math.max(now + 2 * 60 * minute, ...items.map((item) => item.end))
	);
	return {
		start: windowStart,
		end: Math.ceil(windowEnd / (10 * minute)) * 10 * minute,
		lanes: lanes
			.map(({ key, label }) => {
				const rows: TimelineItem[][] = [];
				for (const { lane, ...item } of items
					.filter((candidate) => candidate.lane === key)
					.toSorted((a, b) => a.start - b.start || a.end - b.end)) {
					const row = rows.find((existing) => existing.at(-1)!.end <= item.start);
					if (row) row.push(item);
					else rows.push([item]);
				}
				return { key, label, rows };
			})
			.filter((lane) => lane.rows.length > 0)
	};
}

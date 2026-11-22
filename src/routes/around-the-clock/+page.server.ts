import { EVENTS_SHEET_URL, PRIZES_SHEET_URL, RATINGS_API_URL } from '$app/env/private';
import { buildTimeline } from '#lib/clock.js';
import { readCalendarEvents } from '#lib/server/calendar.js';
import type { PageServerLoad } from './$types';

/** The timeline keeps only online tournaments; the sheet adds prizes to Lichess ones. */
export const load: PageServerLoad = async ({ fetch }) => {
	const now = Date.now();
	const { events, online } = await readCalendarEvents(
		{ ratings: RATINGS_API_URL, events: EVENTS_SHEET_URL, prizes: PRIZES_SHEET_URL },
		fetch,
		now
	);
	return { timeline: buildTimeline(events, now), now, onlineState: online.state };
};

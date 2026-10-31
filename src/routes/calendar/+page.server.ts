import { EVENTS_SHEET_URL, PRIZES_SHEET_URL, RATINGS_API_URL } from '$app/env/private';
import { buildCalendar, readCalendarQuery } from '#lib/calendar.js';
import { readCalendarEvents } from '#lib/server/calendar.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, fetch }) => {
	const now = Date.now();
	const { events, online, created } = await readCalendarEvents(
		{ ratings: RATINGS_API_URL, events: EVENTS_SHEET_URL, prizes: PRIZES_SHEET_URL },
		fetch,
		now
	);
	return {
		now,
		calendar: buildCalendar(events, readCalendarQuery(url.searchParams), now),
		onlineState: online.state,
		createdState: created
	};
};

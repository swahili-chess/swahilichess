import { RATINGS_API_URL } from '$app/env/private';
import { buildCalendar, readCalendarQuery } from '#lib/calendar.js';
import { readCalendarEvents } from '#lib/server/calendar.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, fetch }) => {
	const now = Date.now();
	const { events, online } = await readCalendarEvents(RATINGS_API_URL, fetch, now);
	return {
		now,
		calendar: buildCalendar(events, readCalendarQuery(url.searchParams), now),
		onlineState: online.state,
		onlineFetchedAt: online.fetchedAt
	};
};

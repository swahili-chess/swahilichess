import { RATINGS_API_URL } from '$app/env/private';
import { buildTimeline } from '#lib/clock.js';
import { readCalendarEvents } from '#lib/server/calendar.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const now = Date.now();
	const { events, online } = await readCalendarEvents(RATINGS_API_URL, fetch, now);
	return { timeline: buildTimeline(events, now), now, onlineState: online.state };
};

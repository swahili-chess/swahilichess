import { createdEvents } from '#lib/content/events.js';
import { projectWeeklySeries } from '#lib/recurring.js';
import { readEventsSnapshot, type EventsSnapshot } from './events.ts';
import type { CalendarEvent } from '#lib/types/event.js';

/** Created events, the saved club and official Lichess snapshot, and expected weekly club events. */
export async function readCalendarEvents(
	baseURL: string | undefined,
	fetcher: typeof fetch,
	now = Date.now()
): Promise<{ events: CalendarEvent[]; online: EventsSnapshot }> {
	const online = await readEventsSnapshot(baseURL, fetcher);
	return {
		events: [...createdEvents, ...online.events, ...projectWeeklySeries(online.events, now)],
		online
	};
}

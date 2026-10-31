import { projectWeeklySeries } from '#lib/recurring.js';
import { readSheetEvents, withExtras, type SheetEvents } from './sheet.ts';
import { readEventsSnapshot, type EventsSnapshot } from './events.ts';
import type { CalendarEvent } from '#lib/types/event.js';

export type CalendarSources = {
	events: CalendarEvent[];
	online: EventsSnapshot;
	created: SheetEvents['state'];
};

/**
 * Events from the Google Sheet, the saved club and official Lichess snapshot
 * with prizes added in the sheet, and expected weekly club events.
 */
export async function readCalendarEvents(
	urls: { ratings: string | undefined; events: string | undefined; prizes: string | undefined },
	fetcher: typeof fetch,
	now = Date.now()
): Promise<CalendarSources> {
	const [sheet, online] = await Promise.all([
		readSheetEvents({ events: urls.events, prizes: urls.prizes }, fetcher, now),
		readEventsSnapshot(urls.ratings, fetcher)
	]);
	const lichess = withExtras(online.events, sheet.extras);
	return {
		events: [...sheet.events, ...lichess, ...projectWeeklySeries(lichess, now)],
		online,
		created: sheet.state
	};
}

import { dev } from '$app/env';
import { EVENTS_SHEET_URL, PRIZES_SHEET_URL, RATINGS_API_URL } from '$app/env/private';
import { isPast, sortEvents } from '#lib/calendar.js';
import { readFideSnapshot } from '#lib/server/fide.js';
import { readCalendarEvents } from '#lib/server/calendar.js';
import type { HomepageData, RankedPlayer } from '#lib/types/home.js';
import type { PageServerLoad } from './$types';

const state = (value: string) => (value === 'stale' || value === 'error' ? value : 'ready');

export const load: PageServerLoad = async ({ url, fetch }): Promise<HomepageData> => {
	if (dev && url.searchParams.get('fixture') === 'empty') {
		return { playersState: 'ready', players: [], events: [], eventsState: 'ready' };
	}
	const [snapshot, calendar] = await Promise.all([
		readFideSnapshot(RATINGS_API_URL, fetch),
		readCalendarEvents(
			{ ratings: RATINGS_API_URL, events: EVENTS_SHEET_URL, prizes: PRIZES_SHEET_URL },
			fetch
		)
	]);
	const players: RankedPlayer[] = snapshot.players.map((player) => ({
		id: player.id,
		name: player.name,
		title: player.title,
		profileUrl: player.profileUrl,
		ratings: {
			standard: player.ratings.standard?.value ?? null,
			rapid: player.ratings.rapid?.value ?? null,
			blitz: player.ratings.blitz?.value ?? null
		}
	}));
	// Official Lichess tournaments stay on the calendar; the homepage shows the community's own.
	const now = Date.now();
	const events = sortEvents(
		calendar.events.filter((event) => event.source !== 'lichess' && !isPast(event, now)),
		'upcoming'
	).slice(0, 3);
	return {
		playersState: state(snapshot.state),
		players,
		events,
		eventsState: calendar.created === 'error' ? 'error' : state(calendar.online.state)
	};
};

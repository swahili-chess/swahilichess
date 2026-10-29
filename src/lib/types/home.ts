import type { CalendarEvent } from './event.js';

/** FIDE categories, shown in the homepage rankings. */
export type RatingFormat = 'standard' | 'rapid' | 'blitz';
export interface RankedPlayer {
	id: string;
	name: string;
	title?: string;
	profileUrl?: string;
	ratings: Record<RatingFormat, number | null>;
}
export interface HomepageData {
	playersState: 'ready' | 'stale' | 'error';
	players: RankedPlayer[];
	/** Next upcoming created and club events. */
	events: CalendarEvent[];
	eventsState: 'ready' | 'stale' | 'error';
}

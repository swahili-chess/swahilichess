import { localDate } from '../calendar.ts';
import type { CalendarEvent } from '../types/event.js';
import { isObject } from './ratings.ts';

export type EventsSnapshot = {
	events: CalendarEvent[];
	fetchedAt: string | null;
	state: 'ready' | 'stale' | 'error';
};

const eventID = /^lichess-(arena|swiss)-[A-Za-z0-9]{8}$/;
const teamID = /^[a-z0-9][a-z0-9-]{1,79}$/;
const speeds: Record<string, string> = {
	ultraBullet: 'UltraBullet',
	bullet: 'Bullet',
	blitz: 'Blitz',
	rapid: 'Rapid',
	classical: 'Classical'
};
const fractions: Record<number, string> = { 15: '¼', 30: '½', 45: '¾' };
const instant = (value: unknown) =>
	typeof value === 'string' && Number.isFinite(Date.parse(value)) ? value : null;

/** Clock limits arrive in seconds; display minutes, as Lichess does: 180 + 2 → "3+2". */
export const timeControl = (limit: number, increment: number) =>
	`${limit % 60 === 0 ? limit / 60 : (fractions[limit] ?? (limit / 60).toFixed(1))}+${increment}`;

/** Validate the API boundary. Links are rebuilt from IDs, never taken from the payload. */
export function parseEventsSnapshot(value: unknown): EventsSnapshot {
	if (
		!isObject(value) ||
		!instant(value.fetchedAt) ||
		typeof value.stale !== 'boolean' ||
		!Array.isArray(value.clubs) ||
		!Array.isArray(value.events) ||
		value.events.length > 5000
	)
		throw new Error('Invalid events snapshot');
	const clubs = new Map<string, { name: string; url: string }>();
	for (const club of value.clubs) {
		if (
			!isObject(club) ||
			typeof club.id !== 'string' ||
			!teamID.test(club.id) ||
			typeof club.name !== 'string' ||
			!club.name.trim() ||
			club.name.length > 100
		)
			throw new Error('Invalid club');
		clubs.set(club.id, { name: club.name, url: `https://lichess.org/team/${club.id}` });
	}
	const seen = new Set<string>();
	const events = value.events.map((event: unknown): CalendarEvent => {
		const startsAt = isObject(event) ? instant(event.startsAt) : null;
		const finishesAt = isObject(event) ? instant(event.finishesAt) : null;
		if (
			!isObject(event) ||
			typeof event.id !== 'string' ||
			!eventID.test(event.id) ||
			seen.has(event.id) ||
			event.provider !== 'lichess' ||
			(event.origin !== 'club' && event.origin !== 'official') ||
			typeof event.name !== 'string' ||
			!event.name.trim() ||
			event.name.length > 200 ||
			!startsAt ||
			(event.finishesAt !== undefined && !finishesAt) ||
			typeof event.speed !== 'string' ||
			!(event.speed in speeds) ||
			typeof event.variant !== 'string' ||
			!isObject(event.clock) ||
			!Number.isInteger(event.clock.limit) ||
			!Number.isInteger(event.clock.increment) ||
			(event.clubs !== undefined &&
				(!Array.isArray(event.clubs) || event.clubs.some((id) => !clubs.has(id as string))))
		)
			throw new Error('Invalid event');
		seen.add(event.id);
		const [, system, sourceID] = event.id.split('-');
		const variant = event.variant === 'chess960' ? ' Chess960' : '';
		const rounds = Number.isInteger(event.rounds) && (event.rounds as number) > 0;
		return {
			id: event.id,
			slug: event.id,
			source: event.origin === 'club' ? 'club' : 'lichess',
			clubs: ((event.clubs as string[] | undefined) ?? []).map((id) => clubs.get(id)!),
			name: event.name,
			date: { start: localDate(startsAt) },
			startsAt,
			...(finishesAt ? { endsAt: finishesAt } : {}),
			location: {
				kind: 'online',
				platform: 'Lichess',
				url: `https://lichess.org/${system === 'swiss' ? 'swiss' : 'tournament'}/${sourceID}`
			},
			speed: event.speed as CalendarEvent['speed'],
			format: `${speeds[event.speed]}${variant}${system === 'swiss' ? ' Swiss' : ' Arena'}${rounds ? ` · ${event.rounds} rounds` : ''}`,
			timeControl: timeControl(event.clock.limit as number, event.clock.increment as number)
		};
	});
	return { events, fetchedAt: value.fetchedAt as string, state: value.stale ? 'stale' : 'ready' };
}

export async function readEventsSnapshot(
	baseURL: string | undefined,
	fetcher: typeof fetch
): Promise<EventsSnapshot> {
	try {
		if (!baseURL) throw new Error('RATINGS_API_URL is not configured');
		const response = await fetcher(new URL('/events', baseURL), {
			signal: AbortSignal.timeout(5000),
			headers: { Accept: 'application/json' }
		});
		if (!response.ok) throw new Error(`Events API returned ${response.status}`);
		return parseEventsSnapshot(await response.json());
	} catch (error) {
		console.warn(
			'Events snapshot unavailable:',
			error instanceof Error ? error.message : 'Unknown error'
		);
		return { events: [], fetchedAt: null, state: 'error' };
	}
}

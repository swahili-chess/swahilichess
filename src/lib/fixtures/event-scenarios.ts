import { localDate } from '#lib/calendar.js';
import type { CalendarEvent } from '#lib/types/event.js';

/** Development gallery only. These are fictional events and awards that exercise every card state. */
export function eventScenarios(now: number): CalendarEvent[] {
	const demo = (event: Omit<CalendarEvent, 'id' | 'source'>): CalendarEvent => ({
		...event,
		id: event.slug,
		source: 'community'
	});
	const countdown = new Date(now + 45 * 60_000).toISOString();
	return [
		demo({
			slug: 'demo-rated-open',
			name: 'Dar es Salaam Open',
			date: { start: '2026-11-14' },
			startsAt: '2026-11-14T09:00:00+03:00',
			location: {
				kind: 'otb',
				city: 'Dar es Salaam',
				venue: 'Venue to be confirmed',
				fideRated: true
			},
			format: 'Rapid',
			timeControl: '15+10',
			entryFee: { currency: 'TZS', amount: 20000 },
			prizes: {
				currency: 'TZS',
				awards: [
					{ category: '1st place', amount: 500000 },
					{ category: '2nd place', amount: 300000 },
					{ category: '3rd place', amount: 200000 }
				]
			}
		}),
		demo({
			slug: 'demo-club-rapid',
			name: 'Saturday Club Rapid',
			date: { start: '2026-11-15' },
			startsAt: '2026-11-15T10:00:00+03:00',
			location: {
				kind: 'otb',
				fideRated: false,
				city: 'Arusha',
				venue: 'Club room · venue to be confirmed'
			},
			format: 'Rapid',
			timeControl: '10+5',
			entryFee: { currency: 'TZS', amount: 0 },
			prizes: null
		}),
		demo({
			slug: 'demo-lichess-countdown',
			name: 'Community Blitz',
			date: { start: localDate(countdown) },
			startsAt: countdown,
			location: { kind: 'online', platform: 'Lichess' },
			format: 'Blitz',
			timeControl: '3+2'
		}),
		demo({
			slug: 'demo-chesscom',
			name: 'Sunday Bullet Cup',
			date: { start: '2026-11-22' },
			startsAt: '2026-11-22T19:00:00+03:00',
			location: { kind: 'online', platform: 'Chess.com' },
			format: 'Bullet',
			timeControl: '1+1',
			entryFee: { currency: 'TZS', amount: 0 },
			prizes: {
				currency: 'TZS',
				awards: [
					{ category: '1st place', amount: 100000 },
					{ category: '2nd place', amount: 60000 },
					{ category: '3rd place', amount: 40000 },
					{ category: 'Best junior', amount: 25000 }
				]
			}
		}),
		demo({
			slug: 'demo-long-event',
			name: 'Tanzania Schools and Universities Rapid Championship',
			date: { start: '2026-12-05', end: '2026-12-06' },
			startsAt: '2026-12-05T09:30:00+03:00',
			location: {
				kind: 'otb',
				fideRated: true,
				city: 'Dar es Salaam',
				venue: 'Main auditorium, university sports and recreation centre'
			},
			format: 'Rapid',
			timeControl: '25+10',
			prizes: {
				currency: 'TZS',
				awards: [
					{ category: 'Open champion', amount: 1000000 },
					{ category: 'Open runner-up', amount: 600000 },
					{ category: 'Open third place', amount: 400000 },
					{ category: 'Best university player', amount: 150000 },
					{ category: 'Best secondary school player', amount: 150000 },
					{ category: 'Best under-12 player', amount: 100000 }
				]
			}
		}),
		demo({
			slug: 'demo-paid-no-prizes',
			name: 'Mwanza Weekend Blitz',
			date: { start: '2026-12-12' },
			startsAt: '2026-12-12T14:00:00+03:00',
			location: { kind: 'otb', fideRated: false, city: 'Mwanza', venue: 'Venue to be confirmed' },
			format: 'Blitz',
			timeControl: '5+3',
			entryFee: { currency: 'TZS', amount: 5000 },
			prizes: { currency: 'TZS', awards: [] }
		}),
		demo({
			slug: 'demo-date-tba',
			name: 'Regional Junior Championship',
			date: { month: '2027-01' },
			location: { kind: 'otb' }
		}),
		demo({
			slug: 'demo-cancelled',
			name: 'Cancelled Online Arena',
			date: { start: '2026-12-20' },
			status: 'cancelled',
			location: { kind: 'online' }
		})
	];
}

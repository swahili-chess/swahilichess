import { sampleTournaments } from './home.js';
import type { Tournament } from '#lib/types/home.js';

/** Development gallery only. These are fictional events and awards. */
export function eventScenarios(now: number): Tournament[] {
	return [
		{ ...sampleTournaments[0] },
		{
			id: 'demo-club-rapid',
			name: 'Saturday Club Rapid',
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
		},
		{
			...sampleTournaments[1],
			id: 'demo-lichess-countdown',
			startsAt: new Date(now + 45 * 60_000).toISOString()
		},
		{
			id: 'demo-chesscom',
			name: 'Sunday Bullet Cup',
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
		},
		{
			id: 'demo-long-event',
			name: 'Tanzania Schools and Universities Rapid Championship',
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
		},
		{
			id: 'demo-paid-no-prizes',
			name: 'Mwanza Weekend Blitz',
			startsAt: '2026-12-12T14:00:00+03:00',
			location: { kind: 'otb', fideRated: false, city: 'Mwanza', venue: 'Venue to be confirmed' },
			format: 'Blitz',
			timeControl: '5+3',
			entryFee: { currency: 'TZS', amount: 5000 },
			prizes: { currency: 'TZS', awards: [] }
		}
	];
}

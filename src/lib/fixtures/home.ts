import { samplePlayers } from './foundation.js';
import type { HomepageData } from '#lib/types/home.js';

/** Fictional fixtures, never real ratings or bookable tournaments. */
export const sampleHomepage: HomepageData = {
	sample: true,
	playersSample: true,
	playersState: 'ready',
	players: samplePlayers,
	tournaments: [
		{
			id: 'sample-dar-rapid',
			name: 'Dar es Salaam Open',
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
		},
		{
			id: 'sample-online-blitz',
			name: 'Community Blitz',
			startsAt: '2026-11-21T10:00:00+03:00',
			location: { kind: 'online', platform: 'Lichess' },
			format: 'Blitz',
			timeControl: '3+2'
		}
	]
};

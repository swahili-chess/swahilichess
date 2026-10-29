import type { CalendarEvent } from '#lib/types/event.js';

type Created = Omit<CalendarEvent, 'id' | 'source'>;

/**
 * The 2026 calendar published on the current chess.tz site, migrated as written.
 * Its Prodigies online blitz entries were removed: Nyumbani Mates' weekly Sunday
 * arenas come from Lichess instead.
 * Unknown days, venues, times and formats stay empty rather than guessed. The
 * CMS replaces this list in a later checkpoint.
 */
const created: Created[] = [
	{
		slug: 'urafiki-gambit-2026',
		name: '1st Urafiki Gambit (Tanzania Poland Friendship Chess Tournament: Two Nation One Board)',
		date: { start: '2026-02-07', end: '2026-02-08' },
		location: {
			kind: 'otb',
			venue: 'Polish Embassy, 15 Mitwara Road, Masaki',
			city: 'Dar es Salaam'
		}
	},
	{
		slug: 'akes-interschool-2026',
		name: 'AKES Interschool Chess Tournament 2nd Edition',
		date: { start: '2026-02-14' },
		location: { kind: 'otb', venue: 'Agakhan Primary School' }
	},
	{
		slug: 'donbosco-anniversary-2026',
		name: 'Donbosco Anniversary Tournament',
		date: { start: '2026-03-01' },
		location: { kind: 'otb', venue: 'DBC, Upanga' }
	},
	{
		slug: 'tanzanite-junior-championship-2026',
		name: 'Tanzanite Junior Chess Championship 2026',
		date: { start: '2026-04-04', end: '2026-04-05' },
		location: { kind: 'otb', city: 'Dar es Salaam' }
	},
	{
		slug: 'tanzania-national-championship-2026',
		name: 'Tanzania National Chess Championship 2026 and Qualifier for Team Olympiad',
		date: { start: '2026-05-01', end: '2026-05-03' },
		location: { kind: 'otb' }
	},
	{
		slug: 'ultimate-junior-rapid-2026',
		name: '2nd Ultimate Junior Rapid Chess Tournament',
		date: { month: '2026-06' },
		location: { kind: 'otb', venue: 'The Cube Restaurant' }
	},
	{
		slug: 'dbc-july-rapid-2026',
		name: 'DBC July Rapid Tournament',
		date: { start: '2026-07-05' },
		location: { kind: 'otb', venue: 'DBC, Upanga' }
	},
	{
		slug: 'taca-rapid-championship-2026',
		name: 'TACA Rapid Chess Championship 2026',
		date: { start: '2026-08-08', end: '2026-08-09' },
		location: { kind: 'otb' }
	},
	{
		slug: 'rising-star-summer-camp-3-2026',
		name: 'August Rising Star Summer Camp Series 3',
		date: { month: '2026-08' },
		location: { kind: 'otb' }
	},
	{
		slug: 'chess-olympiad-2026',
		name: 'Team Tanzania to Participate in 46th Chess Olympiad in Samarkand, Uzbekistan',
		date: { start: '2026-09-15', end: '2026-09-28' },
		location: { kind: 'otb', venue: 'World Chess Olympiad', city: 'Samarkand, Uzbekistan' }
	},
	{
		slug: 'ist-interschool-individual-2026',
		name: '6th IST Interschool Individual Chess Tournament',
		date: { month: '2026-10' },
		location: { kind: 'otb' }
	},
	{
		slug: 'dbc-november-blitz-2026',
		name: 'DBC November Blitz Tournament',
		date: { start: '2026-11-01' },
		location: { kind: 'otb', venue: 'DBC, Upanga' }
	},
	{
		slug: 'jordan-watoto-ya-nne-2026',
		name: 'Jordan Watoto ya NNE',
		date: { start: '2026-12-05' },
		location: { kind: 'otb', venue: 'Jordan University College', city: 'Morogoro' }
	},
	{
		slug: 'jordan-open-ya-sita-2026',
		name: 'Jordan Open - Ya Sita',
		date: { start: '2026-12-05', end: '2026-12-06' },
		location: { kind: 'otb', venue: 'Jordan University College', city: 'Morogoro' }
	},
	{
		slug: 'tanzania-open-championship-2026',
		name: 'Tanzania Open Chess Championship 2026',
		date: { start: '2026-12-11', end: '2026-12-13' },
		location: { kind: 'otb' }
	},
	{
		slug: 'justfit-interschool-games-2026',
		name: 'Justfit Interschool Games',
		date: { month: '2026-12' },
		location: { kind: 'otb' }
	},
	{
		slug: 'new-year-eve-online-blitz-2026',
		name: 'New Year Eve TZ Online Blitz',
		date: { start: '2026-12-31' },
		location: { kind: 'online' }
	}
];

export const createdEvents: CalendarEvent[] = created.map((event) => ({
	...event,
	id: `community-${event.slug}`,
	source: 'community'
}));

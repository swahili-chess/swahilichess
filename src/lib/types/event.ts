/** Who the event comes from. Official Lichess events are filtered separately from community ones. */
export type EventSource = 'community' | 'club' | 'lichess';

/** Local Africa/Dar_es_Salaam dates. A month alone means the day is not announced yet. */
export type EventDate = { start: string; end?: string } | { month: string };

export type EventLocation =
	| {
			kind: 'otb';
			/** Omitted while the venue is to be announced. */
			venue?: string;
			city?: string;
			/** Omitted when the rating status is not published. */
			fideRated?: boolean;
			registrationUrl?: string;
	  }
	| { kind: 'online'; platform?: 'Lichess' | 'Chess.com'; url?: string };

export interface CalendarEvent {
	id: string;
	/** Stable identifier, also used for expected club events. */
	slug: string;
	source: EventSource;
	clubs?: { name: string; url: string }[];
	name: string;
	date: EventDate;
	/** Exact start, when published. */
	startsAt?: string;
	endsAt?: string;
	location: EventLocation;
	status?: 'cancelled' | 'postponed';
	/** Projected from a club's weekly series; the club has not created it yet. */
	expected?: boolean;
	format?: string;
	timeControl?: string;
	/** Lichess speed category, for online tournaments. */
	speed?: 'ultraBullet' | 'bullet' | 'blitz' | 'rapid' | 'classical';
	/** Omit when no prize pool is published. */
	prizes?: { currency: string; awards: { category: string; amount: number }[] } | null;
	/** Omit when unspecified; an explicit zero means free entry. */
	entryFee?: { currency: string; amount: number } | null;
}

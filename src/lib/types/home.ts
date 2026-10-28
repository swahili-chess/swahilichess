export type RatingFormat = 'rapid' | 'blitz' | 'bullet';
export interface RankedPlayer {
	id: string;
	name: string;
	handle: string;
	ratings: Record<RatingFormat, number | null>;
}
export interface Tournament {
	id: string;
	name: string;
	startsAt: string;
	location:
		| { kind: 'otb'; city: string; venue: string; fideRated: boolean; registrationUrl?: string }
		| { kind: 'online'; platform: 'Lichess' | 'Chess.com'; tournamentUrl?: string };
	format: string;
	timeControl: string;
	/** Omit when no prize pool is published. */
	prizes?: { currency: string; awards: { category: string; amount: number }[] } | null;
	/** Omit when unspecified; an explicit zero means free entry. */
	entryFee?: { currency: string; amount: number } | null;
}
export interface HomepageData {
	sample: boolean;
	players: RankedPlayer[];
	tournaments: Tournament[];
}

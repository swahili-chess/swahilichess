export type RatingFormat = 'rapid' | 'blitz' | 'bullet';
export interface RankedPlayer {
	id: string;
	name: string;
	handle?: string;
	profileUrl?: string;
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
	/** Applies to tournaments. Rankings carry their own flag. */
	sample: boolean;
	playersSample: boolean;
	playersState: 'ready' | 'stale' | 'error';
	players: RankedPlayer[];
	tournaments: Tournament[];
}

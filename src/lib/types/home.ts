/** FIDE categories, shown in the homepage rankings. */
export type RatingFormat = 'standard' | 'rapid' | 'blitz';
export interface RankedPlayer {
	id: string;
	name: string;
	title?: string;
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
	/** True while tournaments are fixtures. Rankings are always real FIDE data. */
	sample: boolean;
	playersState: 'ready' | 'stale' | 'error';
	players: RankedPlayer[];
	tournaments: Tournament[];
}

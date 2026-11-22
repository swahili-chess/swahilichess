export type RatingProvider = 'lichess' | 'chesscom' | 'fide';
export type RatingCategory = 'standard' | 'rapid' | 'blitz' | 'bullet';
export type RatingValue = { value: number; provisional?: boolean };
export type LeaderboardPlayer = {
	id: string;
	name: string;
	handle?: string;
	title?: string;
	inactive?: boolean;
	profileUrl?: string;
	ratings: Partial<Record<RatingCategory, RatingValue | null>>;
};
export type LeaderboardQuery = {
	provider: RatingProvider;
	category: RatingCategory;
	q: string;
	page: number;
};
export type LeaderboardRow = LeaderboardPlayer & { rank: number; rating: RatingValue };
export type LeaderboardView = LeaderboardQuery & {
	rows: LeaderboardRow[];
	total: number;
	ratedCount: number;
	unratedCount: number;
	pageCount: number;
	perPage: number;
};
export type LeaderboardState = 'ready' | 'empty' | 'error' | 'loading' | 'stale';

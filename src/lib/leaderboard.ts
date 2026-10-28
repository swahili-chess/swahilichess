import type {
	LeaderboardPlayer,
	LeaderboardQuery,
	LeaderboardView,
	RatingCategory,
	RatingProvider
} from './types/leaderboard.js';

export const providers = [
	{
		value: 'lichess',
		label: 'Lichess',
		url: 'https://lichess.org',
		coverage: 'Players on our maintained Tanzania list.'
	},
	{
		value: 'chesscom',
		label: 'Chess.com',
		url: 'https://www.chess.com',
		coverage: 'Accounts identified with Tanzania on Chess.com.'
	},
	{
		value: 'fide',
		label: 'FIDE',
		url: 'https://ratings.fide.com',
		coverage: 'Active players registered with the Tanzania federation.'
	}
] as const;
export const categoryLabels: Record<RatingCategory, string> = {
	standard: 'Standard',
	rapid: 'Rapid',
	blitz: 'Blitz',
	bullet: 'Bullet'
};
export const categoriesFor = (provider: RatingProvider): RatingCategory[] =>
	provider === 'fide' ? ['standard', 'rapid', 'blitz'] : ['rapid', 'blitz', 'bullet'];
export function readLeaderboardQuery(params: URLSearchParams): LeaderboardQuery {
	const provider =
		providers.find((item) => item.value === params.get('provider'))?.value ?? 'lichess';
	const categories = categoriesFor(provider);
	const category = categories.find((item) => item === params.get('category')) ?? categories[0];
	const rawPage = Number(params.get('page') ?? 1);
	return {
		provider,
		category,
		q: (params.get('q') ?? '').trim().slice(0, 100),
		page: Number.isSafeInteger(rawPage) && rawPage > 0 ? rawPage : 1
	};
}
export function rankLeaderboard(
	players: LeaderboardPlayer[],
	query: LeaderboardQuery
): LeaderboardView {
	const eligible = players.filter((player) => query.provider !== 'fide' || !player.inactive);
	const rated = eligible
		.filter((player) => (player.ratings[query.category]?.value ?? 0) > 0)
		.toSorted(
			(a, b) =>
				b.ratings[query.category]!.value - a.ratings[query.category]!.value ||
				a.id.localeCompare(b.id)
		);
	let rank = 0;
	const rows = rated.map((player, index) => {
		const rating = player.ratings[query.category]!;
		if (index === 0 || rating.value !== rated[index - 1].ratings[query.category]!.value)
			rank = index + 1;
		return { ...player, rating, rank };
	});
	const search = query.q.toLocaleLowerCase('en');
	const filtered = rows.filter((player) =>
		`${player.name} ${player.handle ?? ''} ${player.id}`.toLocaleLowerCase('en').includes(search)
	);
	const perPage = 10;
	const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));
	const page = Math.min(query.page, pageCount);
	return {
		...query,
		page,
		perPage,
		pageCount,
		total: filtered.length,
		ratedCount: rated.length,
		unratedCount: eligible.length - rated.length,
		rows: filtered.slice((page - 1) * perPage, page * perPage)
	};
}
export function leaderboardHref(
	query: LeaderboardQuery,
	changes: Partial<LeaderboardQuery> = {}
): string {
	const next = { ...query, ...changes };
	if (!categoriesFor(next.provider).includes(next.category))
		next.category = categoriesFor(next.provider)[0];
	const params = new URLSearchParams({ provider: next.provider, category: next.category });
	if (next.q) params.set('q', next.q);
	if (next.page > 1) params.set('page', String(next.page));
	return `/leaderboards?${params}`;
}

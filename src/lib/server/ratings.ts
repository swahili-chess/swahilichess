import type { LeaderboardPlayer, LeaderboardState } from '../types/leaderboard.js';

export type Snapshot = {
	players: LeaderboardPlayer[];
	snapshotAt: string | null;
	ratingMonth: string | null;
	state: LeaderboardState;
};

export const isObject = (value: unknown): value is Record<string, unknown> =>
	typeof value === 'object' && value !== null && !Array.isArray(value);

/** Read one saved provider snapshot. Failures never fall back to sample players. */
export async function readSnapshot(
	baseURL: string | undefined,
	fetcher: typeof fetch,
	path: string,
	parse: (value: unknown) => Snapshot,
	label: string
): Promise<Snapshot> {
	try {
		if (!baseURL) throw new Error('RATINGS_API_URL is not configured');
		const response = await fetcher(new URL(path, baseURL), {
			signal: AbortSignal.timeout(5000),
			headers: { Accept: 'application/json' }
		});
		if (!response.ok) throw new Error(`Ratings API returned ${response.status}`);
		return parse(await response.json());
	} catch (error) {
		console.warn(
			`${label} snapshot unavailable:`,
			error instanceof Error ? error.message : 'Unknown error'
		);
		return { players: [], snapshotAt: null, ratingMonth: null, state: 'error' };
	}
}

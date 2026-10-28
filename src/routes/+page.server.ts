import { dev } from '$app/env';
import { RATINGS_API_URL } from '$app/env/private';
import { sampleTournaments } from '#lib/fixtures/home.js';
import { readFideSnapshot } from '#lib/server/fide.js';
import type { HomepageData, RankedPlayer } from '#lib/types/home.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, fetch }): Promise<HomepageData> => {
	const fixture = dev ? url.searchParams.get('fixture') : null;
	if (fixture === 'empty') {
		return { sample: true, playersState: 'ready', players: [], tournaments: [] };
	}
	const snapshot = await readFideSnapshot(RATINGS_API_URL, fetch);
	const players: RankedPlayer[] = snapshot.players.map((player) => ({
		id: player.id,
		name: player.name,
		title: player.title,
		profileUrl: player.profileUrl,
		ratings: {
			standard: player.ratings.standard?.value ?? null,
			rapid: player.ratings.rapid?.value ?? null,
			blitz: player.ratings.blitz?.value ?? null
		}
	}));
	// Tournaments remain fixtures until the calendar and CMS checkpoints.
	const now = Date.now();
	const tournaments =
		fixture === 'countdown'
			? sampleTournaments.map((event) => ({
					...event,
					startsAt: new Date(now + 45 * 60_000).toISOString()
				}))
			: sampleTournaments;
	return {
		sample: true,
		playersState:
			snapshot.state === 'stale' ? 'stale' : snapshot.state === 'error' ? 'error' : 'ready',
		players,
		tournaments
	};
};

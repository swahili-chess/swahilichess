import { dev } from '$app/env';
import { RATINGS_API_URL } from '$app/env/private';
import { sampleHomepage } from '#lib/fixtures/home.js';
import { readLichessSnapshot } from '#lib/server/lichess.js';
import type { HomepageData, RankedPlayer } from '#lib/types/home.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, fetch }): Promise<HomepageData> => {
	if (dev && url.searchParams.get('fixture') === 'empty') {
		return { ...sampleHomepage, players: [], tournaments: [] };
	}
	if (dev && url.searchParams.get('fixture') === 'countdown') {
		const now = Date.now();
		return {
			...sampleHomepage,
			tournaments: sampleHomepage.tournaments.map((event) => ({
				...event,
				startsAt: new Date(now + 45 * 60_000).toISOString()
			}))
		};
	}
	// Tournaments remain fixtures until the calendar and CMS checkpoints.
	const snapshot = await readLichessSnapshot(RATINGS_API_URL, fetch);
	const players: RankedPlayer[] = snapshot.players.map((player) => ({
		id: player.id,
		name: player.name,
		profileUrl: player.profileUrl,
		ratings: {
			rapid: player.ratings.rapid?.value ?? null,
			blitz: player.ratings.blitz?.value ?? null,
			bullet: player.ratings.bullet?.value ?? null
		}
	}));
	return {
		...sampleHomepage,
		playersSample: false,
		playersState:
			snapshot.state === 'stale' ? 'stale' : snapshot.state === 'error' ? 'error' : 'ready',
		players
	};
};

import { sampleHomepage } from '#lib/fixtures/home.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ url }) => {
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
	return sampleHomepage;
};
import { dev } from '$app/env';

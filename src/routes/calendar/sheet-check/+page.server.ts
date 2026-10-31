import { EVENTS_SHEET_URL, PRIZES_SHEET_URL } from '$app/env/private';
import { readSheetEvents } from '#lib/server/sheet.js';
import type { PageServerLoad } from './$types';

/** For people editing the events sheet: which rows the website skipped, and why. */
export const load: PageServerLoad = async ({ fetch, setHeaders }) => {
	setHeaders({ 'cache-control': 'no-store', 'x-robots-tag': 'noindex, nofollow' });
	const sheet = await readSheetEvents(
		{ events: EVENTS_SHEET_URL, prizes: PRIZES_SHEET_URL },
		fetch
	);
	return {
		state: sheet.state,
		events: sheet.events.length,
		prizes: sheet.extras.size,
		problems: sheet.problems
	};
};

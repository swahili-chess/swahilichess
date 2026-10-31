import { error } from '@sveltejs/kit';
import { dev } from '$app/env';
import events from '../../../../../docs/sheet-templates/events.csv?raw';
import prizes from '../../../../../docs/sheet-templates/lichess-prizes.csv?raw';
import type { RequestHandler } from './$types';

/** Development only: serves the sheet templates as if Google published them, so the calendar works without a sheet. */
const tabs: Record<string, string> = { 'events.csv': events, 'lichess-prizes.csv': prizes };

export const GET: RequestHandler = ({ params }) => {
	if (!dev || !(params.tab in tabs)) error(404, 'Page not found');
	return new Response(tabs[params.tab], { headers: { 'content-type': 'text/csv; charset=utf-8' } });
};

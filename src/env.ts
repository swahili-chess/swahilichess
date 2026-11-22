import { defineEnvVars } from '@sveltejs/kit/env';

const serviceURL = (name: string) => (value: string | undefined) => {
	if (!value) return undefined;
	const url = new URL(value);
	if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) {
		throw new Error(`${name} must be an HTTP(S) URL without credentials`);
	}
	return url.origin;
};
/** Google's published CSV links, or a local address for development. */
const sheetURL = (name: string) => (value: string | undefined) => {
	if (!value) return undefined;
	const url = new URL(value);
	const local = url.protocol === 'http:' && ['127.0.0.1', 'localhost'].includes(url.hostname);
	if (!local && (url.protocol !== 'https:' || url.hostname !== 'docs.google.com')) {
		throw new Error(`${name} must be a published Google Sheets CSV link`);
	}
	return url.toString();
};

export const variables = defineEnvVars({
	RATINGS_API_URL: {
		description: 'Server-only base URL of the Go ratings API',
		schema: serviceURL('RATINGS_API_URL')
	},
	EVENTS_SHEET_URL: {
		description: 'The Events tab of the events Google Sheet, published to the web as CSV',
		schema: sheetURL('EVENTS_SHEET_URL')
	},
	PRIZES_SHEET_URL: {
		description: 'The Lichess prizes tab of the events Google Sheet, published to the web as CSV',
		schema: sheetURL('PRIZES_SHEET_URL')
	}
});

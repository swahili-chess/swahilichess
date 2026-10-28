import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	RATINGS_API_URL: {
		description: 'Server-only base URL of the Go ratings API',
		schema: (value) => {
			if (!value) return undefined;
			const url = new URL(value);
			if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) {
				throw new Error('RATINGS_API_URL must be an HTTP(S) URL without credentials');
			}
			return url.origin;
		}
	}
});

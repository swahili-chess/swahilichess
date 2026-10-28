import { dev } from '$app/env';
import { error } from '@sveltejs/kit';
import { eventScenarios } from '#lib/fixtures/event-scenarios.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	if (!dev) error(404, 'Page not found');
	return { events: eventScenarios(Date.now()) };
};

import { dev } from '$app/env';
import { error } from '@sveltejs/kit';

export function load() {
	if (!dev) error(404, 'Page not found');
}

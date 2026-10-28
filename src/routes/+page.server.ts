import { dev } from '$app/env';
import { redirect } from '@sveltejs/kit';

export function load() {
	if (dev) redirect(307, '/preview');
}

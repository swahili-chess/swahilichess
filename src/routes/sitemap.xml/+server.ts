import { publicPaths, siteUrl } from '#lib/site.js';

export const prerender = true;

export function GET() {
	const urls = publicPaths
		.map((path) => `\t<url><loc>${new URL(path, siteUrl).href}</loc></url>`)
		.join('\n');
	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
		{ headers: { 'content-type': 'application/xml' } }
	);
}

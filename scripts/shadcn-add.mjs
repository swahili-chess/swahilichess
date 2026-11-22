import { readFile, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';

// shadcn-svelte 1.7.1's config reader cannot resolve Kit 3's $app/tsconfig alias.
// Temporarily spell out the same generated file for the CLI, then restore it.
// Run with the dev server stopped. Remove when the upstream parser supports Kit 3.
const components = process.argv.slice(2);
if (!components.length) {
	console.error('Usage: pnpm ui:add button card');
	process.exit(1);
}

const configUrl = new URL('../tsconfig.json', import.meta.url);
const original = await readFile(configUrl, 'utf8');
const config = JSON.parse(original);
if (config.extends !== '$app/tsconfig') throw new Error('Unexpected tsconfig extends value');

const sync = spawnSync('pnpm', ['run', 'prepare'], { stdio: 'inherit' });
if (sync.status !== 0) process.exit(sync.status ?? 1);

try {
	config.extends = './node_modules/$app/tsconfig.json';
	await writeFile(configUrl, JSON.stringify(config, null, '\t') + '\n');
	const result = spawnSync('pnpm', ['exec', 'shadcn-svelte', 'add', ...components], {
		stdio: 'inherit'
	});
	process.exitCode = result.status ?? 1;
} finally {
	await writeFile(configUrl, original);
}

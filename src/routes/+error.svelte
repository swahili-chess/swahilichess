<script lang="ts">
	import { page } from '$app/state';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Empty from '#lib/components/ui/empty/index.js';
	import SiteHeader from '#lib/components/site/SiteHeader.svelte';
	import SiteFooter from '#lib/components/site/SiteFooter.svelte';

	const notFound = $derived(page.status === 404);
	const destinations = [
		{ label: 'Leaderboards', href: '/leaderboards' },
		{ label: '24/7 chess', href: '/around-the-clock' },
		{ label: 'Calendar', href: '/calendar' }
	];
</script>

<svelte:head>
	<title>{notFound ? 'Page not found' : 'Something went wrong'} · chess.tz</title>
</svelte:head>

<Button href="#main-content" class="skip-link">Skip to content</Button>
<div class="flex min-h-dvh flex-col">
	<SiteHeader />
	<main
		id="main-content"
		tabindex="-1"
		class="site-container flex flex-1 items-center justify-center py-10 outline-none sm:py-14"
	>
		<Empty.Root class="max-w-xl">
			<Empty.Header class="max-w-lg">
				<p class="error-status" aria-hidden="true">{page.status}</p>
				<Empty.Title class="text-3xl font-semibold tracking-tight sm:text-4xl">
					<h1>{notFound ? 'Page not found' : 'Something went wrong'}</h1>
				</Empty.Title>
				<Empty.Description class="text-base">
					{notFound
						? 'The link may be old or mistyped. These pages might be what you were looking for.'
						: 'This is a problem on our side. Try again in a moment.'}
				</Empty.Description>
			</Empty.Header>
			<Empty.Content class="max-w-lg">
				<div class="flex flex-wrap justify-center gap-2">
					{#if notFound}
						<Button href="/" class="min-h-11">Go to home</Button>
						{#each destinations as destination (destination.href)}
							<Button href={destination.href} variant="outline" class="min-h-11">
								{destination.label}
							</Button>
						{/each}
					{:else}
						<Button
							href={page.url.pathname + page.url.search}
							class="min-h-11"
							data-sveltekit-reload
						>
							Try again
						</Button>
						<Button href="/" variant="outline" class="min-h-11">Go to home</Button>
					{/if}
				</div>
			</Empty.Content>
		</Empty.Root>
	</main>
	<SiteFooter />
</div>

<style>
	.error-status {
		font-family: 'Londrina Shadow', cursive;
		font-size: clamp(5rem, 22vw, 8rem);
		line-height: 1;
		letter-spacing: 0.065em;
		color: var(--title-blue);
	}
</style>

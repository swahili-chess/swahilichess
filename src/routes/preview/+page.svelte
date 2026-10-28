<script lang="ts">
	import { ArrowUpRight, Check, LoaderCircle } from '@lucide/svelte';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Card from '#lib/components/ui/card/index.js';
	import HomeHero from '#lib/components/site/HomeHero.svelte';
	import SiteFooter from '#lib/components/site/SiteFooter.svelte';
	import EventPreview from '#lib/components/site/EventPreview.svelte';

	let saved = $state(false);
</script>

<svelte:head>
	<title>chess.tz · Foundation preview</title>
	<meta name="robots" content="noindex, nofollow" />
	<meta name="description" content="A local design preview for the next chess.tz website." />
</svelte:head>

<Button href="#home" class="skip-link">Skip to content</Button>
<main id="main-content" tabindex="-1" class="outline-none">
	<HomeHero homePath="/preview" />
	<div class="site-container pt-10 pb-14 sm:pb-20">
		<div class="max-w-xl pt-4"><EventPreview /></div>

		<section id="review-controls" class="mt-10 border-t pt-7" aria-labelledby="review-title">
			<h2 id="review-title" class="mb-5 text-sm font-medium">Preview controls</h2>
			<Card.Root class="gap-0 py-0">
				<Card.Content class="flex flex-wrap items-center gap-3 p-5">
					<Button onclick={() => (saved = !saved)} aria-pressed={saved} class="min-w-32"
						>{#if saved}<Check class="size-4" />Saved{:else}Save sample{/if}</Button
					>
					<Button
						variant="outline"
						onclick={() => {
							saved = false;
						}}>Reset preview</Button
					>
					<Button variant="ghost" href="#home">Back to top <ArrowUpRight class="size-4" /></Button>
					<Button disabled>Unavailable</Button>
					<Button variant="outline" disabled aria-busy="true"
						><LoaderCircle class="size-4 animate-spin motion-reduce:animate-none" />Loading</Button
					>
					<span class="ml-auto text-xs text-muted-foreground" role="status"
						>{saved ? 'Sample saved.' : ''}</span
					>
				</Card.Content>
			</Card.Root>
		</section>
	</div>
</main>
<SiteFooter />

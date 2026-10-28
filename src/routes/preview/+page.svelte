<script lang="ts">
	import { ArrowUpRight, MessageCircle, Check, LoaderCircle, Pause, Play } from '@lucide/svelte';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Tabs from '#lib/components/ui/tabs/index.js';
	import * as Card from '#lib/components/ui/card/index.js';
	import SiteHeader from '#lib/components/site/SiteHeader.svelte';
	import SiteFooter from '#lib/components/site/SiteFooter.svelte';
	import EventPreview from '#lib/components/site/EventPreview.svelte';
	import RankingPreview from '#lib/components/site/RankingPreview.svelte';
	import type { PreviewState } from '#lib/fixtures/foundation.js';

	let previewState = $state<PreviewState>('ready');
	let saved = $state(false);
	let motionPaused = $state(false);
	let heroVisible = $state(true);
	let pageVisible = $state(true);
	const headlineLines = ['Chess', 'brings us', 'together.'];

	function observeHero(element: HTMLElement) {
		pageVisible = !document.hidden;
		const observer = new IntersectionObserver(([entry]) => {
			heroVisible = entry.isIntersecting;
		});
		observer.observe(element);
		return () => observer.disconnect();
	}
	const states: { value: PreviewState; label: string }[] = [
		{ value: 'ready', label: 'Sample data' },
		{ value: 'loading', label: 'Loading' },
		{ value: 'empty', label: 'Empty' },
		{ value: 'error', label: 'Error' }
	];
</script>

<svelte:head>
	<title>chess.tz · Foundation preview</title>
	<meta name="robots" content="noindex, nofollow" />
	<meta name="description" content="A local design preview for the next chess.tz website." />
</svelte:head>

<svelte:document onvisibilitychange={() => (pageVisible = !document.hidden)} />

<Button href="#home" class="skip-link">Skip to content</Button>
<main id="main-content" tabindex="-1" class="outline-none">
	<div
		class="hero-stage"
		data-motion-paused={motionPaused || !heroVisible || !pageVisible}
		{@attach observeHero}
	>
		<div class="hero-atmosphere" aria-hidden="true">
			<div class="hero-light"></div>
			<div class="hero-arc"></div>
			<div class="hero-glass"></div>
		</div>
		<div class="hero-panel">
			<SiteHeader embedded />
			<Button
				variant="ghost"
				size="icon"
				class="hero-motion-toggle size-11"
				aria-label={motionPaused ? 'Resume background animation' : 'Pause background animation'}
				title={motionPaused ? 'Resume background animation' : 'Pause background animation'}
				onclick={() => (motionPaused = !motionPaused)}
			>
				{#if motionPaused}<Play class="size-4" />{:else}<Pause class="size-4" />{/if}
			</Button>
			<section id="home" class="intro-section" tabindex="-1" aria-labelledby="hero-title">
				<div class="hero-composition">
					<h1 id="hero-title">
						<span class="sr-only">Chess brings us together.</span>
						{#each headlineLines as line (line)}
							<span class="hero-line" aria-hidden="true"><span>{line}</span></span>
						{/each}
					</h1>
				</div>
				<div class="hero-bottom">
					<p class="hero-description">A community for everyone who loves the game in Tanzania.</p>
					<div class="hero-actions">
						<Button
							href="https://chat.whatsapp.com/ELHXyyug2VbA9XFfR8l7vi"
							target="_blank"
							rel="noreferrer"
							class="h-11 px-4"
							><MessageCircle class="size-4" />Join us on WhatsApp<ArrowUpRight
								class="size-4"
							/></Button
						>
						<Button variant="ghost" href="#calendar" class="h-11 px-4 text-foreground"
							>View events<ArrowUpRight class="size-4" /></Button
						>
					</div>
				</div>
			</section>
		</div>
	</div>
	<div class="site-container pt-10 pb-14 sm:pb-20">
		<div class="grid items-start gap-5 pt-4 lg:grid-cols-[1.55fr_1fr]">
			<section id="leaderboard" aria-labelledby="rankings-title" class="min-w-0">
				<RankingPreview displayState={previewState} onReset={() => (previewState = 'ready')} />
			</section>
			<div class="min-w-0"><EventPreview /></div>
		</div>

		<section id="review-controls" class="mt-10 border-t pt-7" aria-labelledby="review-title">
			<div class="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
				<h2 id="review-title" class="text-sm font-medium">Preview controls</h2>
				<Tabs.Root bind:value={previewState}>
					<Tabs.List aria-label="Ranking preview state" class="h-10 w-full sm:w-auto">
						{#each states as option (option.value)}<Tabs.Trigger
								value={option.value}
								class="px-2 sm:px-3">{option.label}</Tabs.Trigger
							>{/each}
					</Tabs.List>
				</Tabs.Root>
			</div>
			<Card.Root class="gap-0 py-0">
				<Card.Content class="flex flex-wrap items-center gap-3 p-5">
					<Button onclick={() => (saved = !saved)} aria-pressed={saved} class="min-w-32"
						>{#if saved}<Check class="size-4" />Saved{:else}Save sample{/if}</Button
					>
					<Button
						variant="outline"
						onclick={() => {
							previewState = 'ready';
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

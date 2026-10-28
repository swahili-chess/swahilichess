<script lang="ts">
	import { ArrowUpRight, MessageCircle, Pause, Play } from '@lucide/svelte';
	import { Button } from '#lib/components/ui/button/index.js';
	import SiteHeader from './SiteHeader.svelte';
	import { communityUrl } from '#lib/site.js';
	let { homePath = '/' }: { homePath?: string } = $props();
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
</script>

<svelte:document onvisibilitychange={() => (pageVisible = !document.hidden)} />

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
		<SiteHeader embedded {homePath} />
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
					<Button href={communityUrl} target="_blank" rel="noopener noreferrer" class="h-11 px-4"
						><MessageCircle class="size-4" />Join us on WhatsApp<ArrowUpRight
							class="size-4"
						/></Button
					>
					<Button variant="ghost" href={`${homePath}#calendar`} class="h-11 px-4 text-foreground"
						>View events<ArrowUpRight class="size-4" /></Button
					>
				</div>
			</div>
		</section>
	</div>
</div>

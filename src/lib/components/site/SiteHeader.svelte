<script lang="ts">
	import ChessKnight from '@lucide/svelte/icons/chess-knight';
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Sheet from '#lib/components/ui/sheet/index.js';
	import * as NavigationMenu from '#lib/components/ui/navigation-menu/index.js';
	import { navigationMenuTriggerStyle } from '#lib/components/ui/navigation-menu/navigation-menu-trigger.svelte';
	import { communityUrl } from '#lib/site.js';

	let {
		embedded = false,
		homePath = '/',
		currentPage
	}: {
		embedded?: boolean;
		homePath?: string;
		currentPage?: 'leaderboards' | 'calendar' | 'around-the-clock' | 'taca';
	} = $props();

	const links = $derived([
		{ label: 'Home', href: homePath },
		{ label: 'Leaderboards', href: '/leaderboards' },
		{ label: '24/7 chess', href: '/around-the-clock' },
		{ label: 'Calendar', href: '/calendar' },
		{ label: 'TACA', href: '/taca' }
	]);
	const current = (href: string) => (href === `/${currentPage}` ? 'page' : undefined);
	let menuOpen = $state(false);
</script>

<header class={embedded ? 'hero-header' : 'border-b bg-background'}>
	<div
		class={[
			'flex items-center justify-between gap-4',
			embedded ? 'hero-header-inner' : 'site-container h-18'
		]}
	>
		<a
			href={homePath}
			class="flex shrink-0 items-center gap-2 rounded-md text-xl font-semibold tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
			aria-label="chess.tz home"
		>
			<ChessKnight class="size-7" strokeWidth={1.6} aria-hidden="true" />
			<span>chess<span class={embedded ? 'text-inherit' : 'text-muted-foreground'}>.tz</span></span>
		</a>

		<NavigationMenu.Root viewport={false} class="hidden lg:flex" aria-label="Main navigation">
			<NavigationMenu.List class="gap-0.5">
				{#each links as link (link.label)}
					<NavigationMenu.Item>
						<NavigationMenu.Link
							href={link.href}
							aria-current={current(link.href)}
							class={[
								navigationMenuTriggerStyle(),
								'font-normal',
								embedded ? 'text-foreground' : 'text-muted-foreground'
							]}>{link.label}</NavigationMenu.Link
						>
					</NavigationMenu.Item>
				{/each}
			</NavigationMenu.List>
		</NavigationMenu.Root>

		<div class="flex items-center gap-2">
			<Button
				href={communityUrl}
				target="_blank"
				rel="noopener noreferrer"
				class="hidden sm:inline-flex"
			>
				Join community <ArrowUpRight class="size-3.5" aria-hidden="true" />
			</Button>
			<Sheet.Root bind:open={menuOpen}>
				<Sheet.Trigger>
					{#snippet child({ props })}
						<Button
							{...props}
							variant="ghost"
							size="icon"
							class="size-11 lg:hidden"
							aria-label="Open navigation"
						>
							<svg
								class="size-6"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="1.8"
								stroke-linecap="round"
								aria-hidden="true"
							>
								<path d="M3 8h18M10 16h11" />
							</svg>
						</Button>
					{/snippet}
				</Sheet.Trigger>
				<Sheet.Content
					class={['overflow-y-auto', embedded && 'hero-menu-surface']}
					aria-describedby={undefined}
				>
					<Sheet.Header class="px-5 pt-6">
						<Sheet.Title class="flex items-center gap-2 pr-10 text-xl tracking-tight">
							<ChessKnight class="size-7" strokeWidth={1.6} aria-hidden="true" />
							chess.tz
						</Sheet.Title>
					</Sheet.Header>
					<nav aria-label="Mobile navigation" class="flex flex-col gap-1 px-4">
						{#each links as link (link.label)}
							<Button
								variant="ghost"
								href={link.href}
								aria-current={current(link.href)}
								class="h-11 justify-start"
								onclick={() => (menuOpen = false)}
							>
								{link.label}
							</Button>
						{/each}
					</nav>
					<Sheet.Footer class="px-5 pb-6">
						<Button href={communityUrl} target="_blank" rel="noopener noreferrer">
							Join community <ArrowUpRight class="size-3.5" aria-hidden="true" />
						</Button>
					</Sheet.Footer>
				</Sheet.Content>
			</Sheet.Root>
		</div>
	</div>
</header>

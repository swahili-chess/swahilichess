<script lang="ts">
	import { communityUrl } from '#lib/site.js';
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import { Button } from '#lib/components/ui/button/index.js';
</script>

<footer class="border-t bg-background">
	<div
		class="site-container flex flex-col gap-5 py-8 sm:flex-row sm:items-center sm:justify-between"
	>
		<p class="text-sm leading-6 text-muted-foreground">
			Developed by
			<Button
				variant="link"
				href="https://flexcodelabs.com/"
				target="_blank"
				rel="noopener noreferrer"
				class="inline h-auto min-h-0! p-0 text-sm text-foreground">Flexcode Labs</Button
			>
			&amp;
			<Button
				variant="link"
				href="https://subcode.africa/"
				target="_blank"
				rel="noopener noreferrer"
				class="inline h-auto min-h-0! p-0 text-sm text-foreground">Subcodes Africa</Button
			>.
		</p>
		<nav aria-label="Community links" class="-ml-3 flex items-center gap-1 sm:ml-0">
			<Button
				variant="ghost"
				href={communityUrl}
				target="_blank"
				rel="noopener noreferrer"
				class="text-muted-foreground"
			>
				WhatsApp <ArrowUpRight class="size-3.5" aria-hidden="true" />
			</Button>
			<Button
				variant="ghost"
				href="https://github.com/swahili-chess/swahilichess"
				target="_blank"
				rel="noopener noreferrer"
				class="text-muted-foreground"
			>
				GitHub <ArrowUpRight class="size-3.5" aria-hidden="true" />
			</Button>
		</nav>
	</div>
</footer>

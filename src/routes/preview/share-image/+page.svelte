<script lang="ts">
	import ChessKnight from '@lucide/svelte/icons/chess-knight';
</script>

<!--
	The link preview image (static/share.png), drawn from the hero's styles.
	Regenerate it after changing the hero: screenshot this page at 1200 x 630 with headless Chrome
	and save it as a JPEG under 300 KB.
-->
<svelte:head><title>Share image · chess.tz</title></svelte:head>

<div class="hero-stage share-card" data-motion-paused="true">
	<div class="hero-atmosphere" aria-hidden="true">
		<div class="hero-light"></div>
		<div class="hero-arc"></div>
		<div class="hero-glass"></div>
	</div>
	<p class="share-headline">Chess brings<br />us together.</p>
	<div class="share-footer">
		<span class="flex items-center gap-2 text-3xl font-semibold tracking-tight">
			<ChessKnight class="size-10" strokeWidth={1.6} aria-hidden="true" />chess.tz
		</span>
		<span class="text-xl">A community for everyone who loves the game in Tanzania.</span>
	</div>
</div>

<style>
	.share-card {
		display: flex;
		flex-direction: column;
		width: 1200px;
		height: 630px;
		padding: 0 64px;
		overflow: hidden;
	}
	.share-headline {
		flex: 1;
		display: grid;
		place-items: center;
		font-family: 'Londrina Shadow', cursive;
		font-size: 128px;
		line-height: 1.08;
		letter-spacing: 0.065em;
		text-align: center;
	}
	.share-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 32px;
		padding-block: 36px;
		border-top: 1px solid rgb(24 24 27 / 35%);
	}
</style>

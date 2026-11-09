<!--
	The wordmark, and the easter egg (ADR 0008): click it three times and it
	flips to the alt site's name, which then links there. The alt URL is only
	decoded after the trigger, in the browser, so it never appears in the HTML.
-->
<script lang="ts">
	import { PUBLIC_SITE_URL } from '$app/env/public';
	import { altUrl as decodeAltUrl } from '#lib/alt-url.js';
	import { cn } from '#lib/utils.js';

	// Lets a page restyle the wordmark (the teaser shows it as its eyebrow).
	let { class: className }: { class?: string } = $props();

	const name = new URL(PUBLIC_SITE_URL).hostname;
	const clicksToFlip = 3;
	const clickWindowMs = 1500;

	let clicks: number[] = [];
	let altUrl = $state<string | null>(null);

	function onclick() {
		const now = Date.now();
		clicks = [...clicks.filter((time) => now - time < clickWindowMs), now];
		if (clicks.length >= clicksToFlip) altUrl = decodeAltUrl();
	}
</script>

{#if altUrl}
	<a
		class={cn(
			'font-heading text-primary text-lg font-medium underline-offset-4 hover:underline',
			className
		)}
		href={altUrl}
		rel="nofollow noreferrer"
	>
		{new URL(altUrl).hostname}
	</a>
{:else}
	<!-- A plain button so it's reachable by keyboard; nothing hints at what it does. -->
	<button
		type="button"
		class={cn('font-heading cursor-default text-lg font-medium', className)}
		{onclick}
	>
		{name}
	</button>
{/if}

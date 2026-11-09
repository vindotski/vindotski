<script lang="ts">
	import './layout.css';
	import { onMount } from 'svelte';
	import { arriveScript } from '@vindotski/crossover';
	import favicon from '#lib/assets/favicon.svg';
	import Crossover from '#lib/components/Crossover.svelte';
	import { isPreview } from '#lib/env.js';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	// A hint for the curious, without giving anything away.
	onMount(() => console.log('Some names read both ways. Try knocking three times.'));
</script>

<svelte:head>
	<!-- Plays the reveal when arriving from the alt site (ADRs 0017, 0019). -->
	{@html `<script>${arriveScript}</script>`}
	<link rel="icon" href={favicon} />
	{#if isPreview}
		<!-- Error pages and anything without <Seo> are noindex on previews too. -->
		<meta name="robots" content="noindex, nofollow" />
	{/if}
</svelte:head>

{@render children()}

<Crossover />

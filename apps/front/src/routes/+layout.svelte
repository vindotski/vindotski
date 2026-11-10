<script lang="ts">
	import './layout.css';
	import { onMount } from 'svelte';
	import { arriveScript } from '@vindotski/crossover';
	import favicon from '#lib/assets/favicon.svg';
	import Crossover from '#lib/components/Crossover.svelte';
	import { isPreview } from '#lib/env.js';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	// Plays the reveal when arriving from the alt site (ADRs 0017, 0019). Keep the closing tag split
	// and out of the markup: Vite's dependency scan reads any script element it finds in a .svelte
	// file as code, so a literal one broke the scan, and the late re-bundling then loaded two Svelte
	// runtimes and threw during hydration.
	const arriveTag = `<script>${arriveScript}</` + 'script>';

	// A hint for the curious, without giving anything away.
	onMount(() => console.log('Some names read both ways. Try knocking three times.'));
</script>

<svelte:head>
	{@html arriveTag}
	<link rel="icon" href={favicon} />
	{#if isPreview}
		<!-- Error pages and anything without <Seo> are noindex on previews too. -->
		<meta name="robots" content="noindex, nofollow" />
	{/if}
</svelte:head>

{@render children()}

<Crossover />

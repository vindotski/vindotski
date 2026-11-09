<!--
	Pull past the bottom of the page to go down to the alt site (ADRs 0017,
	0019). A bar fills along the bottom in the alt site's red, with a label
	once the pull is underway; at the end, its darkness rises and the alt site
	takes over. The URL is decoded in the browser only, so the prerendered HTML
	never contains it.
-->
<script lang="ts">
	import { attachCrossover } from '@vindotski/crossover';
	import { onMount } from 'svelte';
	import { altUrl } from '#lib/alt-url.js';

	let progress = $state(0);
	let host = $state('');

	onMount(() => {
		host = new URL(altUrl()).hostname;
		return attachCrossover({
			getUrl: altUrl,
			edge: 'bottom',
			onProgress: (value) => (progress = value)
		});
	});
</script>

<div
	class="crossover-bar"
	style:--crossover-progress={progress}
	data-idle={progress === 0 ? '' : undefined}
	aria-hidden="true"
></div>
<p
	class="crossover-label bg-background/80 text-foreground px-2 py-1 font-mono text-xs tracking-wider uppercase backdrop-blur"
	data-show={progress > 0.3 ? '' : undefined}
	aria-hidden="true"
>
	{progress > 0.7 ? `↓ ${host}` : 'Keep going'}
</p>

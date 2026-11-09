<!--
	The light switch is the portal (ADR 0019): vin.ski is always light, and
	"lights out" takes you down to the alt site, its darkness rising from below.
	The URL is decoded only on click, so the HTML never contains it.
-->
<script lang="ts">
	import Moon from '@lucide/svelte/icons/moon';
	import { crossTo } from '@vindotski/crossover';
	import { altUrl } from '#lib/alt-url.js';
	import { Button } from '#lib/components/ui/button/index.js';

	let { class: className }: { class?: string } = $props();
</script>

<Button
	variant="ghost"
	size="icon-sm"
	class={className}
	onclick={() => crossTo(altUrl(), { direction: 'down' })}
	aria-label="Lights out"
	title="Lights out"
>
	<Moon />
</Button>

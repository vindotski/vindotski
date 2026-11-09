<!--
	Cycles the color mode: system → light → dark (ADR 0016). vin.ski starts on
	system. The choice is stored per site by @vindotski/theme/color-mode.
-->
<script lang="ts">
	import Monitor from '@lucide/svelte/icons/monitor';
	import Moon from '@lucide/svelte/icons/moon';
	import Sun from '@lucide/svelte/icons/sun';
	import { onMount } from 'svelte';
	import {
		type ColorMode,
		getColorMode,
		nextColorMode,
		setColorMode
	} from '@vindotski/theme/color-mode';
	import { Button } from '#lib/components/ui/button/index.js';

	let { class: className }: { class?: string } = $props();

	// Pages are prerendered, so the real mode is only known in the browser.
	let mode = $state<ColorMode>('system');
	onMount(() => (mode = getColorMode('system')));

	const names: Record<ColorMode, string> = { system: 'System', light: 'Light', dark: 'Dark' };

	function toggle() {
		mode = nextColorMode(mode);
		setColorMode(mode);
	}
</script>

<Button
	variant="ghost"
	size="icon-sm"
	class={className}
	onclick={toggle}
	aria-label="Color mode: {names[mode]}. Switch to {names[nextColorMode(mode)]}."
	title="Color mode: {names[mode]}"
>
	{#if mode === 'light'}
		<Sun />
	{:else if mode === 'dark'}
		<Moon />
	{:else}
		<Monitor />
	{/if}
</Button>

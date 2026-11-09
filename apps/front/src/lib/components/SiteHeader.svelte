<!-- The header on every page except the teaser, which places the wordmark itself. -->
<script lang="ts">
	import ColorModeToggle from '#lib/components/ColorModeToggle.svelte';
	import Wordmark from '#lib/components/Wordmark.svelte';
</script>

<header class="mx-auto flex max-w-2xl items-center justify-between p-6">
	<Wordmark />
	<ColorModeToggle />
</header>

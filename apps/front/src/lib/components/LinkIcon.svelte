<!--
	An icon for a profile link, picked from its URL: mail for `mailto:`, the
	GitHub and LinkedIn marks for their hosts, nothing otherwise. Lucide has no
	brand icons, so those two are inline SVG paths.
-->
<script lang="ts">
	import Mail from '@lucide/svelte/icons/mail';

	let { url, class: className = 'size-4' }: { url: string; class?: string } = $props();

	const kind = $derived.by(() => {
		if (url.startsWith('mailto:')) return 'mail';
		const host = URL.canParse(url) ? new URL(url).hostname.replace(/^www\./, '') : '';
		if (host === 'github.com') return 'github';
		if (host === 'linkedin.com') return 'linkedin';
		return null;
	});
</script>

{#if kind === 'mail'}
	<Mail class={className} aria-hidden="true" />
{:else if kind === 'github'}
	<svg class={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
		<path
			d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.3-3.1-.2-.4-.6-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.7 1.6.2 2.8.1 3.2.8.8 1.3 1.9 1.3 3.1 0 4.6-2.8 5.6-5.5 5.9.5.4.9 1 .9 2.2v3.3c0 .3.1.7.8.6A12 12 0 0 0 12 .3"
		/>
	</svg>
{:else if kind === 'linkedin'}
	<svg class={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
		<path
			d="M20.4 20.5h-3.6v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.7H9.3V9h3.4v1.6h.1c.5-.9 1.6-1.8 3.4-1.8 3.6 0 4.3 2.4 4.3 5.5v6.2zM5.3 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2zM7.1 20.5H3.6V9h3.5v11.5zM22.2 0H1.8C.8 0 0 .8 0 1.7v20.6c0 .9.8 1.7 1.8 1.7h20.4c1 0 1.8-.8 1.8-1.7V1.7C24 .8 23.2 0 22.2 0z"
		/>
	</svg>
{/if}

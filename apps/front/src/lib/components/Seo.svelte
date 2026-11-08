<!--
	Per-page SEO: title, description, canonical, Open Graph, and optional JSON-LD.
	Use it once per page:

	<Seo title="About" description="…" path="/about" />
-->
<script lang="ts">
	import { PUBLIC_SITE_NAME, PUBLIC_SITE_URL } from '$app/env/public';
	import { isPreview } from '#lib/env.js';

	type Props = {
		/** The page title. The site name is appended, except on the home page. */
		title?: string;
		description: string;
		/** The page's path, e.g. `/about`. */
		path: string;
		/** An absolute or root-relative image URL for link previews. */
		image?: string;
		type?: 'website' | 'profile' | 'article';
		/** Structured data (schema.org), e.g. a `Person`. */
		jsonLd?: Record<string, unknown>;
	};

	let { title, description, path, image, type = 'website', jsonLd }: Props = $props();

	const fullTitle = $derived(title ? `${title} · ${PUBLIC_SITE_NAME}` : PUBLIC_SITE_NAME);
	const canonical = $derived(new URL(path, PUBLIC_SITE_URL).href);
	const imageUrl = $derived(image ? new URL(image, PUBLIC_SITE_URL).href : undefined);

	// `<` is escaped so the JSON can't close the script tag.
	const jsonLdScript = $derived(
		jsonLd
			? `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', ...jsonLd }).replace(/</g, '\\u003c')}</` +
					'script>'
			: ''
	);
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<!-- Previews get their noindex from the root layout and no canonical. -->
	{#if !isPreview}
		<link rel="canonical" href={canonical} />
	{/if}

	<meta property="og:type" content={type} />
	<meta property="og:site_name" content={PUBLIC_SITE_NAME} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	{#if imageUrl}
		<meta property="og:image" content={imageUrl} />
		<meta name="twitter:card" content="summary_large_image" />
	{:else}
		<meta name="twitter:card" content="summary" />
	{/if}

	{@html jsonLdScript}
</svelte:head>

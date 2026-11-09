<!--
	The teaser: what `/` shows in teaser mode (PUBLIC_TEASER=true), and what
	previews show at /_teaser. Indexable: name, headline, links. Everything
	comes from the Strapi profile. It starts on the system color mode, and the
	toggle in the corner switches it (ADR 0016).
	The eyebrow holds the wordmark, so the easter egg (ADR 0008) lives here too.
-->
<script lang="ts">
	import type { Profile } from '#lib/cms.js';
	import ColorModeToggle from '#lib/components/ColorModeToggle.svelte';
	import LinkIcon from '#lib/components/LinkIcon.svelte';
	import Wordmark from '#lib/components/Wordmark.svelte';
	import { Button } from '#lib/components/ui/button/index.js';

	let { profile }: { profile: Profile } = $props();

	const tickerText = 'Coming soon';
	// Enough copies to cover a wide screen; the track holds two sets and scrolls by one.
	const tickerItems = Array.from({ length: 12 });

	const label = (url: string, fallback: string) =>
		url.startsWith('mailto:') ? url.slice('mailto:'.length) : fallback;
</script>

<main class="bg-background text-foreground relative min-h-svh overflow-hidden">
	<ColorModeToggle class="absolute top-4 right-4" />

	<section
		class="mx-auto grid min-h-svh max-w-5xl content-center items-center gap-8 px-6 pt-12 pb-20 md:grid-cols-[1fr_auto] md:gap-12"
	>
		<div class="flex flex-col items-start gap-5 md:gap-6">
			<p
				class="text-muted-foreground flex items-center gap-3 font-mono text-xs tracking-wider uppercase"
			>
				<span class="bg-muted-foreground/60 h-px w-6" aria-hidden="true"></span>
				<Wordmark class="font-mono text-xs uppercase" />
				{#if profile.role}
					<span aria-hidden="true">·</span>
					<span>{profile.role}</span>
				{/if}
			</p>

			<h1
				class="font-heading max-w-[16ch] text-4xl leading-[1.1] font-semibold tracking-tight text-balance md:text-6xl"
			>
				{profile.headline ?? profile.name}
			</h1>

			{#if profile.availability}
				<p class="text-muted-foreground">{profile.availability}</p>
			{/if}

			{#if profile.links.length}
				<nav class="flex flex-wrap gap-2" aria-label="Contact">
					{#each profile.links as link (link.url)}
						<Button
							href={link.url}
							size="sm"
							variant={link.url.startsWith('mailto:') ? 'default' : 'outline'}
						>
							<LinkIcon url={link.url} />
							{label(link.url, link.label)}
						</Button>
					{/each}
				</nav>
			{/if}
		</div>

		{#if profile.avatar}
			<img
				class="order-first aspect-[4/5] w-full max-w-60 justify-self-center object-cover md:justify-self-auto grayscale [mask-image:linear-gradient(to_bottom,black_75%,transparent)] md:order-none md:w-80 md:max-w-none md:grayscale-0"
				src={profile.avatar.url}
				alt={profile.avatar.alternativeText ?? profile.name}
				width={profile.avatar.width}
				height={profile.avatar.height}
				fetchpriority="high"
			/>
		{/if}
	</section>

	<p class="sr-only">{tickerText}</p>
	<div
		class="bg-primary text-primary-foreground absolute inset-x-0 bottom-0 overflow-hidden py-2.5"
		aria-hidden="true"
	>
		<div class="ticker flex w-max font-mono text-xs tracking-wider uppercase">
			{#each [0, 1] as set (set)}
				<div class="flex shrink-0">
					{#each tickerItems as _, i (i)}
						<span class="px-4">{tickerText}</span>
						<span>·</span>
					{/each}
				</div>
			{/each}
		</div>
	</div>
</main>

<style>
	.ticker {
		animation: ticker 40s linear infinite;
	}

	@keyframes ticker {
		to {
			transform: translateX(-50%);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.ticker {
			animation: none;
		}
	}
</style>

<!-- The style check: it should look the same on ski.vin/_style, apart from the primary color. -->
<script lang="ts">
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Card from '#lib/components/ui/card/index.js';
	import Seo from '#lib/components/Seo.svelte';
</script>

<Seo title="Style" description="Theme and component check." path="/_style" />

<main class="mx-auto flex max-w-2xl flex-col gap-8 p-6">
	<h1 class="font-heading text-3xl font-medium">Style</h1>

	<section class="flex flex-wrap gap-2">
		<Button>Default</Button>
		<Button variant="secondary">Secondary</Button>
		<Button variant="outline">Outline</Button>
		<Button variant="ghost">Ghost</Button>
		<Button variant="destructive">Destructive</Button>
		<Button variant="link">Link</Button>
	</section>

	<Card.Root>
		<Card.Header>
			<Card.Title>Card title</Card.Title>
			<Card.Description>Card description in the muted color.</Card.Description>
		</Card.Header>
		<Card.Content>
			<p>Body text in the foreground color, on the card background.</p>
		</Card.Content>
		<Card.Footer class="gap-2">
			<Button size="sm">Primary</Button>
			<Button size="sm" variant="outline">Outline</Button>
		</Card.Footer>
	</Card.Root>
</main>

<script lang="ts">
	import { SITE_URL } from '$lib/config';

	interface Crumb {
		label: string;
		href?: string;
	}
	interface Props {
		items: Crumb[];
	}
	let { items }: Props = $props();

	// BreadcrumbList JSON-LD untuk rich result Google
	const jsonLd = $derived({
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: item.label,
			...(item.href ? { item: `${SITE_URL}${item.href}` } : {})
		}))
	});
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}<\/script>`}
</svelte:head>

<nav class="bg-brand text-white" aria-label="Breadcrumb">
	<ol class="mx-auto flex max-w-content flex-wrap items-center gap-2 px-4 py-3 text-sm 2xl:px-0">
		{#each items as item, i}
			<li class="flex items-center gap-2">
				{#if item.href && i < items.length - 1}
					<a href={item.href} class="text-white/80 hover:text-accent">{item.label}</a>
				{:else}
					<span class="font-semibold">{item.label}</span>
				{/if}
				{#if i < items.length - 1}
					<span class="text-white/50">/</span>
				{/if}
			</li>
		{/each}
	</ol>
</nav>

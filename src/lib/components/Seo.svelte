<script lang="ts">
	import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from '$lib/config';

	type JsonLdObject = Record<string, unknown>;

	interface Props {
		title?: string;
		description?: string;
		image?: string | null;
		path?: string;
		type?: 'website' | 'article';
		jsonLd?: JsonLdObject | JsonLdObject[] | null;
	}

	let {
		title,
		description = 'Media & direktori wisata kawasan Puncak: tempat wisata, villa, kuliner, event, dan tips perjalanan.',
		image = null,
		path = '',
		type = 'website',
		jsonLd = null
	}: Props = $props();

	const fullTitle = $derived(title ? `${title} | ${SITE_NAME}` : SITE_NAME);
	const url = $derived(`${SITE_URL}${path}`);
	const ogImage = $derived(image || DEFAULT_OG_IMAGE);
	// SVG tidak didukung Facebook/LinkedIn — hanya tambahkan dimensi untuk gambar non-SVG
	const isSvg = $derived(ogImage.endsWith('.svg'));

	const jsonLdItems = $derived(
		jsonLd === null ? [] : Array.isArray(jsonLd) ? jsonLd : [jsonLd]
	);
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={url} />

	<meta property="og:type" content={type} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={url} />
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:locale" content="id_ID" />
	<meta property="og:image" content={ogImage} />
	{#if !isSvg}
		<meta property="og:image:type" content="image/jpeg" />
		<meta property="og:image:width" content="1200" />
		<meta property="og:image:height" content="630" />
	{/if}

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={ogImage} />

	{#each jsonLdItems as item}
		{@html `<script type="application/ld+json">${JSON.stringify(item)}<\/script>`}
	{/each}
</svelte:head>

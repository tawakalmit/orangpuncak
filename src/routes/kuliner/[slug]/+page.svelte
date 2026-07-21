<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import ArticleCard from '$lib/components/ArticleCard.svelte';
	import Carousel from '$lib/components/Carousel.svelte';
	import Gallery from '$lib/components/Gallery.svelte';
	import LazyMap from '$lib/components/LazyMap.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { SITE_URL } from '$lib/config';
	import { imgCover } from '$lib/utils/imagekit';
	import { itemWaMessage, waLink } from '$lib/utils/whatsapp';
	import { kulinerFaqJsonLd } from '$lib/utils/faqJsonLd';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const p = $derived(data.place);

	const jsonLd = $derived([
		{
			'@context': 'https://schema.org',
			'@type': 'Restaurant',
			name: p.name,
			description: p.description,
			image: p.cover_image,
			address: p.address,
			servesCuisine: p.category,
			url: `${SITE_URL}/kuliner/${p.slug}`
		},
		...(kulinerFaqJsonLd(p) ? [kulinerFaqJsonLd(p)!] : [])
	]);
</script>

<Seo title={p.name} description={p.description ?? ''} image={p.cover_image} path={`/kuliner/${p.slug}`} {jsonLd} />

<div class="relative aspect-square w-full overflow-hidden md:aspect-[10/3]">
	<img src={imgCover(p.cover_image)} alt={`Foto ${p.name}`} class="h-full w-full object-cover" />
	<div class="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-4 md:p-10">
		<div class="rounded-xl bg-white/95 px-4 py-3 shadow-xl">
			<h1 class="font-heading text-xl font-bold text-brand md:text-3xl">{p.name}</h1>
			{#if p.lokasi}<p class="text-sm text-ink/70">{p.lokasi}</p>{/if}
		</div>
	</div>
</div>

<Breadcrumb
	items={[
		{ label: 'Beranda', href: '/' },
		{ label: 'Kuliner', href: '/kuliner' },
		{ label: p.name }
	]}
/>

<div class="mx-auto max-w-content px-4 py-8 2xl:px-0 lg:w-11/12">
	<div class="grid gap-4 sm:grid-cols-3">
		{#if p.jam_buka}
			<div class="rounded-xl bg-surface p-4 shadow-md">
				<div class="text-xs text-ink/60">Jam Buka</div>
				<div class="prose prose-sm mt-1 max-w-none font-semibold text-brand [&_p]:my-0">{@html p.jam_buka}</div>
			</div>
		{/if}
		{#if p.harga_range}
			<div class="rounded-xl bg-surface p-4 shadow-md">
				<div class="text-xs text-ink/60">Kisaran Harga</div>
				<div class="font-semibold text-brand">{p.harga_range}</div>
			</div>
		{/if}
		{#if p.gmaps_url}
			<a
				href={p.gmaps_url}
				target="_blank"
				rel="noopener noreferrer"
				class="flex items-center justify-center rounded-xl bg-brand px-4 py-4 font-semibold text-white shadow-md hover:bg-brand/90 transition"
			>
				<svg class="mr-2 h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
					<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
				</svg>
				Buka GMaps
			</a>
		{/if}
	</div>

	<div class="mt-6">
		<a
			href={waLink(itemWaMessage('kuliner', p.name, p.kode), p.whatsapp ?? undefined)}
			target="_blank"
			rel="noopener"
			class="btn-action"
		>
			Reservasi / Tanya via WhatsApp
		</a>
	</div>

	{#if p.description || p.content}
		<section class="mt-8">
			<h2 class="section-title">Tentang {p.name}</h2>
			<div class="prose mt-3 max-w-none text-ink/80 konten-body">
				{#if p.content}{@html p.content}{:else}<p>{p.description}</p>{/if}
			</div>
		</section>
	{/if}

	{#if p.gallery && p.gallery.length}
		<section class="mt-8">
			<h2 class="section-title">Galeri</h2>
			<div class="mt-4"><Gallery images={p.gallery} alt={`Foto ${p.name}`} /></div>
		</section>
	{/if}

	<section id="lokasi" class="mt-8">
		<h2 class="section-title">Lokasi (klik untuk lihat)</h2>
		<div class="mt-4 overflow-hidden rounded-xl shadow-md">
			<LazyMap embedSrc={p.gmaps_embed} mapsUrl={p.gmaps_url} title={`Peta lokasi ${p.name}`} />
		</div>
	</section>

	{#if data.nearbyVilla.length}
		<section class="mt-12">
			<div class="flex items-center justify-between">
				<h2 class="section-title">Villa Terdekat</h2>
				<a href="/villa" class="text-sm font-medium text-brand hover:underline">Lihat semua →</a>
			</div>
			<div class="mt-4"><Carousel places={data.nearbyVilla} /></div>
		</section>
	{/if}

	{#if data.nearbyWisata.length}
		<section class="mt-12">
			<div class="flex items-center justify-between">
				<h2 class="section-title">Wisata Terdekat</h2>
				<a href="/wisata" class="text-sm font-medium text-brand hover:underline">Lihat semua →</a>
			</div>
			<div class="mt-4"><Carousel places={data.nearbyWisata} /></div>
		</section>
	{/if}

	{#if data.nearbyKuliner.length}
		<section class="mt-12">
			<div class="flex items-center justify-between">
				<h2 class="section-title">Kuliner Terdekat</h2>
				<a href="/kuliner" class="text-sm font-medium text-brand hover:underline">Lihat semua →</a>
			</div>
			<div class="mt-4"><Carousel places={data.nearbyKuliner} /></div>
		</section>
	{/if}

	{#if data.articles.length}
		<section class="mt-12">
			<h2 class="section-title">Artikel Terkait</h2>
			<div class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each data.articles as article (article.id)}
					<ArticleCard {article} />
				{/each}
			</div>
			<div class="mt-4 text-right">
				<a href="/artikel" class="text-sm font-medium text-brand hover:underline">Lihat semua artikel →</a>
			</div>
		</section>
	{/if}
</div>

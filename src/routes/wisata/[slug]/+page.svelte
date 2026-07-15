<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import Carousel from '$lib/components/Carousel.svelte';
	import Gallery from '$lib/components/Gallery.svelte';
	import LazyMap from '$lib/components/LazyMap.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { SITE_URL } from '$lib/config';
	import { imgCover } from '$lib/utils/cloudinary';
	import { wisataFaqJsonLd } from '$lib/utils/faqJsonLd';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const p = $derived(data.place);

	const jsonLd = $derived([
		{
			'@context': 'https://schema.org',
			'@type': 'TouristAttraction',
			name: p.name,
			description: p.description,
			image: p.cover_image,
			address: p.address,
			url: `${SITE_URL}/wisata/${p.slug}`
		},
		...(wisataFaqJsonLd(p) ? [wisataFaqJsonLd(p)!] : [])
	]);
</script>

<Seo title={p.meta_title ?? p.name} description={p.description ?? ''} image={p.cover_image} path={`/wisata/${p.slug}`} {jsonLd} />

<!-- Banner -->
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
		{ label: 'Wisata', href: '/wisata' },
		{ label: p.name }
	]}
/>

<div class="mx-auto max-w-content px-4 py-8 2xl:px-0 lg:w-11/12">
	<!-- Info -->
	<div class="grid gap-4 sm:grid-cols-2">
		{#if p.jam_buka}
			<div class="rounded-xl bg-surface p-4 shadow-md">
				<div class="text-xs text-ink/60">Jam Buka</div>
				<div class="prose prose-sm mt-1 max-w-none font-semibold text-brand [&_p]:my-0">{@html p.jam_buka}</div>
			</div>
		{/if}
		{#if p.address}
			<a
				href="#lokasi"
				onclick={(e) => { e.preventDefault(); document.getElementById('lokasi')?.scrollIntoView({ behavior: 'smooth' }); }}
				class="rounded-xl bg-surface p-4 shadow-md hover:shadow-lg transition block"
			>
				<div class="text-xs text-ink/60">Lokasi (klik untuk lihat)</div>
				<div class="text-sm font-semibold text-brand">{p.address}</div>
			</a>
		{/if}
	</div>

	{#if p.harga_tiket}
		<section class="mt-4 rounded-xl bg-surface p-4 shadow-md">
			<div class="text-xs text-ink/60">Harga Tiket (HTM)</div>
			<div class="prose prose-sm mt-1 max-w-none text-brand [&_p]:my-0">{@html p.harga_tiket}</div>
		</section>
	{/if}

	<!-- <div class="mt-6">
		<a
			href={waLink(itemWaMessage('wisata', p.name, p.kode), p.whatsapp ?? undefined)}
			target="_blank"
			rel="noopener"
			class="btn-action"
		>
			Tanya / Reservasi via WhatsApp
		</a>
	</div> -->

	{#if p.description || p.content}
		<section class="mt-8">
			<h2 class="section-title">Tentang {p.name}</h2>
			<div class="prose mt-3 max-w-none text-ink/80 konten-body">
				{#if p.content}{@html p.content}{:else}<p>{p.description}</p>{/if}
			</div>
		</section>
	{/if}

	{#if p.tips}
		<section class="mt-8 rounded-xl bg-muted p-5">
			<h2 class="font-heading text-lg font-semibold text-brand">Tips Berkunjung</h2>
			<div class="prose mt-2 max-w-none text-ink/80">{@html p.tips}</div>
		</section>
	{/if}

	{#if p.gallery && p.gallery.length}
		<section class="mt-8">
			<h2 class="section-title">Galeri</h2>
			<div class="mt-4">
				<Gallery images={p.gallery} alt={`Foto ${p.name}`} />
			</div>
		</section>
	{/if}

	<section id="lokasi" class="mt-8">
		<h2 class="section-title">Lokasi</h2>
		<div class="mt-4 overflow-hidden rounded-xl shadow-md">
			<LazyMap lat={p.lat} lng={p.lng} query={p.address} title={`Peta lokasi ${p.name}`} />
		</div>
	</section>

	{#if data.nearbyVilla.length}
		<section class="mt-12">
			<h2 class="section-title">Villa Terdekat</h2>
			<div class="mt-4">
				<Carousel places={data.nearbyVilla} />
			</div>
		</section>
	{/if}

	{#if data.nearbyWisata.length}
		<section class="mt-12">
			<h2 class="section-title">Wisata Terdekat</h2>
			<div class="mt-4">
				<Carousel places={data.nearbyWisata} />
			</div>
		</section>
	{/if}

	{#if data.nearbyKuliner.length}
		<section class="mt-12">
			<h2 class="section-title">Kuliner Terdekat</h2>
			<div class="mt-4">
				<Carousel places={data.nearbyKuliner} />
			</div>
		</section>
	{/if}

	{#if data.related.length}
		<section class="mt-12">
			<h2 class="section-title">Wisata Lainnya</h2>
			<div class="mt-4">
				<Carousel places={data.related} />
			</div>
		</section>
	{/if}
</div>

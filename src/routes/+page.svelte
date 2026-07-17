<script lang="ts">
	import Banner from '$lib/components/Banner.svelte';
	import Card from '$lib/components/Card.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { SITE_NAME, SITE_TAGLINE, SITE_URL } from '$lib/config';
	import { formatTanggal } from '$lib/utils/format';
	import { imgThumb } from '$lib/utils/imagekit';
	import { waLink } from '$lib/utils/whatsapp';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const bannerSlides = data.featured.slice(0, 5).map((p) => ({
		image: p.cover_image ?? '',
		title: p.name,
		subtitle: p.lokasi ? `${p.type === 'villa' ? 'Villa' : 'Wisata'} · ${p.lokasi}` : undefined,
		href: p.type === 'villa' ? `/villa/${p.kode}` : `/${p.type}/${p.slug}`
	}));

	const langkahBooking = [
		{ n: 1, t: 'Pilih & Hubungi', d: 'Pilih villa/wisata favorit, klik tombol WhatsApp.' },
		{ n: 2, t: 'Konsultasi & Survey', d: 'Tanya ketersediaan, harga, atau jadwalkan survey.' },
		{ n: 3, t: 'Reservasi', d: 'Lakukan booking & pembayaran sesuai kesepakatan.' },
		{ n: 4, t: 'Nikmati Liburan', d: 'Datang dan nikmati pengalaman terbaik di Puncak.' }
	];

	const jsonLd = [
		{
			'@context': 'https://schema.org',
			'@type': 'WebSite',
			name: SITE_NAME,
			description: SITE_TAGLINE,
			url: SITE_URL,
			potentialAction: {
				'@type': 'SearchAction',
				target: {
					'@type': 'EntryPoint',
					urlTemplate: `${SITE_URL}/wisata?q={search_term_string}`
				},
				'query-input': 'required name=search_term_string'
			}
		},
		{
			'@context': 'https://schema.org',
			'@type': 'Organization',
			name: SITE_NAME,
			url: SITE_URL,
			logo: `${SITE_URL}/orang-puncak-icon.png`,
			sameAs: [
				'https://instagram.com/orangpuncak',
				'https://tiktok.com/@orangpuncak',
				'https://youtube.com/@orangpuncak'
			]
		}
	];
</script>

<Seo
	title="Media & Direktori Wisata Puncak"
	description="orangpuncak.com - direktori villa, tempat wisata, kuliner, dan tips perjalanan kawasan Puncak Bogor & Cianjur."
	image={data.featured[0]?.cover_image}
	{jsonLd}
/>

{#if bannerSlides.length}
	<section class="pt-4">
		<Banner slides={bannerSlides} />
	</section>
{/if}

<!-- Sapaan -->
<section class="mx-auto max-w-content px-4 py-10 text-center 2xl:px-0">
	<h1 class="section-title">Selamat Datang di orangpuncak.com</h1>
	<p class="mx-auto mt-3 max-w-2xl text-ink/70">
		{SITE_TAGLINE}. Temukan villa nyaman, tempat wisata seru, dan kuliner lezat di kawasan Puncak,
		Bogor &amp; Cianjur.
	</p>
</section>

<!-- Grid villa/wisata unggulan -->
<section class="mx-auto max-w-content py-10 2xl:px-0 w-11/12">
	<div class="flex items-end justify-between">
		<h2 class="section-title">Pilihan Unggulan</h2>
		<a href="/villa" class="text-sm font-medium text-brand hover:underline">Lihat semua villa →</a>
	</div>
	<div class="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
		{#each data.featured as place}
			<Card {place} />
		{/each}
	</div>
</section>

<!-- Cara Booking ringkas -->
<section class="bg-muted py-10">
	<div class="mx-auto max-w-content 2xl:px-0 w-11/12">
		<h2 class="section-title text-center">Cara Booking / Reservasi</h2>
		<div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{#each langkahBooking as step}
				<div class="rounded-xl bg-surface p-5 shadow-md">
					<div
						class="flex h-10 w-10 items-center justify-center rounded-full bg-brand font-heading font-bold text-white"
					>
						{step.n}
					</div>
					<h3 class="mt-3 font-bold">{step.t}</h3>
					<p class="mt-1 text-sm text-ink/70">{step.d}</p>
				</div>
			{/each}
		</div>
		<div class="mt-8 text-center">
			<a href="/cara-booking" class="btn-primary">Pelajari Cara Booking</a>
		</div>
	</div>
</section>

<!-- Highlight artikel -->
{#if data.articles.length}
	<section class="mx-auto max-w-content py-10 2xl:px-0 w-11/12">
		<div class="flex items-end justify-between">
			<h2 class="section-title">Artikel &amp; Info Terbaru</h2>
			<a href="/artikel" class="text-sm font-medium text-brand hover:underline">Semua artikel →</a>
		</div>
		<div class="mt-5 grid gap-4 grid-cols-2 md:grid-cols-3">
			{#each data.articles as article}
				<a href={`/artikel/${article.slug}`} class="card group flex flex-col">
					<div class="aspect-[16/9] overflow-hidden">
						<img
							src={imgThumb(article.cover_image)}
							alt={article.title}
							loading="lazy"
							class="h-full w-full object-cover transition group-hover:scale-105"
						/>
					</div>
					<div class="flex flex-1 flex-col p-4">
						<span class="text-xs text-brand/80">{formatTanggal(article.published_at)}</span>
						<h3 class="mt-1 line-clamp-2 font-bold">{article.title}</h3>
						<p class="mt-2 line-clamp-2 text-sm text-ink/70 hidden lg:block">{article.excerpt}</p>
					</div>
				</a>
			{/each}
		</div>
	</section>
{/if}

<!-- CTA Eksplor -->
<section class="bg-muted py-10">
	<div class="mx-auto flex max-w-content flex-col items-center gap-4 px-4 text-center 2xl:px-0">
		<h2 class="section-title">Eksplor Kawasan Puncak</h2>
		<p class="max-w-2xl text-ink/70">
			Dari hutan pinus hingga kebun teh, dari villa keluarga hingga cafe estetik — semua ada di
			Puncak. Mulai jelajahi sekarang.
		</p>
		<div class="flex flex-wrap justify-center gap-3">
			<a href="/wisata" class="btn-primary">Jelajah Wisata</a>
			<a href="/villa" class="btn-action">Cari Villa</a>
			<a href="/kuliner" class="btn-action">Kuliner Puncak</a>
		</div>
	</div>
</section>

<!-- CTA Pasang Iklan -->
<section class="mx-auto max-w-content py-12 2xl:px-0 w-11/12">
	<div class="rounded-2xl bg-brand p-8 text-center text-white shadow-xl md:p-12">
		<h2 class="font-heading text-2xl font-semibold md:text-3xl">Punya Bisnis di Puncak?</h2>
		<p class="mx-auto mt-3 max-w-2xl text-white/85">
			Pasang iklan, listing premium, atau endorse di orangpuncak.com dan jangkau ribuan calon
			pengunjung Puncak.
		</p>
		<div class="mt-6 flex flex-wrap justify-center gap-3">
			<a href="/iklan" class="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 font-semibold text-ink transition hover:brightness-95">
				Pasang Iklan
			</a>
			<a
				href={waLink('Halo orangpuncak.com, saya ingin pasang iklan / kerjasama.')}
				target="_blank"
				rel="noopener"
				class="inline-flex items-center justify-center rounded-full border border-white/40 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
			>
				Konsultasi via WhatsApp
			</a>
		</div>
	</div>
</section>

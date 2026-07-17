<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import Card from '$lib/components/Card.svelte';
	import Carousel from '$lib/components/Carousel.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { SITE_URL } from '$lib/config';
	import { formatTanggal } from '$lib/utils/format';
	import { imgCover, imgThumb } from '$lib/utils/imagekit';
	import { artikelFaqJsonLd } from '$lib/utils/faqJsonLd';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const a = $derived(data.article);
	const isHub = $derived(a.template === 'hub');

	const url = $derived(`${SITE_URL}/artikel/${a.slug}`);
	const shareText = $derived(encodeURIComponent(a.title));
	const shareUrl = $derived(encodeURIComponent(url));

	const jsonLd = $derived([
		{
			'@context': 'https://schema.org',
			'@type': 'Article',
			headline: a.title,
			description: a.excerpt,
			image: a.cover_image,
			datePublished: a.published_at,
			url
		},
		...(artikelFaqJsonLd(a) ? [artikelFaqJsonLd(a)!] : [])
	]);

	const hasPlaces = $derived(
		!!data.relatedVilla?.length || !!data.relatedWisata?.length || !!data.relatedKuliner?.length
	);
</script>

<Seo
	title={a.meta_title ?? a.title}
	description={a.meta_description ?? a.excerpt ?? ''}
	image={a.cover_image}
	path={`/artikel/${a.slug}`}
	type="article"
	{jsonLd}
/>

{#if isHub}
	<!-- =========================================================== -->
	<!-- TEMPLATE HUB: banner full-width di atas, konten lebih lebar  -->
	<!-- =========================================================== -->

	{#if a.cover_image}
		<div class="relative aspect-[10/3] w-full overflow-hidden">
			<img src={imgCover(a.cover_image)} alt={a.title} class="h-full w-full object-cover" />
			<div class="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent"></div>
			<div class="absolute bottom-0 left-0 right-0 px-4 py-6 md:px-10">
				<div class="mx-auto max-w-content 2xl:px-0 lg:w-11/12">
					<h1 class="font-heading text-2xl font-bold text-white drop-shadow md:text-4xl">{a.title}</h1>
					<p class="mt-1 text-sm text-white/70">{formatTanggal(a.published_at)}</p>
				</div>
			</div>
		</div>
	{/if}

	<Breadcrumb items={[{ label: 'Beranda', href: '/' }, { label: 'Artikel', href: '/artikel' }, { label: a.title }]} />

	<div class="mx-auto max-w-content px-4 py-8 2xl:px-0 lg:w-11/12">
		{#if !a.cover_image}
			<h1 class="font-heading text-2xl font-bold text-brand md:text-4xl">{a.title}</h1>
			<p class="mt-2 text-sm text-ink/60">{formatTanggal(a.published_at)}</p>
		{/if}

		{#if a.content || a.excerpt}
			<div class="prose mt-6 max-w-none text-ink/80 konten-body">
				{#if a.content}{@html a.content}{:else}<p>{a.excerpt}</p>{/if}
			</div>
		{/if}

		{#if a.tags?.length}
			<div class="mt-6 flex flex-wrap gap-2">
				{#each a.tags as tag}
					<span class="rounded-full bg-muted px-3 py-1 text-sm text-ink/70">#{tag}</span>
				{/each}
			</div>
		{/if}

		{#if hasPlaces}
			{#if data.relatedVilla?.length}
				<section class="mt-12">
					<h2 class="section-title">Villa Pilihan</h2>
					<div class="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
						{#each data.relatedVilla as place (place.id)}
							<Card {place} />
						{/each}
					</div>
				</section>
			{/if}
			{#if data.relatedWisata?.length}
				<section class="mt-12">
					<h2 class="section-title">Wisata Pilihan</h2>
					<div class="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
						{#each data.relatedWisata as place (place.id)}
							<Card {place} />
						{/each}
					</div>
				</section>
			{/if}
			{#if data.relatedKuliner?.length}
				<section class="mt-12">
					<h2 class="section-title">Kuliner Pilihan</h2>
					<div class="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
						{#each data.relatedKuliner as place (place.id)}
							<Card {place} />
						{/each}
					</div>
				</section>
			{/if}
		{/if}

		<div class="mt-12 border-t border-ink/10 pt-6">
			<h2 class="font-heading text-lg font-semibold text-brand">Bagikan Artikel</h2>
			<div class="mt-3 flex flex-wrap gap-2">
				<a href={`https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}`} target="_blank" rel="noopener" class="btn-action">WhatsApp</a>
				<a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noopener" class="btn-action">Facebook</a>
				<a href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`} target="_blank" rel="noopener" class="btn-action">X / Twitter</a>
				<a href={`https://t.me/share/url?url=${shareUrl}&text=${shareText}`} target="_blank" rel="noopener" class="btn-action">Telegram</a>
			</div>
		</div>
	</div>

{:else}
	<!-- =========================================================== -->
	<!-- TEMPLATE ARTIKEL (default): konten sempit max-w-3xl          -->
	<!-- =========================================================== -->

	<Breadcrumb items={[{ label: 'Beranda', href: '/' }, { label: 'Artikel', href: '/artikel' }, { label: a.title }]} />

	<article class="mx-auto max-w-3xl px-4 py-8">
		<h1 class="font-heading text-2xl font-bold text-brand md:text-4xl">{a.title}</h1>
		<p class="mt-2 text-sm text-ink/60">{formatTanggal(a.published_at)}</p>

		{#if a.cover_image}
			<img src={imgCover(a.cover_image)} alt={a.title} class="mt-5 aspect-[16/9] w-full rounded-xl object-cover shadow-md" />
		{/if}

		<div class="prose mt-6 max-w-none text-ink/80 konten-body">
			{#if a.content}{@html a.content}{:else}<p>{a.excerpt}</p>{/if}
		</div>

		{#if a.tags?.length}
			<div class="mt-6 flex flex-wrap gap-2">
				{#each a.tags as tag}
					<span class="rounded-full bg-muted px-3 py-1 text-sm text-ink/70">#{tag}</span>
				{/each}
			</div>
		{/if}

		<div class="mt-8 border-t border-ink/10 pt-5">
			<h2 class="font-heading text-lg font-semibold text-brand">Bagikan Artikel</h2>
			<div class="mt-3 flex flex-wrap gap-2">
				<a href={`https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}`} target="_blank" rel="noopener" class="btn-action">WhatsApp</a>
				<a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noopener" class="btn-action">Facebook</a>
				<a href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`} target="_blank" rel="noopener" class="btn-action">X / Twitter</a>
				<a href={`https://t.me/share/url?url=${shareUrl}&text=${shareText}`} target="_blank" rel="noopener" class="btn-action">Telegram</a>
			</div>
		</div>
	</article>

	{#if hasPlaces}
		<div class="mx-auto max-w-content px-4 2xl:px-0 lg:w-11/12">
			{#if data.relatedVilla?.length}
				<section class="mt-12">
					<h2 class="section-title">Villa Pilihan</h2>
					<div class="mt-4"><Carousel places={data.relatedVilla} /></div>
				</section>
			{/if}
			{#if data.relatedWisata?.length}
				<section class="mt-12">
					<h2 class="section-title">Wisata Pilihan</h2>
					<div class="mt-4"><Carousel places={data.relatedWisata} /></div>
				</section>
			{/if}
			{#if data.relatedKuliner?.length}
				<section class="mt-12">
					<h2 class="section-title">Kuliner Pilihan</h2>
					<div class="mt-4"><Carousel places={data.relatedKuliner} /></div>
				</section>
			{/if}
		</div>
	{/if}
{/if}

<!-- Artikel Lainnya (sama untuk kedua template) -->
{#if data.related.length}
	<section class="mx-auto max-w-content px-4 2xl:px-0 lg:w-11/12 py-12">
		<h2 class="section-title">Artikel Lainnya</h2>
		<div class="mt-4 grid gap-4 md:grid-cols-3">
			{#each data.related as article}
				<a href={`/artikel/${article.slug}`} class="card group flex flex-col">
					<div class="aspect-[16/9] overflow-hidden">
						<img src={imgThumb(article.cover_image)} alt={article.title} loading="lazy" class="h-full w-full object-cover transition group-hover:scale-105" />
					</div>
					<div class="flex flex-1 flex-col p-4">
						<span class="text-xs text-brand/80">{formatTanggal(article.published_at)}</span>
						<h3 class="mt-1 line-clamp-2 font-bold">{article.title}</h3>
					</div>
				</a>
			{/each}
		</div>
	</section>
{/if}

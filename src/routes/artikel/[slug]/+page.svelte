<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { SITE_URL } from '$lib/config';
	import { formatTanggal } from '$lib/utils/format';
	import { imgCover, imgThumb } from '$lib/utils/cloudinary';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const a = $derived(data.article);

	const url = $derived(`${SITE_URL}/artikel/${a.slug}`);
	const shareText = $derived(encodeURIComponent(a.title));
	const shareUrl = $derived(encodeURIComponent(url));

	const jsonLd = $derived({
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: a.title,
		description: a.excerpt,
		image: a.cover_image,
		datePublished: a.published_at,
		url
	});
</script>

<Seo title={a.title} description={a.excerpt ?? ''} image={a.cover_image} path={`/artikel/${a.slug}`} type="article" {jsonLd} />

<Breadcrumb
	items={[
		{ label: 'Beranda', href: '/' },
		{ label: 'Artikel', href: '/artikel' },
		{ label: a.title }
	]}
/>

<article class="mx-auto max-w-3xl px-4 py-8">
	<h1 class="font-heading text-2xl font-bold text-brand md:text-4xl">{a.title}</h1>
	<p class="mt-2 text-sm text-ink/60">{formatTanggal(a.published_at)}</p>

	{#if a.cover_image}
		<img
			src={imgCover(a.cover_image)}
			alt={a.title}
			class="mt-5 aspect-[16/9] w-full rounded-xl object-cover shadow-md"
		/>
	{/if}

	<div class="prose mt-6 max-w-none text-ink/80">
		{#if a.content}{@html a.content}{:else}<p>{a.excerpt}</p>{/if}
	</div>

	{#if a.tags?.length}
		<div class="mt-6 flex flex-wrap gap-2">
			{#each a.tags as tag}
				<span class="rounded-full bg-muted px-3 py-1 text-sm text-ink/70">#{tag}</span>
			{/each}
		</div>
	{/if}

	<!-- Share sosmed -->
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

{#if data.related.length}
	<section class="mx-auto max-w-content px-4 pb-12 2xl:px-0">
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

<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import { formatTanggal } from '$lib/utils/format';
	import { imgThumb } from '$lib/utils/cloudinary';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<Seo
	title={`Artikel & Info Puncak (${data.articles.length})`}
	description={`${data.articles.length} artikel: berita, event, tips perjalanan, info macet & cuaca seputar kawasan Puncak.`}
	path="/artikel"
/>

<div class="mx-auto max-w-content px-4 py-8 2xl:px-0 lg:w-11/12">
	<h1 class="section-title">Artikel &amp; Info Puncak</h1>
	<p class="mt-2 text-ink/70">Tips perjalanan, info macet, cuaca, dan event terbaru di Puncak.</p>

	<div class="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
					<h2 class="mt-1 line-clamp-2 font-bold">{article.title}</h2>
					<p class="mt-2 line-clamp-3 text-sm text-ink/70">{article.excerpt}</p>
					{#if article.tags?.length}
						<div class="mt-3 flex flex-wrap gap-1.5">
							{#each article.tags as tag}
								<span class="rounded-full bg-muted px-2 py-0.5 text-xs text-ink/70">#{tag}</span>
							{/each}
						</div>
					{/if}
				</div>
			</a>
		{/each}
	</div>
</div>

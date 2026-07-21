<script lang="ts">
	import type { Article } from '$lib/types';
	import { formatTanggal } from '$lib/utils/format';
	import { imgThumb } from '$lib/utils/imagekit';

	interface Props {
		article: Article;
	}
	let { article }: Props = $props();
</script>

<a href={`/artikel/${article.slug}`} class="card group flex flex-col">
	<div class="aspect-[16/9] overflow-hidden">
		<img
			src={imgThumb(article.cover_image)}
			alt={article.title}
			loading="lazy"
			class="h-full w-full object-cover transition duration-300 group-hover:scale-105"
		/>
	</div>
	<div class="flex flex-1 flex-col p-3 md:p-4">
		<span class="text-xs text-brand/80">{formatTanggal(article.published_at)}</span>
		<h3 class="mt-1 line-clamp-2 font-bold leading-snug">{article.title}</h3>
		{#if article.excerpt}
			<p class="mt-2 line-clamp-2 text-sm text-ink/70">{article.excerpt}</p>
		{/if}
		{#if article.tags?.length}
			<div class="mt-3 flex flex-wrap gap-1">
				{#each article.tags.slice(0, 3) as tag}
					<span class="rounded-full bg-muted px-2 py-0.5 text-xs text-ink/70">#{tag}</span>
				{/each}
			</div>
		{/if}
	</div>
</a>

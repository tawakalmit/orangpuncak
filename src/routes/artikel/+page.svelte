<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import { formatTanggal } from '$lib/utils/format';
	import { imgThumb } from '$lib/utils/imagekit';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { Article } from '$lib/types';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// --- state ---
	let articles = $state<Article[]>(data.articles);
	let hasMore = $state(data.hasMore);
	let currentPage = $state(0);
	let loading = $state(false);
	let sentinel = $state<HTMLDivElement | null>(null);

	let q = $state(data.filter.q);
	let activeTag = $state(data.filter.tag);
	// true setelah user submit search — ini yang mengontrol visibilitas tombol reset
	let searched = $state(!!(data.filter.q || data.filter.tag));

	// Reset ketika data server berubah (navigasi / filter baru)
	$effect(() => {
		articles = data.articles;
		hasMore = data.hasMore;
		currentPage = 0;
	});

	// IntersectionObserver — load halaman berikutnya saat sentinel terlihat
	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasMore && !loading) {
					loadMore();
				}
			},
			{ rootMargin: '200px' }
		);

		$effect(() => {
			if (sentinel) observer.observe(sentinel);
			return () => { if (sentinel) observer.unobserve(sentinel); };
		});

		return () => observer.disconnect();
	});

	async function loadMore() {
		if (loading || !hasMore) return;
		loading = true;
		const nextPage = currentPage + 1;
		const params = new URLSearchParams();
		params.set('page', String(nextPage));
		if (q.trim()) params.set('q', q.trim());
		if (activeTag) params.set('tag', activeTag);
		try {
			const res = await fetch(`/api/articles?${params}`);
			const json = await res.json();
			articles = [...articles, ...json.articles];
			hasMore = json.hasMore;
			currentPage = nextPage;
		} finally {
			loading = false;
		}
	}

	function apply() {
		const params = new URLSearchParams();
		if (q.trim()) params.set('q', q.trim());
		if (activeTag) params.set('tag', activeTag);
		const qs = params.toString();
		searched = !!qs; // tombol reset muncul setelah submit
		goto(`/artikel${qs ? '?' + qs : ''}`, { replaceState: true });
	}

	function setTag(tag: string) {
		activeTag = activeTag === tag ? '' : tag;
		apply();
	}

	function clearAll() {
		q = '';
		activeTag = '';
		searched = false;
		goto('/artikel', { replaceState: true });
	}

	const hasFilter = $derived(!!q.trim() || !!activeTag);
</script>

<Seo
	title="Artikel & Info Puncak"
	description="Tips perjalanan, info macet, cuaca, event, dan berita terbaru seputar kawasan Puncak Bogor."
	path="/artikel"
/>

<div class="mx-auto max-w-content px-4 py-8 2xl:px-0 lg:w-11/12">
	<h1 class="section-title">Artikel &amp; Info Puncak</h1>
	<p class="mt-2 text-ink/70">Tips perjalanan, info macet, cuaca, dan event terbaru di Puncak.</p>

	<!-- Search bar -->
	<form class="mt-6 flex gap-2" onsubmit={(e) => { e.preventDefault(); apply(); }}>
		<div class="relative flex-1">
			<svg
				class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40"
				fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
			</svg>
			<input
				type="search"
				bind:value={q}
				placeholder="Cari artikel..."
				class="w-full rounded-lg border border-ink/20 bg-white py-2.5 pl-9 pr-4 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
			/>
		</div>
		<button type="submit" class="rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand/90">
			Cari
		</button>
		{#if searched}
			<button
				type="button"
				onclick={clearAll}
				class="rounded-lg border border-ink/20 px-3 py-2.5 text-sm text-ink/60 transition hover:bg-muted"
				aria-label="Reset pencarian"
				title="Reset pencarian"
			>✕</button>
		{/if}
	</form>

	<!-- Filter tags -->
	{#if data.tags.length}
		<div class="mt-3 flex flex-wrap gap-2">
			{#each data.tags as tag}
				<button
					type="button"
					onclick={() => setTag(tag)}
					class="rounded-full px-3 py-1 text-xs font-medium transition
						{activeTag === tag ? 'bg-brand text-white' : 'bg-muted text-ink/70 hover:bg-brand/10 hover:text-brand'}"
				>#{tag}</button>
			{/each}
		</div>
	{/if}

	<!-- Info hasil filter -->
	{#if hasFilter}
		<p class="mt-4 text-sm text-ink/60">
			Menampilkan artikel
			{#if q.trim()}untuk "<strong class="text-ink">{q.trim()}</strong>"{/if}
			{#if activeTag}· tag <strong class="text-ink">#{activeTag}</strong>{/if}
		</p>
	{/if}

	<!-- Grid artikel -->
	{#if articles.length}
		<div class="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each articles as article (article.id)}
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
									<span class="rounded-full px-2 py-0.5 text-xs {activeTag === tag ? 'bg-brand text-white' : 'bg-muted text-ink/70'}">
										#{tag}
									</span>
								{/each}
							</div>
						{/if}
					</div>
				</a>
			{/each}
		</div>

		<!-- Sentinel untuk IntersectionObserver -->
		<div bind:this={sentinel} class="mt-8 flex justify-center">
			{#if loading}
				<span class="text-sm text-ink/40">Memuat artikel...</span>
			{:else if !hasMore}
				<span class="text-sm text-ink/30">Semua artikel sudah ditampilkan</span>
			{/if}
		</div>

	{:else}
		<div class="mt-12 flex flex-col items-center text-center text-ink/50">
			<svg class="mb-3 h-12 w-12 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
			<p class="text-sm">Tidak ada artikel yang cocok.</p>
			<button onclick={clearAll} class="mt-3 text-sm text-brand hover:underline">Tampilkan semua artikel</button>
		</div>
	{/if}
</div>

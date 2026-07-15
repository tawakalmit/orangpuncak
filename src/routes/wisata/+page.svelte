<script lang="ts">
	import { goto } from '$app/navigation';
	import Card from '$lib/components/Card.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import type { Place } from '$lib/types';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let q = $state(data.filter.q);
	let category = $state(data.filter.category);
	let lokasi = $state(data.filter.lokasi);

	let places = $state<Place[]>(data.places);
	let hasMore = $state(data.hasMore);
	let page = $state(0);
	let loading = $state(false);
	let sentinel = $state<HTMLDivElement | null>(null);

	// Reset saat data berubah (filter baru dari URL)
	$effect(() => {
		places = data.places;
		hasMore = data.hasMore;
		page = 0;
	});

	async function loadMore() {
		if (loading || !hasMore) return;
		loading = true;
		const nextPage = page + 1;
		const params = new URLSearchParams();
		params.set('type', 'wisata');
		params.set('page', String(nextPage));
		if (data.filter.q) params.set('q', data.filter.q);
		if (data.filter.category) params.set('kategori', data.filter.category);
		if (data.filter.lokasi) params.set('lokasi', data.filter.lokasi);

		const res = await fetch(`/api/places?${params.toString()}`);
		const json = await res.json();
		places = [...places, ...json.places];
		hasMore = json.hasMore;
		page = nextPage;
		loading = false;
	}

	// IntersectionObserver untuk sentinel element
	$effect(() => {
		if (!sentinel) return;
		const observer = new IntersectionObserver(
			(entries) => { if (entries[0].isIntersecting) loadMore(); },
			{ rootMargin: '300px' }
		);
		observer.observe(sentinel);
		return () => observer.disconnect();
	});

	function apply(e: Event) {
		e.preventDefault();
		const params = new URLSearchParams();
		if (q) params.set('q', q);
		if (category) params.set('kategori', category);
		if (lokasi) params.set('lokasi', lokasi);
		goto(`/wisata?${params.toString()}`, { keepFocus: true });
	}
</script>

<Seo
	title={`${data.total} Tempat Wisata di Puncak`}
	description={`Daftar ${data.total} tempat wisata di kawasan Puncak Bogor & Cianjur: wisata alam, keluarga, dan rekreasi.`}
	path="/wisata"
/>

<div class="mx-auto max-w-content px-4 py-8 2xl:px-0 lg:w-11/12">
	<h1 class="section-title">Tempat Wisata di Puncak</h1>
	<p class="mt-2 text-ink/70">Jelajahi {data.total} destinasi wisata pilihan.</p>

	<form class="mt-5 grid gap-3 rounded-xl bg-surface p-4 shadow-md md:grid-cols-4" onsubmit={apply}>
		<div class="md:col-span-2">
			<label for="q" class="mb-1 block text-sm font-medium">Cari</label>
			<input
				id="q"
				type="search"
				bind:value={q}
				placeholder="Nama tempat wisata..."
				class="w-full rounded-md border border-ink/20 px-3 py-2"
				onsearch={(e) => { q = (e.target as HTMLInputElement).value; apply(e); }}
			/>
		</div>
		<div>
			<label for="kategori" class="mb-1 block text-sm font-medium">Kategori</label>
			<select id="kategori" bind:value={category} class="w-full rounded-md border border-ink/20 px-3 py-2">
				<option value="">Semua</option>
				{#each data.categories as c}<option value={c}>{c}</option>{/each}
			</select>
		</div>
		<div>
			<label for="lokasi" class="mb-1 block text-sm font-medium">Lokasi</label>
			<select id="lokasi" bind:value={lokasi} class="w-full rounded-md border border-ink/20 px-3 py-2">
				<option value="">Semua</option>
				{#each data.locations as l}<option value={l}>{l}</option>{/each}
			</select>
		</div>
		<div class="md:col-span-4">
			<button type="submit" class="btn-filter w-full md:w-auto">Terapkan Filter</button>
		</div>
	</form>

	{#if places.length}
		<div class="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
			{#each places as place (place.id)}
				<Card {place} />
			{/each}
		</div>

		<!-- Sentinel + loading indicator -->
		<div bind:this={sentinel} class="mt-8 flex justify-center">
			{#if loading}
				<div class="flex items-center gap-2 text-sm text-ink/50">
					<svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
					</svg>
					Memuat lebih banyak...
				</div>
			{:else if !hasMore}
				<p class="text-sm text-ink/40">Semua {data.total} wisata sudah ditampilkan</p>
			{/if}
		</div>
	{:else}
		<p class="mt-10 text-center text-ink/60">Tidak ada hasil. Coba ubah filter.</p>
	{/if}
</div>

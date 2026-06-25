<script lang="ts">
	import { goto } from '$app/navigation';
	import Card from '$lib/components/Card.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let q = $state(data.filter.q);
	let category = $state(data.filter.category);
	let lokasi = $state(data.filter.lokasi);

	function apply(e: Event) {
		e.preventDefault();
		const params = new URLSearchParams();
		if (q) params.set('q', q);
		if (category) params.set('kategori', category);
		if (lokasi) params.set('lokasi', lokasi);
		goto(`/kuliner?${params.toString()}`, { keepFocus: true });
	}
</script>

<Seo
	title={`${data.places.length} Kuliner di Puncak`}
	description={`Rekomendasi ${data.places.length} tempat makan, cafe, dan kuliner khas di kawasan Puncak Bogor & Cianjur.`}
	path="/kuliner"
/>

<div class="mx-auto max-w-content px-4 py-8 2xl:px-0 lg:w-11/12">
	<h1 class="section-title">Kuliner di Puncak</h1>
	<p class="mt-2 text-ink/70">Temukan {data.places.length} tempat makan &amp; cafe pilihan.</p>

	<form class="mt-5 grid gap-3 rounded-xl bg-surface p-4 shadow-md md:grid-cols-4" onsubmit={apply}>
		<div class="md:col-span-2">
			<label for="q" class="mb-1 block text-sm font-medium">Cari</label>
			<input
				id="q"
				type="search"
				bind:value={q}
				placeholder="Nama tempat kuliner..."
				class="w-full rounded-md border border-ink/20 px-3 py-2"
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

	{#if data.places.length}
		<div class="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
			{#each data.places as place}
				<Card {place} />
			{/each}
		</div>
	{:else}
		<p class="mt-10 text-center text-ink/60">Tidak ada hasil. Coba ubah filter.</p>
	{/if}
</div>

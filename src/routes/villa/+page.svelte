<script lang="ts">
	import { goto } from '$app/navigation';
	import Card from '$lib/components/Card.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import type { Place, VillaFacilities } from '$lib/types';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let q = $state(data.filter.q);
	let lokasi = $state(data.filter.lokasi);
	let status = $state(data.filter.status);
	let jumlahKamar = $state(data.filter.kamar ? String(data.filter.kamar) : '');
	let mobileOpen = $state(false);

	const facilityOptions: { key: keyof VillaFacilities; label: string }[] = [
		{ key: 'kolam_renang', label: 'Kolam Renang' },
		{ key: 'wifi', label: 'Wifi' },
		{ key: 'billiard', label: 'Billiard' },
		{ key: 'ac', label: 'AC' },
		{ key: 'tenis_meja', label: 'Tenis Meja' }
	];
	let facilities = $state<Record<string, boolean>>(
		Object.fromEntries((data.filter.facilities ?? []).map((f) => [f, true]))
	);

	let places = $state<Place[]>(data.places);
	let hasMore = $state(data.hasMore);
	let page = $state(0);
	let loading = $state(false);

	$effect(() => {
		places = data.places;
		hasMore = data.hasMore;
		page = 0;
		q = data.filter.q;
		lokasi = data.filter.lokasi;
		status = data.filter.status;
		jumlahKamar = data.filter.kamar ? String(data.filter.kamar) : '';
		facilities = Object.fromEntries((data.filter.facilities ?? []).map((f) => [f, true]));
	});

	// Body scroll lock on mobile when modal open
	$effect(() => {
		if (typeof document !== 'undefined') {
			if (mobileOpen) {
				document.body.style.overflow = 'hidden';
			} else {
				document.body.style.overflow = '';
			}
		}
		return () => {
			if (typeof document !== 'undefined') {
				document.body.style.overflow = '';
			}
		};
	});

	const activeFacilityCount = $derived(
		Object.values(facilities).filter(Boolean).length
	);

	const activeFilterCount = $derived(
		(q ? 1 : 0) +
		(lokasi ? 1 : 0) +
		(status ? 1 : 0) +
		(jumlahKamar ? 1 : 0) +
		activeFacilityCount
	);

	const hasActiveFilters = $derived(activeFilterCount > 0);

	function buildParams(p: number) {
		const params = new URLSearchParams();
		params.set('type', 'villa');
		params.set('page', String(p));
		if (data.filter.q) params.set('q', data.filter.q);
		if (data.filter.lokasi) params.set('lokasi', data.filter.lokasi);
		if (data.filter.status) params.set('status', data.filter.status);
		if (data.filter.kamar) params.set('kamar', String(data.filter.kamar));
		for (const f of data.filter.facilities ?? []) params.append('fasilitas', f);
		return params;
	}

	async function loadMore() {
		if (loading || !hasMore) return;
		loading = true;
		const nextPage = page + 1;
		try {
			const res = await fetch(`/api/places?${buildParams(nextPage).toString()}`);
			const json = await res.json();
			places = [...places, ...json.places];
			hasMore = json.hasMore;
			page = nextPage;
		} finally {
			loading = false;
		}
	}

	// use: action — observer dibuat tepat saat elemen masuk DOM, destroy saat keluar
	function sentinel(node: HTMLElement) {
		const observer = new IntersectionObserver(
			([entry]) => { if (entry.isIntersecting) loadMore(); },
			{ rootMargin: '0px' }
		);
		observer.observe(node);
		return { destroy: () => observer.disconnect() };
	}

	function apply() {
		const params = new URLSearchParams();
		if (q.trim()) params.set('q', q.trim());
		if (lokasi) params.set('lokasi', lokasi);
		if (status) params.set('status', status);
		if (jumlahKamar) params.set('kamar', jumlahKamar);
		for (const [k, v] of Object.entries(facilities)) {
			if (v) params.append('fasilitas', k);
		}
		mobileOpen = false;
		goto(`/villa?${params.toString()}`, { keepFocus: true });
	}

	function resetFilter() {
		q = '';
		lokasi = '';
		jumlahKamar = '';
		status = '';
		facilities = {};
		mobileOpen = false;
		goto('/villa', { keepFocus: true });
	}

	function toggleStatus(val: string) {
		status = status === val ? '' : val;
		apply();
	}

	function toggleFacility(key: string) {
		facilities[key] = !facilities[key];
		apply();
	}

	function removeFilter(type: 'q' | 'lokasi' | 'status' | 'kamar' | string) {
		if (type === 'q') q = '';
		else if (type === 'lokasi') lokasi = '';
		else if (type === 'status') status = '';
		else if (type === 'kamar') jumlahKamar = '';
		else if (facilities[type] !== undefined) facilities[type] = false;
		apply();
	}
</script>

<Seo
	title={`${data.total} Villa Puncak Murah & Nyaman — Sewa & Jual`}
	description={`Pilihan villa di Puncak untuk disewa atau dijual. Filter berdasarkan lokasi, jumlah kamar, dan fasilitas seperti kolam renang & wifi.`}
	path="/villa"
/>

{#snippet filterFields(showActionButtons = true)}
	<div>
		<label for="f-q" class="mb-1.5 block text-sm font-medium text-ink">Cari nama / kode</label>
		<form onsubmit={(e) => { e.preventDefault(); apply(); }} class="relative">
			<input
				id="f-q"
				type="search"
				bind:value={q}
				placeholder="mis. Villa Kabut / VP-001"
				class="w-full rounded-xl border border-ink/20 bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
			/>
			{#if q}
				<button
					type="button"
					class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink/40 hover:text-ink"
					onclick={() => { q = ''; }}
				>
					✕
				</button>
			{/if}
		</form>
	</div>

	<div>
		<label for="f-lokasi" class="mb-1.5 block text-sm font-medium text-ink">Lokasi</label>
		<select
			id="f-lokasi"
			bind:value={lokasi}
			class="w-full rounded-xl border border-ink/20 bg-surface px-3.5 py-2.5 text-sm text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
		>
			<option value="">Semua Lokasi</option>
			{#each data.locations as l}<option value={l}>{l}</option>{/each}
		</select>
	</div>

	<div>
		<span class="mb-1.5 block text-sm font-medium text-ink">Status</span>
		<div class="grid grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 gap-1 rounded-xl bg-ink/5 p-1 text-xs">
			<button
				type="button"
				class="rounded-lg py-2 px-1 font-medium transition text-center truncate {status === '' ? 'bg-white shadow text-brand font-bold' : 'text-ink/70 hover:text-ink'}"
				onclick={() => (status = '')}
			>
				Semua
			</button>
			<button
				type="button"
				class="rounded-lg py-2 px-1 font-medium transition text-center truncate {status === 'disewakan' ? 'bg-brand text-white font-bold shadow' : 'text-ink/70 hover:text-ink'}"
				onclick={() => (status = 'disewakan')}
			>
				Disewakan
			</button>
			<button
				type="button"
				class="rounded-lg py-2 px-1 font-medium transition text-center truncate {status === 'dijual' ? 'bg-brand text-white font-bold shadow' : 'text-ink/70 hover:text-ink'}"
				onclick={() => (status = 'dijual')}
			>
				Dijual
			</button>
		</div>
	</div>

	<div>
		<span class="mb-1.5 block text-sm font-medium text-ink">Jumlah Kamar (minimal)</span>
		<div class="flex flex-wrap gap-1.5">
			<button
				type="button"
				class="rounded-lg border px-3 py-1.5 text-xs font-medium transition {jumlahKamar === '' ? 'border-brand bg-brand text-white font-semibold shadow-xs' : 'border-ink/15 bg-surface text-ink/70 hover:border-ink/30'}"
				onclick={() => (jumlahKamar = '')}
			>
				Semua
			</button>
			{#each data.rooms as r}
				<button
					type="button"
					class="rounded-lg border px-2.5 py-1.5 text-xs font-medium transition {jumlahKamar === String(r) ? 'border-brand bg-brand text-white font-semibold shadow-xs' : 'border-ink/15 bg-surface text-ink/70 hover:border-ink/30'}"
					onclick={() => (jumlahKamar = String(r))}
				>
					{r}+ kamar
				</button>
			{/each}
		</div>
	</div>

	<fieldset>
		<legend class="mb-1.5 block text-sm font-medium text-ink">Fasilitas</legend>
		<div class="grid grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-2">
			{#each facilityOptions as opt}
				<button
					type="button"
					class="flex items-center gap-2 rounded-xl border p-2 text-left text-xs font-medium transition {facilities[opt.key] ? 'border-brand bg-brand/10 text-brand font-semibold' : 'border-ink/15 bg-surface text-ink/70 hover:border-ink/30'}"
					onclick={() => (facilities[opt.key] = !facilities[opt.key])}
				>
					<span class="flex h-4 w-4 shrink-0 items-center justify-center rounded border {facilities[opt.key] ? 'border-brand bg-brand text-white' : 'border-ink/30 bg-white'}">
						{#if facilities[opt.key]}
							<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
								<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
							</svg>
						{/if}
					</span>
					<span class="truncate">{opt.label}</span>
				</button>
			{/each}
		</div>
	</fieldset>

	{#if showActionButtons}
		<div class="flex gap-2 pt-2">
			<button type="button" class="btn-filter flex-1" onclick={apply}>
				Terapkan Filter
			</button>
			<button type="button" class="rounded-xl border border-ink/20 px-4 py-2 text-sm text-ink/70 hover:bg-muted" onclick={resetFilter}>
				Reset
			</button>
		</div>
	{/if}
{/snippet}

<div class="mx-auto max-w-content px-3 sm:px-4 py-5 sm:py-8 2xl:px-0 lg:w-11/12">
	<div class="flex flex-col gap-1">
		<h1 class="section-title">Villa di Puncak</h1>
		<p class="text-sm text-ink/70 sm:text-base">
			Menampilkan <span class="font-semibold text-brand">{data.total}</span> pilihan villa terbaik.
		</p>
	</div>

	<!-- Toolbar Search & Filter Mobile (lg:hidden) -->
	<div class="mt-4 space-y-3 lg:hidden">
		<!-- Search box + Filter button -->
		<form
			onsubmit={(e) => { e.preventDefault(); apply(); }}
			class="flex items-center gap-2"
		>
			<div class="relative flex-1">
				<input
					type="search"
					bind:value={q}
					placeholder="Cari nama atau kode villa..."
					class="w-full rounded-xl border border-ink/20 bg-surface py-2.5 pl-9 pr-8 text-sm placeholder:text-ink/40 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
				/>
				<svg
					class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
				</svg>
				{#if q}
					<button
						type="button"
						class="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink"
						onclick={() => { q = ''; apply(); }}
						aria-label="Hapus kata kunci"
					>
						<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				{/if}
			</div>

			<button
				id="btn-open-filter"
				type="button"
				class="inline-flex h-[42px] items-center gap-1.5 rounded-xl border bg-surface px-3.5 text-sm font-semibold shadow-sm transition active:scale-95 {hasActiveFilters ? 'border-brand text-brand ring-1 ring-brand/30 bg-brand/5' : 'border-ink/15 text-ink hover:border-brand'}"
				onclick={() => (mobileOpen = true)}
			>
				<svg class="h-4 w-4 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
				</svg>
				<span>Filter</span>
				{#if activeFilterCount > 0}
					<span class="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[11px] font-bold text-white">
						{activeFilterCount}
					</span>
				{/if}
			</button>
		</form>

		<!-- Quick filter pills (scroll horizontal) -->
		<div class="-mx-3 flex gap-2 overflow-x-auto px-3 pb-1 text-xs [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
			<button
				type="button"
				class="shrink-0 rounded-full border px-3 py-1.5 font-medium transition active:scale-95 {status === 'disewakan' ? 'border-brand bg-brand text-white shadow-xs' : 'border-ink/15 bg-surface text-ink/75 hover:border-ink/30'}"
				onclick={() => toggleStatus('disewakan')}
			>
				Disewakan
			</button>
			<button
				type="button"
				class="shrink-0 rounded-full border px-3 py-1.5 font-medium transition active:scale-95 {status === 'dijual' ? 'border-brand bg-brand text-white shadow-xs' : 'border-ink/15 bg-surface text-ink/75 hover:border-ink/30'}"
				onclick={() => toggleStatus('dijual')}
			>
				Dijual
			</button>
			{#each facilityOptions as opt}
				<button
					type="button"
					class="shrink-0 rounded-full border px-3 py-1.5 font-medium transition active:scale-95 {facilities[opt.key] ? 'border-brand bg-brand text-white shadow-xs' : 'border-ink/15 bg-surface text-ink/75 hover:border-ink/30'}"
					onclick={() => toggleFacility(opt.key)}
				>
					{opt.label}
				</button>
			{/each}
		</div>

		<!-- Active filter tags (bila ada filter aktif) -->
		{#if hasActiveFilters}
			<div class="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
				<span class="text-[11px] text-ink/50">Filter:</span>
				{#if q}
					<span class="inline-flex items-center gap-1 rounded-md bg-brand/10 px-2 py-0.5 font-medium text-brand">
						"{q}"
						<button type="button" onclick={() => removeFilter('q')} aria-label="Hapus cari" class="hover:text-brand-dark">✕</button>
					</span>
				{/if}
				{#if lokasi}
					<span class="inline-flex items-center gap-1 rounded-md bg-brand/10 px-2 py-0.5 font-medium text-brand">
						{lokasi}
						<button type="button" onclick={() => removeFilter('lokasi')} aria-label="Hapus lokasi" class="hover:text-brand-dark">✕</button>
					</span>
				{/if}
				{#if status}
					<span class="inline-flex items-center gap-1 rounded-md bg-brand/10 px-2 py-0.5 font-medium text-brand">
						{status === 'disewakan' ? 'Disewakan' : 'Dijual'}
						<button type="button" onclick={() => removeFilter('status')} aria-label="Hapus status" class="hover:text-brand-dark">✕</button>
					</span>
				{/if}
				{#if jumlahKamar}
					<span class="inline-flex items-center gap-1 rounded-md bg-brand/10 px-2 py-0.5 font-medium text-brand">
						{jumlahKamar}+ Kamar
						<button type="button" onclick={() => removeFilter('kamar')} aria-label="Hapus kamar" class="hover:text-brand-dark">✕</button>
					</span>
				{/if}
				{#each facilityOptions as opt}
					{#if facilities[opt.key]}
						<span class="inline-flex items-center gap-1 rounded-md bg-brand/10 px-2 py-0.5 font-medium text-brand">
							{opt.label}
							<button type="button" onclick={() => removeFilter(opt.key)} aria-label={`Hapus ${opt.label}`} class="hover:text-brand-dark">✕</button>
						</span>
					{/if}
				{/each}
				<button
					type="button"
					class="font-medium text-brand hover:underline pl-1 text-[11px]"
					onclick={resetFilter}
				>
					Reset Semua
				</button>
			</div>
		{/if}
	</div>

	<div class="mt-5 grid gap-6 lg:grid-cols-5">
		<!-- Sidebar filter (desktop) -->
		<aside class="hidden lg:col-span-1 lg:block">
			<div class="sticky top-24 space-y-4 rounded-2xl bg-surface p-5 shadow-sm border border-ink/5">
				<div class="flex items-center justify-between">
					<h2 class="font-heading text-lg font-bold text-brand">Filter</h2>
					{#if hasActiveFilters}
						<button
							type="button"
							class="text-xs text-brand hover:underline"
							onclick={resetFilter}
						>
							Reset Semua
						</button>
					{/if}
				</div>
				{@render filterFields(true)}
			</div>
		</aside>

		<!-- Grid hasil -->
		<div class="lg:col-span-4">
			{#if places.length}
				<div class="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
					{#each places as place (place.id)}
						<Card {place} />
					{/each}
				</div>

				<div use:sentinel class="mt-8 flex justify-center">
					{#if loading}
						<div class="flex items-center gap-2 text-sm text-ink/50">
							<svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
							</svg>
							Memuat lebih banyak...
						</div>
					{:else if !hasMore}
						<p class="text-xs text-ink/40 sm:text-sm">Semua {data.total} villa sudah ditampilkan</p>
					{/if}
				</div>
			{:else}
				<div class="rounded-2xl bg-surface p-8 sm:p-12 text-center text-ink/70 shadow-sm border border-ink/5">
					<p class="font-semibold text-ink text-base">Tidak ada villa yang cocok dengan kriteria filter.</p>
					<p class="mt-1 text-sm text-ink/60">Coba ubah filter atau reset untuk melihat semua villa.</p>
					<button
						type="button"
						class="btn-action mt-4"
						onclick={resetFilter}
					>
						Lihat Semua Villa
					</button>
				</div>
			{/if}
		</div>
	</div>
</div>

<!-- Panel filter mobile (Bottom Sheet Drawer) -->
{#if mobileOpen}
	<!-- Backdrop -->
	<div
		class="fixed inset-0 z-[70] bg-ink/60 backdrop-blur-xs transition-opacity duration-300 lg:hidden"
		onclick={() => (mobileOpen = false)}
		aria-hidden="true"
	></div>

	<!-- Bottom Sheet Container -->
	<div
		class="fixed inset-x-0 bottom-0 z-[71] flex max-h-[88vh] flex-col rounded-t-3xl bg-surface shadow-2xl transition-transform duration-300 lg:hidden"
		role="dialog"
		aria-modal="true"
		aria-label="Filter Villa"
	>
		<!-- Drag indicator -->
		<div class="mx-auto mt-3 h-1.5 w-12 rounded-full bg-ink/20"></div>

		<!-- Sheet Header -->
		<div class="flex items-center justify-between border-b border-ink/10 px-5 py-3">
			<div class="flex items-center gap-2">
				<h2 class="font-heading text-lg font-bold text-ink">Filter Villa</h2>
				{#if activeFilterCount > 0}
					<span class="rounded-full bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand">
						{activeFilterCount} aktif
					</span>
				{/if}
			</div>
			<button
				type="button"
				class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-ink/5 text-ink/70 transition hover:bg-ink/10 hover:text-ink"
				aria-label="Tutup filter"
				onclick={() => (mobileOpen = false)}
			>
				<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 6l12 12M18 6L6 18" />
				</svg>
			</button>
		</div>

		<!-- Sheet Scrollable Form Body -->
		<div class="flex-1 overflow-y-auto px-5 py-4 space-y-4">
			{@render filterFields(false)}
		</div>

		<!-- Sticky Footer Actions -->
		<div class="border-t border-ink/10 bg-surface p-4 flex gap-3">
			<button
				type="button"
				class="flex-1 rounded-xl border border-ink/20 py-2.5 text-sm font-semibold text-ink/80 transition hover:bg-muted active:scale-98"
				onclick={resetFilter}
			>
				Reset
			</button>
			<button
				type="button"
				class="flex-[2] rounded-xl bg-accent-alt py-2.5 text-sm font-bold text-ink shadow transition hover:brightness-95 active:scale-98"
				onclick={apply}
			>
				Terapkan Filter
			</button>
		</div>
	</div>
{/if}

<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import type { VillaFacilities } from '$lib/types';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// State filter reaktif
	let q = $state('');
	let lokasi = $state('');
	let jumlahKamar = $state('');
	let status = $state('');
	let mobileOpen = $state(false);

	const facilityOptions: { key: keyof VillaFacilities; label: string }[] = [
		{ key: 'kolam_renang', label: 'Kolam Renang' },
		{ key: 'wifi', label: 'Wifi' },
		{ key: 'billiard', label: 'Billiard' },
		{ key: 'ac', label: 'AC' },
		{ key: 'tenis_meja', label: 'Tenis Meja' }
	];
	let facilities = $state<Record<string, boolean>>({});

	// Filtering reaktif — benar-benar berfungsi
	const filtered = $derived(
		data.villas.filter((v) => {
			if (q) {
				const hay = `${v.name} ${v.kode}`.toLowerCase();
				if (!hay.includes(q.toLowerCase())) return false;
			}
			if (lokasi && v.lokasi !== lokasi) return false;
			if (status && v.status !== status) return false;
			if (jumlahKamar && (v.jumlah_kamar_tidur ?? 0) < Number(jumlahKamar)) return false;
			for (const opt of facilityOptions) {
				if (facilities[opt.key] && !v.facilities?.[opt.key]) return false;
			}
			return true;
		})
	);

	function resetFilter() {
		q = '';
		lokasi = '';
		jumlahKamar = '';
		status = '';
		facilities = {};
	}
</script>

<Seo
	title={`${data.villas.length} Villa Puncak Murah & Nyaman — Sewa & Jual`}
	description={`Pilihan ${data.villas.length} villa di Puncak untuk disewa atau dijual. Filter berdasarkan lokasi, jumlah kamar, dan fasilitas seperti kolam renang & wifi.`}
	path="/villa"
/>

{#snippet filterFields()}
	<div>
		<label for="f-q" class="mb-1 block text-sm font-medium">Cari nama / kode</label>
		<input
			id="f-q"
			type="search"
			bind:value={q}
			placeholder="mis. Villa Kabut / VP-001"
			class="w-full rounded-md border border-ink/20 px-3 py-2"
		/>
	</div>
	<div>
		<label for="f-lokasi" class="mb-1 block text-sm font-medium">Lokasi</label>
		<select id="f-lokasi" bind:value={lokasi} class="w-full rounded-md border border-ink/20 px-3 py-2">
			<option value="">Semua Lokasi</option>
			{#each data.locations as l}<option value={l}>{l}</option>{/each}
		</select>
	</div>
	<div>
		<label for="f-status" class="mb-1 block text-sm font-medium">Status</label>
		<select id="f-status" bind:value={status} class="w-full rounded-md border border-ink/20 px-3 py-2">
			<option value="">Semua</option>
			<option value="disewakan">Disewakan</option>
			<option value="dijual">Dijual</option>
		</select>
	</div>
	<div>
		<label for="f-kamar" class="mb-1 block text-sm font-medium">Jumlah Kamar (minimal)</label>
		<select id="f-kamar" bind:value={jumlahKamar} class="w-full rounded-md border border-ink/20 px-3 py-2">
			<option value="">Semua</option>
			{#each data.rooms as r}<option value={r}>{r}+ kamar</option>{/each}
		</select>
	</div>
	<fieldset>
		<legend class="mb-1 block text-sm font-medium">Fasilitas</legend>
		<div class="space-y-2">
			{#each facilityOptions as opt}
				<label class="flex items-center gap-2 text-sm">
					<input type="checkbox" bind:checked={facilities[opt.key]} class="h-4 w-4 rounded accent-brand" />
					{opt.label}
				</label>
			{/each}
		</div>
	</fieldset>
	<div class="flex gap-2 pt-2">
		<button type="button" class="btn-filter flex-1" onclick={() => (mobileOpen = false)}>
			Terapkan Filter
		</button>
		<button type="button" class="rounded-md border border-ink/20 px-4 py-2 text-sm" onclick={resetFilter}>
			Reset
		</button>
	</div>
{/snippet}

<div class="mx-auto max-w-content px-4 py-8 2xl:px-0 lg:w-11/12">
	<h1 class="section-title">Villa di Puncak</h1>
	<p class="mt-2 text-ink/70">
		Menampilkan <span class="font-semibold text-brand">{filtered.length}</span> dari
		{data.villas.length} villa.
	</p>

	<!-- Tombol filter mobile -->
	<div class="mt-4 lg:hidden">
		<button type="button" class="btn-filter w-full" onclick={() => (mobileOpen = true)}>
			Filter Villa
		</button>
	</div>

	<div class="mt-5 grid gap-6 lg:grid-cols-5">
		<!-- Sidebar filter (desktop) -->
		<aside class="hidden lg:col-span-1 lg:block">
			<div class="sticky top-24 space-y-4 rounded-xl bg-surface p-4 shadow-md">
				<h2 class="font-heading text-lg font-semibold text-brand">Filter</h2>
				{@render filterFields()}
			</div>
		</aside>

		<!-- Grid hasil -->
		<div class="lg:col-span-4">
			{#if filtered.length}
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
					{#each filtered as place (place.id)}
						<Card {place} />
					{/each}
				</div>
			{:else}
				<div class="rounded-xl bg-surface p-10 text-center text-ink/60 shadow-md">
					Tidak ada villa yang cocok dengan filter. Coba longgarkan kriteria.
				</div>
			{/if}
		</div>
	</div>
</div>

<!-- Panel filter mobile: slide-in dari kiri -->
<div
	class="fixed inset-0 z-[70] bg-brand text-white transition-all duration-300 lg:hidden"
	style:left={mobileOpen ? '0' : '-100vw'}
	aria-hidden={!mobileOpen}
>
	<div class="flex h-14 items-center justify-between px-4">
		<span class="font-heading text-lg font-semibold">Filter Villa</span>
		<button
			type="button"
			class="inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-white/15"
			aria-label="Tutup filter"
			onclick={() => (mobileOpen = false)}
		>
			<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M6 6l12 12M18 6L6 18" />
			</svg>
		</button>
	</div>
	<div class="h-[calc(100vh-3.5rem)] overflow-y-auto px-4 pb-10">
		<div class="space-y-4 rounded-xl bg-surface p-4 text-ink">
			{@render filterFields()}
		</div>
	</div>
</div>

<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Seo from '$lib/components/Seo.svelte';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const tabs = [
		{ value: '', label: 'Semua' },
		{ value: 'villa', label: 'Villa' },
		{ value: 'wisata', label: 'Wisata' },
		{ value: 'kuliner', label: 'Kuliner' }
	];

	let searchInput = $state(data.search);

	const totalPages = $derived(Math.ceil(data.total / data.pageSize));

	function buildUrl(params: Record<string, string | number>) {
		const u = new URL($page.url);
		for (const [k, v] of Object.entries(params)) {
			if (v === '' || v === 0) u.searchParams.delete(k);
			else u.searchParams.set(k, String(v));
		}
		return u.pathname + u.search;
	}

	function setType(t: string) {
		goto(buildUrl({ type: t, q: data.search, page: 1 }));
	}

	function onSearchKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			goto(buildUrl({ type: data.type, q: searchInput, page: 1 }));
		}
	}

	function goPage(p: number) {
		goto(buildUrl({ type: data.type, q: data.search, page: p }));
	}
</script>

<Seo title="Kelola Direktori" />

<div class="flex flex-wrap items-center justify-between gap-3">
	<h1 class="font-heading text-2xl font-bold text-brand">Direktori</h1>
	<a href="/proplayer/places/new" class="btn-primary">+ Tambah</a>
</div>

{#if form?.error}
	<p class="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{form.error}</p>
{/if}

<!-- Filter tabs + Search -->
<div class="mt-4 flex flex-wrap items-center gap-3">
	<div class="flex gap-2">
		{#each tabs as tab}
			<button
				type="button"
				onclick={() => setType(tab.value)}
				class="rounded-full px-4 py-1.5 text-sm {data.type === tab.value ? 'bg-brand text-white' : 'bg-surface text-ink'}"
			>
				{tab.label}
			</button>
		{/each}
	</div>

	<div class="relative ml-auto">
		<input
			type="search"
			placeholder="Cari nama, kode, lokasi…"
			bind:value={searchInput}
			onkeydown={onSearchKeydown}
			class="w-56 rounded-lg border border-ink/20 bg-surface py-1.5 pl-8 pr-3 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand"
		/>
		<svg class="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
			<path stroke-linecap="round" stroke-linejoin="round" d="m21 21-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0Z" />
		</svg>
	</div>
</div>

<!-- Info hasil -->
<p class="mt-3 text-xs text-ink/50">
	{data.total} data ditemukan
	{#if data.search} untuk "<span class="font-medium text-ink/70">{data.search}</span>"{/if}
	· halaman {data.page} dari {totalPages || 1}
</p>

<!-- Tabel -->
<div class="mt-2 overflow-x-auto rounded-xl bg-surface shadow-md">
	<table class="w-full text-left text-sm">
		<thead class="border-b border-ink/10 text-ink/60">
			<tr>
				<th class="p-3">Nama</th>
				<th class="p-3">Kode</th>
				<th class="p-3">Tipe</th>
				<th class="p-3">Lokasi</th>
				<th class="p-3">Flag</th>
				<th class="p-3 text-right">Aksi</th>
			</tr>
		</thead>
		<tbody>
			{#each data.places as p (p.id)}
				<tr class="border-b border-ink/5 hover:bg-cream/50">
					<td class="p-3 font-medium">{p.name}</td>
					<td class="p-3 text-ink/70">{p.kode ?? '-'}</td>
					<td class="p-3 capitalize">{p.type}{p.status ? ` · ${p.status}` : ''}</td>
					<td class="p-3 text-ink/70">{p.lokasi ?? '-'}</td>
					<td class="p-3">
						{#if p.is_promo}<span class="mr-1 rounded bg-accent px-1.5 py-0.5 text-xs text-ink">Promo</span>{/if}
						{#if p.is_featured}<span class="rounded bg-brand px-1.5 py-0.5 text-xs text-white">Unggulan</span>{/if}
					</td>
					<td class="p-3 text-right">
						<a href={`/proplayer/places/${p.id}`} class="text-brand hover:underline">Edit</a>
						<form
							method="POST"
							action="?/delete"
							class="ml-3 inline"
							use:enhance
							onsubmit={(e) => { if (!confirm(`Hapus "${p.name}"?`)) e.preventDefault(); }}
						>
							<input type="hidden" name="id" value={p.id} />
							<button class="text-red-600 hover:underline">Hapus</button>
						</form>
					</td>
				</tr>
			{:else}
				<tr><td colspan="6" class="p-6 text-center text-ink/50">Belum ada data.</td></tr>
			{/each}
		</tbody>
	</table>
</div>

<!-- Pagination -->
{#if totalPages > 1}
	<div class="mt-4 flex flex-wrap items-center justify-center gap-1">
		<button
			onclick={() => goPage(data.page - 1)}
			disabled={data.page <= 1}
			class="rounded-lg border border-ink/20 px-3 py-1.5 text-sm disabled:opacity-40 enabled:hover:bg-surface"
		>
			‹ Prev
		</button>

		{#each Array.from({ length: totalPages }, (_, i) => i + 1) as pg}
			{#if pg === 1 || pg === totalPages || Math.abs(pg - data.page) <= 2}
				<button
					onclick={() => goPage(pg)}
					class="rounded-lg border px-3 py-1.5 text-sm {pg === data.page ? 'border-brand bg-brand text-white' : 'border-ink/20 hover:bg-surface'}"
				>
					{pg}
				</button>
			{:else if Math.abs(pg - data.page) === 3}
				<span class="px-1 text-ink/40">…</span>
			{/if}
		{/each}

		<button
			onclick={() => goPage(data.page + 1)}
			disabled={data.page >= totalPages}
			class="rounded-lg border border-ink/20 px-3 py-1.5 text-sm disabled:opacity-40 enabled:hover:bg-surface"
		>
			Next ›
		</button>
	</div>
{/if}

<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import Seo from '$lib/components/Seo.svelte';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const tabs = [
		{ value: '', label: 'Semua' },
		{ value: 'villa', label: 'Villa' },
		{ value: 'wisata', label: 'Wisata' },
		{ value: 'kuliner', label: 'Kuliner' }
	];

	function setType(t: string) {
		goto(t ? `/admin/places?type=${t}` : '/admin/places');
	}
</script>

<Seo title="Kelola Direktori" />

<div class="flex flex-wrap items-center justify-between gap-3">
	<h1 class="font-heading text-2xl font-bold text-brand">Direktori</h1>
	<a href="/admin/places/new" class="btn-primary">+ Tambah</a>
</div>

{#if form?.error}
	<p class="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{form.error}</p>
{/if}

<div class="mt-4 flex gap-2">
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

<div class="mt-5 overflow-x-auto rounded-xl bg-surface shadow-md">
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
						<a href={`/admin/places/${p.id}`} class="text-brand hover:underline">Edit</a>
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

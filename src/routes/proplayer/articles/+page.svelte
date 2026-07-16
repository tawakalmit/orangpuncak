<script lang="ts">
	import { enhance } from '$app/forms';
	import Seo from '$lib/components/Seo.svelte';
	import { formatTanggal } from '$lib/utils/format';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<Seo title="Kelola Artikel" />

<div class="flex items-center justify-between">
	<h1 class="font-heading text-2xl font-bold text-brand">Artikel</h1>
	<a href="/proplayer/articles/new" class="btn-primary">+ Tambah</a>
</div>

{#if form?.error}
	<p class="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{form.error}</p>
{/if}

<div class="mt-5 overflow-x-auto rounded-xl bg-surface shadow-md">
	<table class="w-full text-left text-sm">
		<thead class="border-b border-ink/10 text-ink/60">
			<tr><th class="p-3">Judul</th><th class="p-3">Tanggal</th><th class="p-3 text-right">Aksi</th></tr>
		</thead>
		<tbody>
			{#each data.articles as a (a.id)}
				<tr class="border-b border-ink/5 hover:bg-cream/50">
					<td class="p-3 font-medium">{a.title}</td>
					<td class="p-3 text-ink/70">{formatTanggal(a.published_at)}</td>
					<td class="p-3 text-right">
						<a href={`/proplayer/articles/${a.id}`} class="text-brand hover:underline">Edit</a>
						<form method="POST" action="?/delete" class="ml-3 inline" use:enhance onsubmit={(e) => { if (!confirm(`Hapus "${a.title}"?`)) e.preventDefault(); }}>
							<input type="hidden" name="id" value={a.id} />
							<button class="text-red-600 hover:underline">Hapus</button>
						</form>
					</td>
				</tr>
			{:else}
				<tr><td colspan="3" class="p-6 text-center text-ink/50">Belum ada artikel.</td></tr>
			{/each}
		</tbody>
	</table>
</div>

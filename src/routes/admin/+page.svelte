<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const cards = $derived(
		data.counts
			? [
					{ label: 'Villa', value: data.counts.villa, href: '/admin/places?type=villa' },
					{ label: 'Wisata', value: data.counts.wisata, href: '/admin/places?type=wisata' },
					{ label: 'Kuliner', value: data.counts.kuliner, href: '/admin/places?type=kuliner' },
					{ label: 'Artikel', value: data.counts.articles, href: '/admin/articles' },
					{ label: 'Total Leads', value: data.counts.leads, href: '/admin/leads' },
					{ label: 'Leads Baru', value: data.counts.newLeads, href: '/admin/leads' }
				]
			: []
	);
</script>

<Seo title="Dashboard Admin" />

<h1 class="font-heading text-2xl font-bold text-brand">Dashboard</h1>
<p class="mt-1 text-ink/60">Ringkasan konten orangpuncak.com.</p>

{#if data.counts}
	<div class="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
		{#each cards as c}
			<a href={c.href} class="rounded-xl bg-surface p-5 shadow-md transition hover:shadow-lg">
				<div class="text-3xl font-bold text-brand">{c.value}</div>
				<div class="mt-1 text-sm text-ink/60">{c.label}</div>
			</a>
		{/each}
	</div>

	<div class="mt-8 flex flex-wrap gap-3">
		<a href="/admin/places/new" class="btn-primary">+ Tambah Direktori</a>
		<a href="/admin/articles/new" class="btn-action">+ Tambah Artikel</a>
	</div>
{:else}
	<p class="mt-6 rounded-md bg-amber-50 px-4 py-3 text-amber-700">
		Supabase belum terhubung. Data tidak dapat dimuat.
	</p>
{/if}

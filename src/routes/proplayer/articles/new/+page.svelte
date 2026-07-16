<script lang="ts">
	import ArticleForm from '$lib/components/admin/ArticleForm.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<Seo title="Tambah Artikel" />

<a href="/proplayer/articles" class="text-sm text-brand hover:underline">← Kembali</a>
<h1 class="mt-2 font-heading text-2xl font-bold text-brand">Tambah Artikel</h1>

<ArticleForm error={form?.error} submitLabel="Simpan" />

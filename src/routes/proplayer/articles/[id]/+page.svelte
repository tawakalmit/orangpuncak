<script lang="ts">
	import { enhance } from '$app/forms';
	import ArticleForm from '$lib/components/admin/ArticleForm.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<Seo title={`Edit ${data.article.title}`} />

<div class="flex items-center justify-between">
	<a href="/proplayer/articles" class="text-sm text-brand hover:underline">← Kembali</a>
	<form method="POST" action="?/delete" use:enhance onsubmit={(e) => { if (!confirm('Hapus artikel ini?')) e.preventDefault(); }}>
		<button class="text-sm text-red-600 hover:underline">Hapus</button>
	</form>
</div>
<h1 class="mt-2 font-heading text-2xl font-bold text-brand">Edit: {data.article.title}</h1>

<ArticleForm article={data.article} error={form?.error} submitLabel="Perbarui" formAction="?/update" />

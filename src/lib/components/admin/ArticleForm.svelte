<script lang="ts">
	import { enhance } from '$app/forms';
	import ImageUpload from './ImageUpload.svelte';
	import RichTextEditor from './RichTextEditor.svelte';
	import type { Article } from '$lib/types';

	interface Props {
		article?: Partial<Article> & { published?: boolean };
		error?: string | null;
		submitLabel?: string;
		formAction?: string;
	}
	let { article = {}, error = null, submitLabel = 'Simpan', formAction = '' }: Props = $props();

	let cover = $state(article.cover_image ?? '');
	let content = $state(article.content ?? '');
	let saving = $state(false);
	const inputClass = 'w-full rounded-md border border-ink/20 px-3 py-2';

	const dateValue = article.published_at ? new Date(article.published_at).toISOString().slice(0, 10) : '';
	const tagsValue = (article.tags ?? []).join(', ');
</script>

<form
	method="POST"
	action={formAction}
	class="mt-5 space-y-6"
	use:enhance={() => {
		saving = true;
		return async ({ update }) => {
			await update();
			saving = false;
		};
	}}
>
	{#if error}<p class="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>{/if}

	<section class="rounded-xl bg-surface p-5 shadow-md">
		<div class="grid gap-4 md:grid-cols-2">
			<div class="md:col-span-2">
				<label for="title" class="mb-1 block text-sm font-medium">Judul *</label>
				<input id="title" name="title" required value={article.title ?? ''} class={inputClass} />
			</div>
			<div>
				<label for="slug" class="mb-1 block text-sm font-medium">Slug</label>
				<input id="slug" name="slug" value={article.slug ?? ''} class={inputClass} placeholder="otomatis dari judul" />
			</div>
			<div>
				<label for="published_at" class="mb-1 block text-sm font-medium">Tanggal Terbit</label>
				<input id="published_at" name="published_at" type="date" value={dateValue} class={inputClass} />
			</div>
			<div class="md:col-span-2">
				<label for="tags" class="mb-1 block text-sm font-medium">Tags (pisah dengan koma)</label>
				<input id="tags" name="tags" value={tagsValue} class={inputClass} placeholder="tips, cuaca, wisata" />
			</div>
			<div class="md:col-span-2">
				<label for="excerpt" class="mb-1 block text-sm font-medium">Ringkasan</label>
				<textarea id="excerpt" name="excerpt" rows="2" class={inputClass}>{article.excerpt ?? ''}</textarea>
			</div>
			<div class="md:col-span-2">
				<RichTextEditor name="content" label="Konten" bind:value={content} />
			</div>
		</div>
		<div class="mt-4">
			<ImageUpload name="cover_image" label="Cover" bind:value={cover} />
		</div>
		<label class="mt-4 flex items-center gap-2 text-sm">
			<input type="checkbox" name="published" checked={article.id ? article.published ?? true : true} class="h-4 w-4 accent-brand" /> Tampilkan (published)
		</label>
	</section>

	<div class="flex gap-3">
		<button type="submit" disabled={saving} class="btn-primary">{saving ? 'Menyimpan...' : submitLabel}</button>
		<a href="/admin/articles" class="rounded-full border border-ink/20 px-6 py-3 font-medium">Batal</a>
	</div>
</form>

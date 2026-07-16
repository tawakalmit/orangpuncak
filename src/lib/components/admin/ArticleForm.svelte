<script lang="ts">
	import { enhance } from '$app/forms';
	import ImageUpload from './ImageUpload.svelte';
	import NearbyPicker from './NearbyPicker.svelte';
	import RichTextEditor from './RichTextEditor.svelte';
	import type { Article } from '$lib/types';

	interface PlaceOption {
		id: string;
		name: string;
		type: string;
	}

	interface Props {
		article?: Partial<Article> & { published?: boolean };
		error?: string | null;
		submitLabel?: string;
		formAction?: string;
		allPlaces?: PlaceOption[];
	}
	let { article = {}, error = null, submitLabel = 'Simpan', formAction = '', allPlaces = [] }: Props = $props();

	let cover = $state(article.cover_image ?? '');
	let content = $state(article.content ?? '');
	let saving = $state(false);
	const inputClass = 'w-full rounded-md border border-ink/20 px-3 py-2';

	const dateValue = article.published_at ? new Date(article.published_at).toISOString().slice(0, 10) : '';
	const tagsValue = (article.tags ?? []).join(', ');

	// Filter places by type
	const villaOptions = $derived(allPlaces.filter((p) => p.type === 'villa'));
	const wisataOptions = $derived(allPlaces.filter((p) => p.type === 'wisata'));
	const kulinerOptions = $derived(allPlaces.filter((p) => p.type === 'kuliner'));

	let relatedVilla = $state<string[]>(article.related_villa_ids ?? []);
	let relatedWisata = $state<string[]>(article.related_wisata_ids ?? []);
	let relatedKuliner = $state<string[]>(article.related_kuliner_ids ?? []);
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
			<div>
				<label for="template" class="mb-1 block text-sm font-medium">Template</label>
				<select id="template" name="template" class={inputClass} value={article.template ?? 'artikel'}>
					<option value="artikel">Artikel — tampilan standar</option>
					<option value="hub">Hub — lebar + direktori tempat</option>
				</select>
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

	<!-- SEO -->
	<section class="rounded-xl bg-surface p-5 shadow-md">
		<h2 class="font-heading font-semibold text-brand">SEO</h2>
		<p class="mt-1 text-sm text-ink/60">Kosongkan untuk menggunakan judul & ringkasan artikel sebagai fallback.</p>
		<div class="mt-4 grid gap-4">
			<div>
				<label for="meta_title" class="mb-1 block text-sm font-medium">Meta Title</label>
				<input id="meta_title" name="meta_title" value={article.meta_title ?? ''} class={inputClass} placeholder={article.title ?? 'Judul artikel'} maxlength="70" />
				<p class="mt-1 text-xs text-ink/50">Maks. 70 karakter. Dipakai sebagai judul di hasil pencarian Google.</p>
			</div>
			<div>
				<label for="meta_description" class="mb-1 block text-sm font-medium">Meta Description</label>
				<textarea id="meta_description" name="meta_description" rows="2" class={inputClass} maxlength="160" placeholder={article.excerpt ?? 'Ringkasan artikel'}>{article.meta_description ?? ''}</textarea>
				<p class="mt-1 text-xs text-ink/50">Maks. 160 karakter. Ditampilkan di bawah judul pada hasil pencarian.</p>
			</div>
		</div>
	</section>

	<!-- Relasi Places -->
	<section class="rounded-xl bg-surface p-5 shadow-md">
		<h2 class="font-heading font-semibold text-brand">Tempat Pilihan di Artikel Ini</h2>
		<p class="mt-1 text-sm text-ink/60">Akan ditampilkan di halaman artikel sebagai "Villa Pilihan", "Wisata Pilihan", dan "Kuliner Pilihan".</p>
		<div class="mt-4 grid gap-5 md:grid-cols-3">
			<NearbyPicker
				name="related_villa_ids"
				label="Villa Pilihan"
				options={villaOptions}
				bind:selected={relatedVilla}
				max={6}
			/>
			<NearbyPicker
				name="related_wisata_ids"
				label="Wisata Pilihan"
				options={wisataOptions}
				bind:selected={relatedWisata}
				max={6}
			/>
			<NearbyPicker
				name="related_kuliner_ids"
				label="Kuliner Pilihan"
				options={kulinerOptions}
				bind:selected={relatedKuliner}
				max={6}
			/>
		</div>
	</section>

	<div class="flex gap-3">
		<button type="submit" disabled={saving} class="btn-primary">{saving ? 'Menyimpan...' : submitLabel}</button>
		<a href="/proplayer/articles" class="rounded-full border border-ink/20 px-6 py-3 font-medium">Batal</a>
	</div>
</form>

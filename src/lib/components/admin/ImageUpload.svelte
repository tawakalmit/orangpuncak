<script lang="ts">
	import { imagekitConfigured, uploadToImageKit, imgThumb } from '$lib/utils/imagekit';

	interface Props {
		/** URL tunggal (cover) atau daftar URL (gallery) */
		value?: string;
		values?: string[];
		multiple?: boolean;
		label?: string;
		/** nama hidden input agar ikut terkirim di form action */
		name: string;
	}

	let {
		value = $bindable(''),
		values = $bindable([]),
		multiple = false,
		label = 'Gambar',
		name
	}: Props = $props();

	let uploading = $state(false);
	let error = $state('');

	async function handleFiles(e: Event) {
		const input = e.target as HTMLInputElement;
		if (!input.files?.length) return;
		error = '';
		uploading = true;
		try {
			const files = Array.from(input.files);
			const results = await Promise.all(files.map((f) => uploadToImageKit(f)));
			const urls = results.map((r) => r.url);
			if (multiple) {
				values = [...values, ...urls];
			} else {
				value = urls[0];
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'Upload gagal.';
		} finally {
			uploading = false;
			input.value = '';
		}
	}

	function removeAt(i: number) {
		values = values.filter((_, idx) => idx !== i);
	}

	let manualUrl = $state('');
	function addManual() {
		if (manualUrl.trim()) {
			values = [...values, manualUrl.trim()];
			manualUrl = '';
		}
	}
</script>

<div>
	<span class="mb-1 block text-sm font-medium">{label}</span>

	{#if !imagekitConfigured}
		<p class="rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-700">
			ImageKit belum dikonfigurasi. Isi <code>PUBLIC_IMAGEKIT_PUBLIC_KEY</code> &amp;
			<code>PUBLIC_IMAGEKIT_URL_ENDPOINT</code> di <code>.env</code>. Untuk sementara kamu bisa
			menempel URL gambar manual di bawah.
		</p>
	{/if}

	<!-- Preview -->
	{#if multiple}
		{#if values.length}
			<div class="mb-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
				{#each values as url, i}
					<div class="relative">
						<img src={imgThumb(url)} alt={`Gambar ${i + 1}`} class="aspect-square w-full rounded-md object-cover" />
						<button
							type="button"
							onclick={() => removeAt(i)}
							class="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs text-white"
							aria-label="Hapus gambar"
						>
							✕
						</button>
					</div>
				{/each}
			</div>
		{/if}
		{#each values as url}
			<input type="hidden" {name} value={url} />
		{/each}
	{:else}
		{#if value}
			<img src={imgThumb(value)} alt="Preview" class="mb-2 aspect-video w-full max-w-xs rounded-md object-cover" />
		{/if}
		<input type="hidden" {name} bind:value />
	{/if}

	<div class="flex items-center gap-3">
		<label class="btn-filter cursor-pointer text-sm">
			{uploading ? 'Mengunggah...' : multiple ? 'Tambah Gambar' : 'Pilih Gambar'}
			<input
				type="file"
				accept="image/*"
				{multiple}
				class="hidden"
				onchange={handleFiles}
				disabled={uploading || !imagekitConfigured}
			/>
		</label>
		{#if uploading}<span class="text-sm text-ink/60">Tunggu sebentar...</span>{/if}
	</div>

	<!-- Input manual URL (fallback) -->
	{#if !multiple}
		<input
			type="url"
			placeholder="atau tempel URL gambar di sini"
			bind:value
			class="mt-2 w-full rounded-md border border-ink/20 px-3 py-2 text-sm"
		/>
	{:else}
		<div class="mt-2 flex gap-2">
			<input
				type="url"
				placeholder="atau tempel URL gambar"
				bind:value={manualUrl}
				class="w-full rounded-md border border-ink/20 px-3 py-2 text-sm"
			/>
			<button type="button" onclick={addManual} class="rounded-md border border-ink/20 px-3 text-sm">
				Tambah
			</button>
		</div>
	{/if}

	{#if error}<p class="mt-1 text-sm text-red-600">{error}</p>{/if}
</div>

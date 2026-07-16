<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type { Editor } from '@tiptap/core';
	import { cloudinaryConfigured, uploadToCloudinary } from '$lib/utils/cloudinary';

	interface Props {
		value?: string;
		name: string;
		label?: string;
	}
	let { value = $bindable(''), name, label = 'Konten' }: Props = $props();

	let element: HTMLDivElement;
	let editor = $state<Editor | null>(null);
	let uploadingImg = $state(false);
	let imgError = $state('');

	// state tombol toolbar aktif
	let active = $state<Record<string, boolean>>({});
	let showTableMenu = $state(false);

	function refreshActive() {
		if (!editor) return;
		active = {
			bold: editor.isActive('bold'),
			italic: editor.isActive('italic'),
			h2: editor.isActive('heading', { level: 2 }),
			h3: editor.isActive('heading', { level: 3 }),
			bullet: editor.isActive('bulletList'),
			ordered: editor.isActive('orderedList'),
			blockquote: editor.isActive('blockquote'),
			link: editor.isActive('link'),
			table: editor.isActive('table')
		};
	}

	onMount(() => {
		let destroyed = false;
		(async () => {
			const { Editor } = await import('@tiptap/core');
			const { default: StarterKit } = await import('@tiptap/starter-kit');
			const { default: Link } = await import('@tiptap/extension-link');
			const { default: Image } = await import('@tiptap/extension-image');
			const { Table } = await import('@tiptap/extension-table');
			const { TableRow } = await import('@tiptap/extension-table-row');
			const { TableCell } = await import('@tiptap/extension-table-cell');
			const { TableHeader } = await import('@tiptap/extension-table-header');
			if (destroyed) return;

			editor = new Editor({
				element,
				extensions: [
					StarterKit,
					Link.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener', target: '_blank' } }),
					Image.configure({ inline: false, HTMLAttributes: { class: 'rounded-lg' } }),
					Table.configure({ resizable: false }),
					TableRow,
					TableCell,
					TableHeader
				],
				content: value || '',
				onTransaction: () => {
					refreshActive();
				},
				onUpdate: ({ editor }) => {
					const html = editor.getHTML();
					value = html === '<p></p>' ? '' : html;
				},
				editorProps: {
					attributes: {
						class: 'prose max-w-none min-h-[220px] focus:outline-none px-4 py-3'
					}
				}
			});
			refreshActive();
		})();

		return () => {
			destroyed = true;
		};
	});

	onDestroy(() => editor?.destroy());

	function cmd(fn: () => void) {
		fn();
		editor?.chain().focus().run();
	}

	function setLink() {
		if (!editor) return;
		const prev = editor.getAttributes('link').href ?? '';
		const url = window.prompt('URL tautan:', prev);
		if (url === null) return;
		if (url === '') {
			editor.chain().focus().extendMarkRange('link').unsetLink().run();
			return;
		}
		editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
	}

	function insertTable() {
		editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
		showTableMenu = false;
	}

	function tableCmd(fn: () => boolean | void) {
		fn();
		showTableMenu = false;
	}

	async function handleImageFile(e: Event) {
		const input = e.target as HTMLInputElement;
		if (!input.files?.length || !editor) return;
		imgError = '';
		uploadingImg = true;
		try {
			const result = await uploadToCloudinary(input.files[0]);
			editor.chain().focus().setImage({ src: result.secure_url, alt: input.files[0].name }).run();
		} catch (err) {
			imgError = err instanceof Error ? err.message : 'Upload gambar gagal.';
		} finally {
			uploadingImg = false;
			input.value = '';
		}
	}

	const btn = 'rounded px-2 py-1 text-sm font-medium hover:bg-cream';
	const btnActive = 'bg-brand text-white hover:bg-brand';
</script>

<div>
	<span class="mb-1 block text-sm font-medium">{label}</span>
	<div class="rounded-md border border-ink/20 bg-white">
		<!-- Toolbar -->
		<div class="flex flex-wrap items-center gap-1 border-b border-ink/10 bg-cream px-2 py-1.5 sticky top-0 z-10 rounded-t-md">
			<button type="button" class="{btn} {active.bold ? btnActive : ''}" onclick={() => cmd(() => editor?.chain().focus().toggleBold().run())} title="Bold"><strong>B</strong></button>
			<button type="button" class="{btn} {active.italic ? btnActive : ''}" onclick={() => cmd(() => editor?.chain().focus().toggleItalic().run())} title="Italic"><em>I</em></button>
			<span class="mx-1 h-5 w-px bg-ink/15"></span>
			<button type="button" class="{btn} {active.h2 ? btnActive : ''}" onclick={() => cmd(() => editor?.chain().focus().toggleHeading({ level: 2 }).run())} title="Heading 2">H2</button>
			<button type="button" class="{btn} {active.h3 ? btnActive : ''}" onclick={() => cmd(() => editor?.chain().focus().toggleHeading({ level: 3 }).run())} title="Heading 3">H3</button>
			<span class="mx-1 h-5 w-px bg-ink/15"></span>
			<button type="button" class="{btn} {active.bullet ? btnActive : ''}" onclick={() => cmd(() => editor?.chain().focus().toggleBulletList().run())} title="Bullet List">• List</button>
			<button type="button" class="{btn} {active.ordered ? btnActive : ''}" onclick={() => cmd(() => editor?.chain().focus().toggleOrderedList().run())} title="Ordered List">1. List</button>
			<button type="button" class="{btn} {active.blockquote ? btnActive : ''}" onclick={() => cmd(() => editor?.chain().focus().toggleBlockquote().run())} title="Quote">❝</button>
			<span class="mx-1 h-5 w-px bg-ink/15"></span>
			<button type="button" class="{btn} {active.link ? btnActive : ''}" onclick={setLink} title="Tautan">🔗</button>
			<label class="{btn} cursor-pointer" title={cloudinaryConfigured ? 'Sisipkan gambar (Cloudinary)' : 'Cloudinary belum dikonfigurasi'} class:opacity-50={!cloudinaryConfigured || uploadingImg}>
				{uploadingImg ? '⏳ Upload...' : '🖼️ Gambar'}
				<input type="file" accept="image/*" class="hidden" onchange={handleImageFile} disabled={!cloudinaryConfigured || uploadingImg} />
			</label>
			<button type="button" class={btn} onclick={() => cmd(() => editor?.chain().focus().unsetAllMarks().clearNodes().run())} title="Hapus format">⨯ format</button>
			<!-- Tabel -->
			<span class="mx-1 h-5 w-px bg-ink/15"></span>
			<div class="relative">
				<button
					type="button"
					class="{btn} {active.table ? btnActive : ''}"
					title="Tabel"
					onclick={() => (showTableMenu = !showTableMenu)}
				>⊞ Tabel</button>
				{#if showTableMenu}
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div
						class="absolute left-0 top-full z-50 mt-1 w-48 rounded-md border border-ink/15 bg-white py-1 shadow-lg text-sm"
						onmouseleave={() => (showTableMenu = false)}
					>
						<button type="button" class="w-full px-3 py-1.5 text-left hover:bg-cream" onclick={insertTable}>+ Sisipkan tabel (3×3)</button>
						<hr class="my-1 border-ink/10" />
						<button type="button" class="w-full px-3 py-1.5 text-left hover:bg-cream" onclick={() => tableCmd(() => editor?.chain().focus().addColumnBefore().run())}>+ Kolom sebelum</button>
						<button type="button" class="w-full px-3 py-1.5 text-left hover:bg-cream" onclick={() => tableCmd(() => editor?.chain().focus().addColumnAfter().run())}>+ Kolom sesudah</button>
						<button type="button" class="w-full px-3 py-1.5 text-left hover:bg-cream" onclick={() => tableCmd(() => editor?.chain().focus().deleteColumn().run())}>− Hapus kolom</button>
						<hr class="my-1 border-ink/10" />
						<button type="button" class="w-full px-3 py-1.5 text-left hover:bg-cream" onclick={() => tableCmd(() => editor?.chain().focus().addRowBefore().run())}>+ Baris sebelum</button>
						<button type="button" class="w-full px-3 py-1.5 text-left hover:bg-cream" onclick={() => tableCmd(() => editor?.chain().focus().addRowAfter().run())}>+ Baris sesudah</button>
						<button type="button" class="w-full px-3 py-1.5 text-left hover:bg-cream" onclick={() => tableCmd(() => editor?.chain().focus().deleteRow().run())}>− Hapus baris</button>
						<hr class="my-1 border-ink/10" />
						<button type="button" class="w-full px-3 py-1.5 text-left hover:bg-cream" onclick={() => tableCmd(() => editor?.chain().focus().mergeCells().run())}>↔ Gabung sel</button>
						<button type="button" class="w-full px-3 py-1.5 text-left hover:bg-cream" onclick={() => tableCmd(() => editor?.chain().focus().splitCell().run())}>⇔ Pisah sel</button>
						<hr class="my-1 border-ink/10" />
						<button type="button" class="w-full px-3 py-1.5 text-left hover:bg-cream text-red-600" onclick={() => tableCmd(() => editor?.chain().focus().deleteTable().run())}>✕ Hapus tabel</button>
					</div>
				{/if}
			</div>
		</div>

		<!-- Editor mount point -->
		<div bind:this={element}></div>
	</div>

	<!-- Nilai yang dikirim ke form action -->
	<textarea {name} class="hidden" bind:value></textarea>
	{#if imgError}<p class="mt-1 text-sm text-red-600">{imgError}</p>{/if}
	<p class="mt-1 text-xs text-ink/50">
		Format teks disimpan sebagai HTML. Gambar diunggah ke Cloudinary lalu disisipkan di posisi kursor.
	</p>
</div>

<style>
	/* Styling tabel di dalam editor Tiptap */
	:global(.ProseMirror table) {
		border-collapse: collapse;
		width: 100%;
		margin: 1rem 0;
		font-size: 0.9rem;
	}
	:global(.ProseMirror table td),
	:global(.ProseMirror table th) {
		border: 1px solid #d1d5db;
		padding: 0.4rem 0.6rem;
		vertical-align: top;
		min-width: 2rem;
	}
	:global(.ProseMirror table th) {
		background-color: #f3f4f6;
		font-weight: 600;
		text-align: left;
	}
	:global(.ProseMirror table .selectedCell) {
		background-color: #dbeafe;
	}
</style>

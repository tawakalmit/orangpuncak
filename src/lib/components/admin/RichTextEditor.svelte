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
			link: editor.isActive('link')
		};
	}

	onMount(() => {
		let destroyed = false;
		(async () => {
			const { Editor } = await import('@tiptap/core');
			const { default: StarterKit } = await import('@tiptap/starter-kit');
			const { default: Link } = await import('@tiptap/extension-link');
			const { default: Image } = await import('@tiptap/extension-image');
			if (destroyed) return;

			editor = new Editor({
				element,
				extensions: [
					StarterKit,
					Link.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener', target: '_blank' } }),
					Image.configure({ inline: false, HTMLAttributes: { class: 'rounded-lg' } })
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
	<div class="overflow-hidden rounded-md border border-ink/20 bg-white">
		<!-- Toolbar -->
		<div class="flex flex-wrap items-center gap-1 border-b border-ink/10 bg-cream/40 px-2 py-1.5">
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

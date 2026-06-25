<script lang="ts">
	import { enhance } from '$app/forms';
	import Seo from '$lib/components/Seo.svelte';
	import { waLink } from '$lib/utils/whatsapp';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();

	const packages = [
		{
			name: 'Banner Display',
			price: 'Mulai Rp 500rb / bln',
			desc: 'Banner brand Anda tampil di posisi strategis halaman utama & direktori.',
			features: ['Slot banner home', 'Statistik tayang', 'Link ke website/WA']
		},
		{
			name: 'Artikel Sponsor',
			price: 'Mulai Rp 750rb',
			desc: 'Artikel ulasan bisnis Anda yang SEO-friendly dan dibagikan ke sosmed.',
			features: ['1 artikel native', 'Optimasi SEO', 'Share ke sosial media']
		},
		{
			name: 'Endorse Sosmed',
			price: 'Mulai Rp 1jt',
			desc: 'Konten endorse di Instagram/TikTok orangpuncak.com.',
			features: ['1 reels + 1 feed', 'Caption + tag', 'Insight performa']
		},
		{
			name: 'Listing Premium',
			price: 'Mulai Rp 300rb / bln',
			desc: 'Villa/wisata/kuliner Anda tampil prioritas dengan badge unggulan.',
			features: ['Badge unggulan', 'Prioritas urutan', 'Galeri + video']
		}
	];
</script>

<Seo
	title="Pasang Iklan & Kerjasama"
	description="Promosikan bisnis Anda di Puncak melalui banner, artikel sponsor, endorse sosmed, dan listing premium di orangpuncak.com."
	path="/iklan"
/>

<section class="bg-brand py-12 text-white">
	<div class="mx-auto max-w-content px-4 text-center 2xl:px-0">
		<h1 class="font-heading text-3xl font-bold md:text-4xl">Pasang Iklan di orangpuncak.com</h1>
		<p class="mx-auto mt-3 max-w-2xl text-white/85">
			Jangkau ribuan calon wisatawan & pencari villa di kawasan Puncak. Pilih paket kerjasama yang
			sesuai untuk bisnis Anda.
		</p>
	</div>
</section>

<section class="mx-auto max-w-content px-4 py-10 2xl:px-0">
	<h2 class="section-title text-center">Paket Kerjasama</h2>
	<div class="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
		{#each packages as pkg}
			<div class="flex flex-col rounded-2xl bg-surface p-5 shadow-md">
				<h3 class="font-heading text-lg font-bold text-brand">{pkg.name}</h3>
				<div class="mt-1 font-semibold text-ink">{pkg.price}</div>
				<p class="mt-2 text-sm text-ink/70">{pkg.desc}</p>
				<ul class="mt-3 space-y-1.5 text-sm text-ink/80">
					{#each pkg.features as f}
						<li class="flex items-center gap-2">
							<span class="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs text-ink">✓</span>
							{f}
						</li>
					{/each}
				</ul>
			</div>
		{/each}
	</div>
</section>

<!-- Form pengajuan -->
<section class="bg-muted py-10">
	<div class="mx-auto max-w-2xl px-4">
		<h2 class="section-title text-center">Ajukan Kerjasama</h2>
		<p class="mt-2 text-center text-ink/70">
			Isi formulir berikut, tim kami akan menghubungi Anda. Atau langsung
			<a
				href={waLink('Halo orangpuncak.com, saya ingin pasang iklan / kerjasama.')}
				target="_blank"
				rel="noopener"
				class="font-medium text-brand underline"
			>
				chat WhatsApp
			</a>.
		</p>

		{#if form?.success}
			<div class="mt-6 rounded-xl bg-brand p-5 text-center text-white shadow-md">
				Terima kasih! Pengajuan Anda sudah kami terima. Tim kami akan segera menghubungi Anda.
			</div>
		{:else}
			<form method="POST" use:enhance class="mt-6 space-y-4 rounded-2xl bg-surface p-6 shadow-md">
				{#if form?.error}
					<p class="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{form.error}</p>
				{/if}
				<div class="grid gap-4 sm:grid-cols-2">
					<div>
						<label for="business_name" class="mb-1 block text-sm font-medium">Nama Bisnis *</label>
						<input id="business_name" name="business_name" required value={form?.business_name ?? ''} class="w-full rounded-md border border-ink/20 px-3 py-2" />
					</div>
					<div>
						<label for="contact_name" class="mb-1 block text-sm font-medium">Nama Kontak *</label>
						<input id="contact_name" name="contact_name" required value={form?.contact_name ?? ''} class="w-full rounded-md border border-ink/20 px-3 py-2" />
					</div>
					<div>
						<label for="phone" class="mb-1 block text-sm font-medium">No. WhatsApp / Telepon *</label>
						<input id="phone" name="phone" required value={form?.phone ?? ''} class="w-full rounded-md border border-ink/20 px-3 py-2" />
					</div>
					<div>
						<label for="email" class="mb-1 block text-sm font-medium">Email</label>
						<input id="email" name="email" type="email" value={form?.email ?? ''} class="w-full rounded-md border border-ink/20 px-3 py-2" />
					</div>
				</div>
				<div>
					<label for="package" class="mb-1 block text-sm font-medium">Paket yang Diminati *</label>
					<select id="package" name="package" required class="w-full rounded-md border border-ink/20 px-3 py-2">
						<option value="">Pilih paket...</option>
						{#each packages as pkg}<option value={pkg.name}>{pkg.name}</option>{/each}
						<option value="Custom">Custom / Konsultasi</option>
					</select>
				</div>
				<div>
					<label for="message" class="mb-1 block text-sm font-medium">Pesan</label>
					<textarea id="message" name="message" rows="4" class="w-full rounded-md border border-ink/20 px-3 py-2">{form?.message ?? ''}</textarea>
				</div>
				<button type="submit" class="btn-primary w-full">Kirim Pengajuan</button>
			</form>
		{/if}
	</div>
</section>

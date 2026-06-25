<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import { waLink } from '$lib/utils/whatsapp';

	const steps = [
		{ t: 'Pilih Villa', d: 'Tentukan villa yang ingin Anda survey langsung ke lokasi.' },
		{ t: 'Ajukan Jadwal Survey', d: 'Klik tombol Survey di halaman villa, pesan WhatsApp otomatis berisi kode villa.' },
		{ t: 'Konfirmasi Tanggal', d: 'Tim kami menyesuaikan jadwal kunjungan bersama Anda.' },
		{ t: 'Kunjungan Lokasi', d: 'Survey langsung kondisi villa, fasilitas, dan lingkungan sekitar.' },
		{ t: 'Diskusi & Penawaran', d: 'Diskusikan harga sewa/jual dan opsi lanjutan setelah survey.' }
	];
</script>

<Seo title="Cara Survey" description="Langkah-langkah menjadwalkan survey villa di kawasan Puncak bersama orangpuncak.com." path="/cara-survey" />

<div class="mx-auto max-w-3xl px-4 py-10">
	<h1 class="section-title">Cara Survey Villa</h1>
	<p class="mt-2 text-ink/70">Ingin melihat villa langsung sebelum memutuskan? Ikuti langkah berikut.</p>

	<ol class="mt-8 space-y-4">
		{#each steps as step, i}
			<li class="flex gap-4 rounded-xl bg-surface p-5 shadow-md">
				<span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand font-heading font-bold text-white">{i + 1}</span>
				<div>
					<h2 class="font-bold">{step.t}</h2>
					<p class="mt-1 text-sm text-ink/70">{step.d}</p>
				</div>
			</li>
		{/each}
	</ol>

	<div class="mt-8 text-center">
		<a href={waLink('Halo orangpuncak.com, saya ingin menjadwalkan survey villa.')} target="_blank" rel="noopener" class="btn-primary">
			Ajukan Survey via WhatsApp
		</a>
	</div>
</div>

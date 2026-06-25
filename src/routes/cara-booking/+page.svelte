<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import { waLink } from '$lib/utils/whatsapp';

	const steps = [
		{ t: 'Pilih Villa / Wisata', d: 'Jelajahi direktori dan pilih villa atau destinasi yang Anda inginkan.' },
		{ t: 'Klik Tombol WhatsApp', d: 'Tekan tombol Booking/Konsultasi. Pesan otomatis berisi kode item akan terbuka.' },
		{ t: 'Cek Ketersediaan & Harga', d: 'Tim kami konfirmasi tanggal, ketersediaan, dan total biaya.' },
		{ t: 'Pembayaran DP', d: 'Lakukan pembayaran uang muka untuk mengunci reservasi Anda.' },
		{ t: 'Konfirmasi & Voucher', d: 'Anda menerima konfirmasi booking beserta detail check-in.' },
		{ t: 'Nikmati Liburan', d: 'Datang sesuai jadwal dan nikmati pengalaman terbaik di Puncak.' }
	];
</script>

<Seo title="Cara Booking" description="Langkah-langkah memesan villa dan reservasi wisata di orangpuncak.com." path="/cara-booking" />

<div class="mx-auto max-w-3xl px-4 py-10">
	<h1 class="section-title">Cara Booking / Reservasi</h1>
	<p class="mt-2 text-ink/70">Ikuti langkah mudah berikut untuk memesan villa atau wisata di Puncak.</p>

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
		<a href={waLink('Halo orangpuncak.com, saya ingin booking villa.')} target="_blank" rel="noopener" class="btn-primary">
			Booking via WhatsApp
		</a>
	</div>
</div>

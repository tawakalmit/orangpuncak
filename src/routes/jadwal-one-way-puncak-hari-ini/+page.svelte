<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import Card from '$lib/components/Card.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { SITE_URL } from '$lib/config';
	import { formatTanggal } from '$lib/utils/format';
	import { imgThumb } from '$lib/utils/imagekit';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const jsonLd = [
		{
			'@context': 'https://schema.org',
			'@type': 'Article',
			headline: 'Jadwal One Way Puncak Hari Ini',
			description:
				'Informasi lengkap jadwal one way Puncak hari ini. Cek jadwal terbaru sebelum berangkat agar perjalanan ke kawasan Puncak Bogor & Cianjur lebih lancar.',
			url: `${SITE_URL}/jadwal-one-way-puncak-hari-ini`,
			publisher: {
				'@type': 'Organization',
				name: 'orangpuncak.com',
				url: SITE_URL
			}
		},
		{
			'@context': 'https://schema.org',
			'@type': 'FAQPage',
			mainEntity: [
				{
					'@type': 'Question',
					name: 'Apa itu sistem one way Puncak?',
					acceptedAnswer: {
						'@type': 'Answer',
						text: 'Sistem one way Puncak adalah kebijakan pengaturan lalu lintas satu arah yang diterapkan untuk mengurangi kepadatan kendaraan menuju dan dari kawasan Puncak. Kendaraan hanya bisa melaju dalam satu arah pada waktu yang telah ditentukan.'
					}
				},
				{
					'@type': 'Question',
					name: 'Kapan one way Puncak diberlakukan?',
					acceptedAnswer: {
						'@type': 'Answer',
						text: 'Sistem one way Puncak biasanya berlaku pada akhir pekan, hari libur nasional, dan saat musim liburan panjang. Jadwal bisa berubah sewaktu-waktu tergantung kondisi lalu lintas.'
					}
				},
				{
					'@type': 'Question',
					name: 'Jam berapa one way arah Puncak (naik)?',
					acceptedAnswer: {
						'@type': 'Answer',
						text: 'One way arah Puncak (naik) berlaku mulai pukul 07:30 hingga 12:30 WIB. Disarankan berangkat sebelum pukul 10:00 WIB agar tidak terjebak kemacetan.'
					}
				},
				{
					'@type': 'Question',
					name: 'Jam berapa one way arah Jakarta (turun)?',
					acceptedAnswer: {
						'@type': 'Answer',
						text: 'One way arah Jakarta (turun) berlaku mulai pukul 12:30 hingga 15:00 WIB.'
					}
				}
			]
		}
	];
</script>

<Seo
	title="Jadwal One Way Puncak Hari Ini"
	description="Cek jadwal one way Puncak hari ini sebelum berangkat. Info terbaru jam berlaku, arah naik & turun, serta tips perjalanan lancar ke kawasan Puncak Bogor & Cianjur."
	path="/jadwal-one-way-puncak-hari-ini"
	{jsonLd}
/>

<Breadcrumb
	items={[
		{ label: 'Beranda', href: '/' },
		{ label: 'Info Puncak', href: '/artikel' },
		{ label: 'Jadwal One Way Puncak Hari Ini' }
	]}
/>

<div class="mx-auto max-w-content px-4 py-8 2xl:px-0 lg:w-11/12">
	<!-- Hero heading -->
	<header class="mb-8">
		<h1 class="section-title">Jadwal One Way Puncak Hari Ini</h1>
		<p class="mt-3 max-w-2xl text-ink/70">
			Informasi jadwal <strong>one way Puncak terbaru</strong> yang berlaku hari ini. Selalu cek
			sebelum berangkat agar perjalanan ke kawasan Puncak Bogor &amp; Cianjur lebih lancar dan
			menyenangkan.
		</p>
	</header>

	<!-- CTA Villa -->
	<div class="mb-10 rounded-xl border border-ink/10 bg-surface p-6 text-center shadow-sm">
		<p class="text-ink/80">Kejebak one way? <br> <strong>Yuk cari villa nyaman &amp; murah dekat jalur Puncak</strong> sekarang!</p>
		<a href="/villa" class="btn-primary mt-4">
			Lihat Villa Rekomendasi
		</a>
		<p class="mt-3 text-sm text-ink/50">Lebih dari 100 pengunjung sudah booking hari ini!</p>
	</div>

	<!-- Apa itu One Way -->
	<section class="mb-10">
		<h2 class="font-heading text-xl font-semibold text-brand md:text-2xl">
			Apa Itu Sistem One Way Puncak?
		</h2>
		<div class="mt-4 rounded-xl bg-surface p-5 shadow-md text-ink/80 space-y-3">
			<p>
				Sistem <strong>one way Puncak</strong> adalah kebijakan pengaturan lalu lintas satu arah yang
				diterapkan untuk mengurangi kepadatan kendaraan menuju dan dari kawasan Puncak. Dengan sistem
				ini, kendaraan hanya bisa melaju dalam satu arah pada waktu yang telah ditentukan.
			</p>
			<p>
				Sistem ini biasanya berlaku pada <strong>akhir pekan, hari libur nasional</strong>, dan saat
				musim liburan panjang. Oleh karena itu, penting untuk mengetahui
				<strong>jadwal one way Puncak terbaru</strong> agar perjalanan Anda lebih lancar.
			</p>
		</div>
	</section>

	<!-- Jadwal hari ini -->
	<section class="mb-10">
		<h2 class="font-heading text-xl font-semibold text-brand md:text-2xl">
			Jadwal One Way Puncak Hari Ini
		</h2>
		<p class="mt-2 text-sm text-ink/60">
			Berikut adalah jadwal one way Puncak terbaru yang berlaku untuk hari ini.
		</p>

		<div class="mt-5 grid gap-4 sm:grid-cols-2">
			<!-- Arah Puncak naik -->
			<div class="rounded-xl bg-surface p-5 shadow-md border-l-4 border-brand">
				<div class="flex items-center gap-2 mb-3">
					<span class="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-white text-sm font-bold">↑</span>
					<h3 class="font-heading text-lg font-semibold text-brand">Arah Puncak (Naik)</h3>
				</div>
				<ul class="space-y-2 text-sm text-ink/80">
					<li class="flex items-start gap-2">
						<span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand text-xs font-bold">✓</span>
						<span><strong>Pukul 07:30 – 12:30 WIB</strong></span>
					</li>
					<li class="flex items-start gap-2">
						<span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand text-xs font-bold">💡</span>
						<span>
							Jika Anda menuju kawasan Puncak, pastikan untuk berangkat sebelum
							<strong>pukul 10:00 WIB</strong> agar tidak terjebak kemacetan.
						</span>
					</li>
				</ul>
			</div>

			<!-- Arah Jakarta turun -->
			<div class="rounded-xl bg-surface p-5 shadow-md border-l-4 border-accent">
				<div class="flex items-center gap-2 mb-3">
					<span class="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-ink text-sm font-bold">↓</span>
					<h3 class="font-heading text-lg font-semibold text-brand">Arah Jakarta (Turun)</h3>
				</div>
				<ul class="space-y-2 text-sm text-ink/80">
					<li class="flex items-start gap-2">
						<span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/20 text-ink text-xs font-bold">✓</span>
						<span><strong>Pukul 12:30 – 15:00 WIB</strong></span>
					</li>
					<li class="flex items-start gap-2">
						<span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/20 text-ink text-xs font-bold">💡</span>
						<span>
							Jika berencana kembali ke Jakarta, sistem <strong>one way turun</strong> diberlakukan
							mulai <strong>pukul 12:30 WIB</strong>. Rencanakan waktu perjalanan agar tidak terjebak
							macet.
						</span>
					</li>
				</ul>
			</div>
		</div>

		<!-- Catatan penting -->
		<div class="mt-4 rounded-xl border border-brand/20 bg-brand/5 p-4 text-sm text-ink/80">
			<p>
				📌 <strong>Catatan:</strong> Jadwal ini bisa berubah sewaktu-waktu tergantung kondisi lalu
				lintas dan keputusan pihak berwenang. Sebaiknya selalu cek
				<strong>update jadwal one way Puncak terkini</strong> di akun resmi
				<a
					href="https://www.instagram.com/satlantaspolresbogor.tmc"
					target="_blank"
					rel="noopener noreferrer"
					class="text-brand underline hover:text-brand-dark"
				>@satlantaspolresbogor.tmc</a
				> sebelum berangkat.
			</p>
		</div>
	</section>

	<!-- Kesimpulan -->
	<section class="mb-12 rounded-xl bg-muted p-6">
		<h2 class="font-heading text-xl font-semibold text-brand md:text-2xl">Kesimpulan</h2>
		<p class="mt-3 text-ink/80">
			Dengan mengetahui <strong>jadwal one way Puncak hari ini</strong>, Anda bisa merencanakan
			perjalanan dengan lebih baik. Pastikan untuk selalu mengecek informasi terbaru agar
			perjalanan menuju kawasan Puncak lebih lancar dan nyaman.
		</p>
	</section>

	<!-- CTA Eksplor -->
	<section class="mb-12 rounded-2xl bg-brand p-8 text-center text-white shadow-xl md:p-10">
		<h2 class="font-heading text-xl font-semibold md:text-2xl">Sudah Tahu Jadwalnya? Sekarang Rencanakan Liburannya</h2>
		<p class="mx-auto mt-3 max-w-xl text-white/80">
			Temukan tempat wisata seru, kuliner lezat, dan villa nyaman di kawasan Puncak. Semua ada di orangpuncak.com.
		</p>
		<div class="mt-6 flex flex-wrap justify-center gap-3">
			<a href="/wisata" class="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 font-semibold text-brand shadow transition hover:bg-cream">
				Jelajah Wisata
			</a>
			<a href="/kuliner" class="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 font-semibold text-brand shadow transition hover:bg-cream">
				Kuliner Puncak
			</a>
			<a href="/villa" class="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 font-semibold text-ink shadow transition hover:brightness-95">
				Cari Villa
			</a>
		</div>
	</section>

	<!-- Section: Wisata -->
	{#if data.latestWisata.length}
		<section class="mb-12">
			<div class="flex items-end justify-between">
				<h2 class="section-title">Wisata di Puncak</h2>
				<a href="/wisata" class="text-sm font-medium text-brand hover:underline">Lihat semua →</a>
			</div>
			<div class="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
				{#each data.latestWisata as place (place.id)}
					<Card {place} />
				{/each}
			</div>
		</section>
	{/if}

	<!-- Section: Villa -->
	{#if data.latestVilla.length}
		<section class="mb-12">
			<div class="flex items-end justify-between">
				<h2 class="section-title">Villa di Puncak</h2>
				<a href="/villa" class="text-sm font-medium text-brand hover:underline">Lihat semua →</a>
			</div>
			<div class="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
				{#each data.latestVilla as place (place.id)}
					<Card {place} />
				{/each}
			</div>
		</section>
	{/if}

	<!-- Section: Kuliner -->
	{#if data.latestKuliner.length}
		<section class="mb-12">
			<div class="flex items-end justify-between">
				<h2 class="section-title">Kuliner di Puncak</h2>
				<a href="/kuliner" class="text-sm font-medium text-brand hover:underline">Lihat semua →</a>
			</div>
			<div class="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
				{#each data.latestKuliner as place (place.id)}
					<Card {place} />
				{/each}
			</div>
		</section>
	{/if}

	<!-- Section: Artikel -->
	{#if data.articles.length}
		<section class="mb-12">
			<div class="flex items-end justify-between">
				<h2 class="section-title">Artikel Seputar Puncak</h2>
				<a href="/artikel" class="text-sm font-medium text-brand hover:underline">Semua artikel →</a>
			</div>
			<div class="mt-5 grid gap-4 grid-cols-2 md:grid-cols-3">
				{#each data.articles as article (article.id)}
					<a href={`/artikel/${article.slug}`} class="card group flex flex-col">
						<div class="aspect-[16/9] overflow-hidden">
							<img
								src={imgThumb(article.cover_image)}
								alt={article.title}
								loading="lazy"
								class="h-full w-full object-cover transition group-hover:scale-105"
							/>
						</div>
						<div class="flex flex-1 flex-col p-4">
							<span class="text-xs text-brand/80">{formatTanggal(article.published_at)}</span>
							<h3 class="mt-1 line-clamp-2 font-bold">{article.title}</h3>
							<p class="mt-2 line-clamp-2 text-sm text-ink/70 hidden lg:block">{article.excerpt}</p>
						</div>
					</a>
				{/each}
			</div>
		</section>
	{/if}
</div>

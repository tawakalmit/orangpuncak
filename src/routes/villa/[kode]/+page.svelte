<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import ArticleCard from '$lib/components/ArticleCard.svelte';
	import Carousel from '$lib/components/Carousel.svelte';
	import Gallery from '$lib/components/Gallery.svelte';
	import LazyMap from '$lib/components/LazyMap.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { SITE_URL } from '$lib/config';
	import type { VillaFacilities } from '$lib/types';
	import { formatRupiah, youtubeEmbed } from '$lib/utils/format';
	import { imgCover, imgThumb } from '$lib/utils/imagekit';
	import { villaWaMessage, waLink, type WaAction } from '$lib/utils/whatsapp';
	import { villaFaqJsonLd } from '$lib/utils/faqJsonLd';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const p = $derived(data.place);

	const actions = $derived<WaAction[]>(
		p.status === 'disewakan' ? ['Booking', 'Konsultasi', 'Survey'] : ['Konsultasi', 'Survey']
	);

	const facilityLabels: { key: keyof VillaFacilities; label: string }[] = [
		{ key: 'kolam_renang', label: 'Kolam Renang' },
		{ key: 'wifi', label: 'Wifi' },
		{ key: 'ac', label: 'AC' },
		{ key: 'billiard', label: 'Billiard' },
		{ key: 'karaoke', label: 'Karaoke' },
		{ key: 'barbeque', label: 'Barbeque' },
		{ key: 'smart_tv', label: 'Smart TV' },
		{ key: 'dapur', label: 'Dapur' },
		{ key: 'alat_dapur_dan_kitchen_set', label: 'Kitchen Set' },
		{ key: 'gas_dan_kompor', label: 'Gas & Kompor' },
		{ key: 'rice_cooker', label: 'Rice Cooker' },
		{ key: 'dispenser', label: 'Dispenser' },
		{ key: 'living_room', label: 'Ruang Keluarga' },
		{ key: 'balkon', label: 'Balkon' },
		{ key: 'teras', label: 'Teras' },
		{ key: 'halaman', label: 'Halaman' },
		{ key: 'car_port', label: 'Car Port' },
		{ key: 'gazebo', label: 'Gazebo' },
		{ key: 'tenis_meja', label: 'Tenis Meja' }
	];
	const activeFacilities = $derived(facilityLabels.filter((f) => p.facilities?.[f.key]));

	const embedVideo = $derived(youtubeEmbed(p.video));

	const bannerThumbnails = $derived((p.gallery ?? []).slice(0, 4));
	const hasBannerThumb = $derived(bannerThumbnails.length >= 2);
	const bannerKompleks = $derived((p as typeof p & { villa_complexes?: string[] }).villa_complexes);

	const langkahBooking = [
		{ n: 1, t: 'Pilih & Hubungi', d: 'Pilih villa favorit, klik tombol WhatsApp.' },
		{ n: 2, t: 'Konsultasi & Survey', d: 'Tanya ketersediaan, harga, atau jadwalkan survey.' },
		{ n: 3, t: 'Reservasi', d: 'Lakukan booking & pembayaran sesuai kesepakatan.' },
		{ n: 4, t: 'Nikmati Liburan', d: 'Datang dan nikmati pengalaman terbaik di Puncak.' }
	];

	const jsonLd = $derived([
		{
			'@context': 'https://schema.org',
			'@type': 'LodgingBusiness',
			name: p.name,
			description: p.description,
			image: p.cover_image,
			address: p.address,
			url: `${SITE_URL}/villa/${p.kode}`
		},
		...(villaFaqJsonLd(p) ? [villaFaqJsonLd(p)!] : [])
	]);

	function check(v?: boolean | null) {
		return v ? '✓' : '✗';
	}
</script>

<Seo title={`${p.name} (${p.kode})`} description={p.description ?? ''} image={p.cover_image} path={`/villa/${p.kode}`} {jsonLd} />

<!-- 1. Banner -->
<div class="w-full bg-ink/5">
	<div class="mx-auto max-w-content px-4 py-4 2xl:px-0 lg:w-full">
		<a
			href={p.gallery?.length ? '#galeri' : undefined}
			class="block"
			class:cursor-pointer={p.gallery?.length}
			class:cursor-default={!p.gallery?.length}
			aria-label={p.gallery?.length ? 'Lihat galeri foto' : undefined}
			onclick={(e) => {
				if (!p.gallery?.length) return;
				e.preventDefault();
				document.getElementById('galeri')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
			}}
		>
		<div
			class="overflow-hidden rounded-2xl shadow-lg"
			class:group={p.gallery?.length}
			class:grid={hasBannerThumb}
			class:md:grid-cols-[1fr_200px]={hasBannerThumb}
			style={hasBannerThumb ? 'gap: 3px;' : ''}
		>
			<!-- Foto utama -->
			<div class="relative aspect-[4/3] w-full overflow-hidden md:aspect-[16/9]">
				<img
					src={imgCover(p.cover_image)}
					alt={`Foto villa ${p.name}`}
					class="h-full w-full object-cover"
					fetchpriority="high"
					loading="eager"
				/>
				<!-- Gradient overlay + nama villa -->
				<div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-4 md:p-6">
					<h1 class="font-heading text-xl font-bold text-white drop-shadow md:text-3xl">{p.name}</h1>
					<p class="mt-1 text-sm text-white/80 drop-shadow">
						{p.kode}{bannerKompleks?.length ? ` · ${bannerKompleks.join(', ')}` : ''}{p.status ? ` · ` : ''}
						{#if p.status}<span class="capitalize">{p.status}</span>{/if}
					</p>
				</div>
				{#if p.is_promo}
					<span class="absolute left-3 top-3 rounded-xl bg-accent px-3 py-1.5 text-sm font-bold text-ink shadow">
						Promo
					</span>
				{/if}
			</div>

			<!-- Thumbnail strip (hanya tampil di md ke atas, kalau ada ≥2 foto) -->
			{#if hasBannerThumb}
				<div class="hidden md:flex md:flex-col" style="gap: 3px;">
					{#each bannerThumbnails as img, i}
						<div class="relative flex-1 overflow-hidden" style="min-height: 0;">
							<img
								src={imgThumb(img)}
								alt={`Foto villa ${p.name} ${i + 2}`}
								class="h-full w-full object-cover transition-opacity hover:opacity-90"
								loading="lazy"
							/>
							{#if i === bannerThumbnails.length - 1 && (p.gallery?.length ?? 0) > 4}
								<div class="absolute inset-0 flex items-center justify-center bg-black/50">
									<span class="text-sm font-semibold text-white">+{(p.gallery?.length ?? 0) - 4} foto</span>
								</div>
							{/if}
						</div>
					{/each}
				</div>
			{/if}
		</div>
		</a>
	</div>
</div>
<Breadcrumb
	items={[
		{ label: 'Beranda', href: '/' },
		{ label: 'Semua Villa', href: '/villa' },
		{ label: p.kode }
	]}
/>

<div class="mx-auto max-w-content px-4 py-8 2xl:px-0 lg:w-11/12">
	<!-- 3. Info & Aksi -->
	<section class="rounded-xl bg-surface p-5 shadow-md">
		<div class="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
			<div class="space-y-3">
				{#if (p as typeof p & { villa_complexes?: string[] }).villa_complexes?.length}
					<div>
						<span class="text-xs font-semibold uppercase tracking-wide text-ink/50">Komplek Villa</span>
						<div class="mt-1.5 flex flex-wrap gap-1.5">
							{#each (p as typeof p & { villa_complexes?: string[] }).villa_complexes ?? [] as komplek}
								<span class="rounded-full bg-brand/10 px-3 py-1 text-sm font-medium text-brand">{komplek}</span>
							{/each}
						</div>
					</div>
				{/if}
				<div class="flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink/70">
					{#if p.lokasi}<span><span class="font-medium text-ink">Lokasi:</span> {p.lokasi}</span>{/if}
					{#if p.status}<span><span class="font-medium text-ink">Status:</span> <span class="capitalize">{p.status}</span></span>{/if}
					{#if p.kode}<span><span class="font-medium text-ink">Kode:</span> {p.kode}</span>{/if}
				</div>
			</div>
			<div class="flex flex-wrap gap-2">
				{#each actions as action}
					<a
						href={waLink(villaWaMessage(action, p.kode, p.name), p.whatsapp ?? undefined)}
						target="_blank"
						rel="noopener"
						class="btn-action"
					>
						{action}
					</a>
				{/each}
				{#if p.gmaps_url}
					<a
						href={p.gmaps_url}
						target="_blank"
						rel="noopener noreferrer"
						class="flex items-center gap-1.5 rounded-xl border border-brand/30 px-4 py-2.5 text-sm font-semibold text-brand transition hover:bg-brand/5"
					>
						<svg class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
							<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
						</svg>
						Buka GMaps
					</a>
				{/if}
			</div>
		</div>
	</section>

	<!-- 4. Harga -->
	<section class="mt-8 rounded-xl bg-surface p-5 shadow-md">
		<h2 class="font-heading text-lg font-semibold text-brand">Harga</h2>
		{#if p.status === 'disewakan'}
			<div class="mt-3 grid gap-4 sm:grid-cols-2">
				<div>
					<div class="text-xs text-ink/60">Weekday / malam</div>
					{#if p.is_promo && p.promo_harga_sewa_weekday}
						<div class="text-sm text-ink/60 line-through">{formatRupiah(p.harga_sewa_weekday)}</div>
						<div class="text-xl font-bold text-brand">{formatRupiah(p.promo_harga_sewa_weekday)}</div>
					{:else}
						<div class="text-xl font-bold text-brand">{formatRupiah(p.harga_sewa_weekday)}</div>
					{/if}
				</div>
				<div>
					<div class="text-xs text-ink/60">Weekend / malam</div>
					{#if p.is_promo && p.promo_harga_sewa_weekend}
						<div class="text-sm text-ink/60 line-through">{formatRupiah(p.harga_sewa_weekend)}</div>
						<div class="text-xl font-bold text-brand">{formatRupiah(p.promo_harga_sewa_weekend)}</div>
					{:else}
						<div class="text-xl font-bold text-brand">{formatRupiah(p.harga_sewa_weekend)}</div>
					{/if}
				</div>
			</div>
		{:else}
			<div class="mt-3">
				<div class="text-xs text-ink/60">Harga Jual</div>
				{#if p.is_promo && p.harga_promo}
					<div class="text-sm text-ink/60 line-through">{formatRupiah(p.harga_jual)}</div>
					<div class="text-2xl font-bold text-brand">{formatRupiah(p.harga_promo)}</div>
				{:else}
					<div class="text-2xl font-bold text-brand">{formatRupiah(p.harga_jual)}</div>
				{/if}
			</div>
		{/if}
	</section>

	<!-- 4. Fasilitas Utama -->
	{#if activeFacilities.length}
		<section class="mt-8">
			<h2 class="section-title">Fasilitas Utama</h2>
			<div class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
				{#each activeFacilities as f}
					<div class="flex items-center gap-2 rounded-xl bg-surface p-3 shadow-sm">
						<span class="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-sm text-white">✓</span>
						<span class="text-sm font-medium">{f.label}</span>
					</div>
				{/each}
			</div>
		</section>
	{/if}

	<!-- 5. Detail Villa -->
	<section class="mt-8">
		<h2 class="section-title">Detail Villa</h2>
		<dl class="mt-4 grid gap-x-6 gap-y-3 rounded-xl bg-surface p-5 shadow-md sm:grid-cols-2">
			<div class="flex justify-between border-b border-ink/10 py-1"><dt class="text-ink/60">Kode</dt><dd class="font-medium">{p.kode}</dd></div>
			<div class="flex justify-between border-b border-ink/10 py-1"><dt class="text-ink/60">Status</dt><dd class="font-medium capitalize">{p.status}</dd></div>
			<div class="flex justify-between border-b border-ink/10 py-1"><dt class="text-ink/60">Lokasi</dt><dd class="font-medium">{p.lokasi}</dd></div>
			<div class="flex justify-between border-b border-ink/10 py-1"><dt class="text-ink/60">Kamar Tidur</dt><dd class="font-medium">{p.jumlah_kamar_tidur}</dd></div>
			<div class="flex justify-between border-b border-ink/10 py-1"><dt class="text-ink/60">Kamar Mandi</dt><dd class="font-medium">{p.jumlah_kamar_mandi}</dd></div>
			<div class="flex justify-between border-b border-ink/10 py-1"><dt class="text-ink/60">Jumlah Lantai</dt><dd class="font-medium">{p.jumlah_lantai}</dd></div>
			<div class="flex justify-between border-b border-ink/10 py-1"><dt class="text-ink/60">Kapasitas Maksimal</dt><dd class="font-medium">{p.kapasitas} orang</dd></div>
			{#if p.status === 'dijual'}
				<div class="flex justify-between border-b border-ink/10 py-1"><dt class="text-ink/60">Luas Tanah</dt><dd class="font-medium">{p.luas_tanah} m²</dd></div>
				<div class="flex justify-between border-b border-ink/10 py-1"><dt class="text-ink/60">Luas Bangunan</dt><dd class="font-medium">{p.luas_bangunan} m²</dd></div>
				<div class="flex justify-between border-b border-ink/10 py-1"><dt class="text-ink/60">Kamar ART</dt><dd class="font-medium">{p.kamar_art}</dd></div>
				<div class="flex justify-between border-b border-ink/10 py-1"><dt class="text-ink/60">Sertifikat SHM</dt><dd class="font-medium">{check(p.shm)}</dd></div>
			{/if}
		</dl>
	</section>

	{#if p.description || p.content}
		<section class="mt-8">
			<h2 class="section-title">Deskripsi</h2>
			<div class="prose mt-3 max-w-none text-ink/80 konten-body">
				{#if p.content}{@html p.content}{:else}<p>{p.description}</p>{/if}
			</div>
		</section>
	{/if}

	<!-- 6. Gallery -->
	{#if p.gallery && p.gallery.length}
		<section id="galeri" class="mt-8">
			<h2 class="section-title">Galeri Villa</h2>
			<div class="mt-4"><Gallery images={p.gallery} alt={`Foto villa ${p.name}`} /></div>
		</section>
	{/if}

	<!-- Cara Booking -->
	<section class="mt-12 rounded-2xl bg-muted px-6 py-10">
		<h2 class="section-title text-center">Cara Booking / Reservasi</h2>
		<div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{#each langkahBooking as step}
				<div class="rounded-xl bg-surface p-5 shadow-md">
					<div class="flex h-10 w-10 items-center justify-center rounded-full bg-brand font-heading font-bold text-white">
						{step.n}
					</div>
					<h3 class="mt-3 font-bold">{step.t}</h3>
					<p class="mt-1 text-sm text-ink/70">{step.d}</p>
				</div>
			{/each}
		</div>
		<div class="mt-8 text-center">
			<a href="/cara-booking" class="btn-primary">Pelajari Cara Booking</a>
		</div>
	</section>

	<!-- 7. Video -->
	{#if embedVideo}
		<section class="mt-8">
			<h2 class="section-title">Video</h2>
			<div class="mt-4 aspect-video overflow-hidden rounded-xl shadow-md">
				<iframe
					title={`Video villa ${p.name}`}
					src={embedVideo}
					class="h-full w-full border-0"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowfullscreen
				></iframe>
			</div>
		</section>
	{/if}

	<!-- 8. Lokasi -->
	<section id="lokasi" class="mt-8">
		<h2 class="section-title">Lokasi (klik untuk lihat)</h2>
		<div class="mt-4 overflow-hidden rounded-xl shadow-md">
			<LazyMap embedSrc={p.gmaps_embed} mapsUrl={p.gmaps_url} title={`Peta lokasi villa ${p.name}`} />
		</div>
	</section>

	<!-- 9. Villa Lainnya -->
	{#if data.nearbyVilla.length}
		<section class="mt-12">
			<div class="flex items-center justify-between">
				<h2 class="section-title">Villa Terdekat</h2>
				<a href="/villa" class="text-sm font-medium text-brand hover:underline">Lihat semua →</a>
			</div>
			<div class="mt-4"><Carousel places={data.nearbyVilla} /></div>
		</section>
	{/if}

	{#if data.nearbyWisata.length}
		<section class="mt-12">
			<div class="flex items-center justify-between">
				<h2 class="section-title">Wisata Terdekat</h2>
				<a href="/wisata" class="text-sm font-medium text-brand hover:underline">Lihat semua →</a>
			</div>
			<div class="mt-4"><Carousel places={data.nearbyWisata} /></div>
		</section>
	{/if}

	{#if data.nearbyKuliner.length}
		<section class="mt-12">
			<div class="flex items-center justify-between">
				<h2 class="section-title">Kuliner Terdekat</h2>
				<a href="/kuliner" class="text-sm font-medium text-brand hover:underline">Lihat semua →</a>
			</div>
			<div class="mt-4"><Carousel places={data.nearbyKuliner} /></div>
		</section>
	{/if}

	{#if data.related.length}
		<section class="mt-12">
			<div class="flex items-center justify-between">
				<h2 class="section-title">Villa Lainnya</h2>
				<a href="/villa" class="text-sm font-medium text-brand hover:underline">Lihat semua →</a>
			</div>
			<div class="mt-4"><Carousel places={data.related} /></div>
		</section>
	{/if}

	{#if data.articles.length}
		<section class="mt-12">
			<h2 class="section-title">Artikel Terkait</h2>
			<div class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each data.articles as article (article.id)}
					<ArticleCard {article} />
				{/each}
			</div>
			<div class="mt-4 text-right">
				<a href="/artikel" class="text-sm font-medium text-brand hover:underline">Lihat semua artikel →</a>
			</div>
		</section>
	{/if}
</div>

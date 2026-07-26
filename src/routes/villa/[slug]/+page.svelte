<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import ArticleCard from '$lib/components/ArticleCard.svelte';
	import Carousel from '$lib/components/Carousel.svelte';
	import LazyMap from '$lib/components/LazyMap.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { SITE_URL } from '$lib/config';
	import type { VillaFacilities } from '$lib/types';
	import { formatRupiah, youtubeEmbed } from '$lib/utils/format';
	import { imgHero, imgThumb } from '$lib/utils/imagekit';
	import { villaWaMessage, waLink, type WaAction } from '$lib/utils/whatsapp';
	import { villaFaqJsonLd } from '$lib/utils/faqJsonLd';
	import { untrack } from 'svelte';
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

	// Hero: foto utama interaktif dengan thumbnail strip
	const allPhotos = $derived([p.cover_image, ...(p.gallery ?? [])].filter(Boolean) as string[]);
	// untrack agar tidak trigger reactive warning — nilai init stabil dari SSR
	let activePhoto = $state(untrack(() => data.place.cover_image ?? ''));
	const bannerKompleks = $derived((p as typeof p & { villa_complexes?: string[] }).villa_complexes);

	// Fasilitas highlight untuk info panel (prioritas tampil di panel)
	const highlightFacilityKeys: (keyof VillaFacilities)[] = [
		'kolam_renang', 'wifi', 'ac', 'billiard', 'karaoke', 'barbeque', 'smart_tv', 'gazebo'
	];
	const heroFacilities = $derived(
		highlightFacilityKeys
			.filter((k) => p.facilities?.[k])
			.map((k) => facilityLabels.find((f) => f.key === k)!)
			.filter(Boolean)
			.slice(0, 6)
	);

	// Harga ringkas untuk panel (unused — harga ditampilkan langsung di template)
	// const hargaDisplay = ...

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
			url: `${SITE_URL}/villa/${p.slug}`
		},
		...(villaFaqJsonLd(p) ? [villaFaqJsonLd(p)!] : [])
	]);

	function check(v?: boolean | null) {
		return v ? '✓' : '✗';
	}
</script>

<Seo title={`${p.name} (${p.kode})`} description={p.description ?? ''} image={p.cover_image} path={`/villa/${p.slug}`} {jsonLd} />

<svelte:head>
	{#if data.place.cover_image}
		<link rel="preload" as="image" href={imgHero(data.place.cover_image)} fetchpriority="high" />
	{/if}
</svelte:head>

<!-- HERO: Breadcrumb + Mosaic Grid + Info Panel -->
<div class="mx-auto max-w-content 2xl:px-0 lg:w-full">
	<Breadcrumb
		items={[
			{ label: 'Beranda', href: '/' },
			{ label: 'Semua Villa', href: '/villa' },
			{ label: p.name }
		]}
	/>
</div>

<div class="mx-auto max-w-content px-4 pb-0 pt-3 2xl:px-0 lg:w-full">
	<!-- Layout: grid foto kiri + panel info kanan di lg ke atas -->
	<div class="flex flex-col gap-6 lg:flex-row lg:items-stretch lg:h-[70dvh]">

		<!-- KIRI: Foto utama + thumbnail strip -->
		<div class="lg:flex-1 lg:self-stretch flex flex-col gap-2">
			<!-- Foto utama -->
			<div class="relative min-h-[240px] flex-1 overflow-hidden rounded-2xl shadow-lg">
				<img
					src={imgHero(activePhoto)}
					alt={`Foto villa ${p.name}`}
					class="h-full w-full object-cover"
					fetchpriority="high"
					loading="eager"
				/>
				{#if p.is_promo}
					<span class="absolute left-3 top-3 rounded-xl bg-accent px-3 py-1.5 text-sm font-bold text-ink shadow">
						Promo
					</span>
				{/if}
			</div>

			<!-- Thumbnail strip (hanya kalau ada lebih dari 1 foto) -->
			{#if allPhotos.length > 1}
				<div class="flex gap-2 overflow-x-auto pb-1" style="scrollbar-width: thin;">
					{#each allPhotos as img}
						<button
							type="button"
							onclick={() => activePhoto = img}
							class="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl transition
								{activePhoto === img ? 'ring-2 ring-brand ring-offset-1' : 'opacity-70 hover:opacity-100'}"
							aria-label="Lihat foto ini"
						>
							<img
								src={imgThumb(img)}
								alt={`Foto villa ${p.name}`}
								class="h-full w-full object-cover"
								loading="lazy"
							/>
						</button>
					{/each}
				</div>
			{/if}
		</div>

		<!-- KANAN: Info panel -->
		<div class="lg:w-80 xl:w-96">
			<div class="h-full rounded-2xl border border-ink/10 bg-surface p-5 shadow-xl">

				<!-- Badge & judul -->
				<div class="flex flex-wrap items-start gap-2">
					{#if p.status}
						<span class="rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize
							{p.status === 'disewakan' ? 'bg-brand/10 text-brand' : 'bg-amber-100 text-amber-700'}">
							{p.status}
						</span>
					{/if}
					{#if p.is_promo}
						<span class="rounded-full bg-accent px-2.5 py-0.5 text-xs font-bold text-ink">Promo</span>
					{/if}
				</div>
				<h1 class="mt-2 font-heading text-xl font-bold leading-snug text-ink">{p.name}</h1>

				<!-- Meta info -->
				<div class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink/60">
					{#if p.lokasi}
						<span class="flex items-center gap-1">
							<svg class="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
								<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
							</svg>
							{p.lokasi}
						</span>
					{/if}
					{#if p.kode}<span class="text-ink/40">·</span><span>{p.kode}</span>{/if}
				</div>

				<!-- Spesifikasi singkat -->
				{#if p.jumlah_kamar_tidur || p.kapasitas || p.jumlah_lantai}
					<div class="mt-3 flex flex-wrap gap-3 border-t border-ink/10 pt-3">
						{#if p.jumlah_kamar_tidur}
							<div class="flex items-center gap-1.5 text-sm">
								<svg class="h-4 w-4 text-brand/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
									<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
								</svg>
								<span><strong>{p.jumlah_kamar_tidur}</strong> kamar tidur</span>
							</div>
						{/if}
						{#if p.kapasitas}
							<div class="flex items-center gap-1.5 text-sm">
								<svg class="h-4 w-4 text-brand/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
									<path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
								</svg>
								<span>maks. <strong>{p.kapasitas}</strong> orang</span>
							</div>
						{/if}
					</div>
				{/if}

				<!-- Fasilitas highlight -->
				{#if heroFacilities.length}
					<div class="mt-3 flex flex-wrap gap-1.5">
						{#each heroFacilities as f}
							<span class="rounded-full bg-brand/8 border border-brand/15 px-2.5 py-0.5 text-xs font-medium text-brand">
								{f.label}
							</span>
						{/each}
					</div>
				{/if}

				<!-- Harga -->
				{#if p.status === 'disewakan'}
					<div class="mt-4 border-t border-ink/10 pt-4">
						<div class="text-xs text-ink/50">Mulai dari</div>
						{#if p.is_promo && p.promo_harga_sewa_weekday}
							<div class="text-sm text-ink/40 line-through">{formatRupiah(p.harga_sewa_weekday)}</div>
							<div class="text-2xl font-bold text-brand">{formatRupiah(p.promo_harga_sewa_weekday)}<span class="text-sm font-normal text-ink/60"> / malam</span></div>
						{:else if p.harga_sewa_weekday}
							<div class="text-2xl font-bold text-brand">{formatRupiah(p.harga_sewa_weekday)}<span class="text-sm font-normal text-ink/60"> / malam</span></div>
						{/if}
					</div>
				{:else if p.status === 'dijual'}
					<div class="mt-4 border-t border-ink/10 pt-4">
						<div class="text-xs text-ink/50">Harga Jual</div>
						{#if p.is_promo && p.harga_promo}
							<div class="text-sm text-ink/40 line-through">{formatRupiah(p.harga_jual)}</div>
							<div class="text-2xl font-bold text-brand">{formatRupiah(p.harga_promo)}</div>
						{:else if p.harga_jual}
							<div class="text-2xl font-bold text-brand">{formatRupiah(p.harga_jual)}</div>
						{/if}
					</div>
				{/if}

				<!-- CTA buttons -->
				<div class="mt-4 flex flex-col gap-2">
					{#each actions as action}
						<a
							href={waLink(villaWaMessage(action, p.kode, p.name), p.whatsapp ?? undefined)}
							target="_blank"
							rel="noopener"
							class={action === actions[0]
								? 'flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand/90'
								: 'flex items-center justify-center gap-2 rounded-xl border border-brand/30 px-4 py-2.5 text-sm font-semibold text-brand transition hover:bg-brand/5'}
						>
							<svg class="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
								<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
								<path d="M12 0C5.373 0 0 5.373 0 12c0 2.136.561 4.14 1.535 5.873L0 24l6.322-1.507A11.952 11.952 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.797 9.797 0 0 1-5.028-1.383l-.361-.214-3.741.893.945-3.627-.236-.374A9.793 9.793 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182c5.43 0 9.818 4.388 9.818 9.818 0 5.43-4.388 9.818-9.818 9.818z"/>
							</svg>
							{action}
						</a>
					{/each}
					{#if p.gmaps_url}
						<a
							href={p.gmaps_url}
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center justify-center gap-1.5 rounded-xl border border-ink/15 px-4 py-2.5 text-sm font-medium text-ink/70 transition hover:bg-ink/5"
						>
							<svg class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
								<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
							</svg>
							Lihat di Google Maps
						</a>
					{/if}
				</div>

				<!-- Komplek villa (bila ada) -->
				{#if bannerKompleks?.length}
					<div class="mt-3 border-t border-ink/10 pt-3">
						<span class="text-xs text-ink/50">Komplek Villa</span>
						<div class="mt-1 flex flex-wrap gap-1">
							{#each bannerKompleks as k}
								<span class="rounded-full bg-ink/5 px-2.5 py-0.5 text-xs text-ink/70">{k}</span>
							{/each}
						</div>
					</div>
				{/if}

			</div>
		</div>
	</div>
</div>

<!-- Sticky action bar — muncul di mobile saat scroll -->
<div class="fixed bottom-0 left-0 right-0 z-40 border-t border-ink/10 bg-surface/95 px-4 py-3 backdrop-blur-sm lg:hidden">
	<div class="flex items-center gap-2">
		<div class="min-w-0 flex-1">
			<div class="truncate text-sm font-semibold">{p.name}</div>
			{#if p.status === 'disewakan' && p.harga_sewa_weekday}
				<div class="text-xs text-brand font-medium">
					{formatRupiah(p.is_promo && p.promo_harga_sewa_weekday ? p.promo_harga_sewa_weekday : p.harga_sewa_weekday)} / malam
				</div>
			{:else if p.status === 'dijual' && p.harga_jual}
				<div class="text-xs text-brand font-medium">{formatRupiah(p.is_promo && p.harga_promo ? p.harga_promo : p.harga_jual)}</div>
			{/if}
		</div>
		<a
			href={waLink(villaWaMessage(actions[0], p.kode, p.name), p.whatsapp ?? undefined)}
			target="_blank"
			rel="noopener"
			class="shrink-0 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-brand/90"
		>
			{actions[0]} via WA
		</a>
	</div>
</div>


<div class="mx-auto max-w-content px-4 py-8 pb-20 2xl:px-0 lg:w-11/12 lg:pb-8">
	<!-- 4. Harga -->
	<section class="rounded-xl bg-surface p-5 shadow-md">
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

	<!-- Cara Booking -->	<section class="mt-12 rounded-2xl bg-muted px-6 py-10">
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

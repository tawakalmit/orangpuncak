<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import Carousel from '$lib/components/Carousel.svelte';
	import Gallery from '$lib/components/Gallery.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { SITE_URL } from '$lib/config';
	import type { VillaFacilities } from '$lib/types';
	import { formatRupiah, mapsEmbed, youtubeEmbed } from '$lib/utils/format';
	import { imgCover } from '$lib/utils/cloudinary';
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
<div class="relative aspect-square w-full overflow-hidden md:aspect-[10/3]">
	<img src={imgCover(p.cover_image)} alt={`Foto villa ${p.name}`} class="h-full w-full object-cover" />
	{#if p.is_promo}
		<span class="absolute left-4 top-4 rounded-xl bg-accent px-3 py-1.5 text-sm font-bold text-ink shadow">
			Promo
		</span>
	{/if}
	<div class="absolute inset-0 flex flex-col justify-end gap-3 bg-gradient-to-t from-black/60 to-transparent p-4 md:p-10">
		<div class="w-fit rounded-xl bg-white/95 px-4 py-3 shadow-xl">
			<h1 class="font-heading text-xl font-bold text-brand md:text-3xl">{p.name}</h1>
			<p class="text-sm text-ink/70">
				{p.kode} · {p.lokasi} · <span class="capitalize">{p.status}</span>
			</p>
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
		</div>
	</div>
</div>

<!-- 2. Breadcrumb -->
<Breadcrumb
	items={[
		{ label: 'Beranda', href: '/' },
		{ label: 'Semua Villa', href: '/villa' },
		{ label: p.kode }
	]}
/>

<div class="mx-auto max-w-content px-4 py-8 2xl:px-0 lg:w-11/12">
	<!-- 3. Harga -->
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

	<!-- 6. Gallery -->
	{#if p.gallery && p.gallery.length}
		<section class="mt-8">
			<h2 class="section-title">Galeri Villa</h2>
			<div class="mt-4"><Gallery images={p.gallery} alt={`Foto villa ${p.name}`} /></div>
		</section>
	{/if}

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
	<section class="mt-8">
		<h2 class="section-title">Lokasi</h2>
		<div class="mt-4 overflow-hidden rounded-xl shadow-md">
			<iframe
				title={`Peta lokasi villa ${p.name}`}
				src={mapsEmbed({ lat: p.lat, lng: p.lng, query: p.address })}
				class="h-72 w-full border-0 md:h-96"
				loading="lazy"
				referrerpolicy="no-referrer-when-downgrade"
			></iframe>
		</div>
	</section>

	<!-- 9. Villa Lainnya -->
	{#if data.nearbyVilla.length}
		<section class="mt-12">
			<h2 class="section-title">Villa Terdekat</h2>
			<div class="mt-4"><Carousel places={data.nearbyVilla} /></div>
		</section>
	{/if}

	{#if data.nearbyWisata.length}
		<section class="mt-12">
			<h2 class="section-title">Wisata Terdekat</h2>
			<div class="mt-4"><Carousel places={data.nearbyWisata} /></div>
		</section>
	{/if}

	{#if data.nearbyKuliner.length}
		<section class="mt-12">
			<h2 class="section-title">Kuliner Terdekat</h2>
			<div class="mt-4"><Carousel places={data.nearbyKuliner} /></div>
		</section>
	{/if}

	{#if data.related.length}
		<section class="mt-12">
			<h2 class="section-title">Villa Lainnya</h2>
			<div class="mt-4"><Carousel places={data.related} /></div>
		</section>
	{/if}
</div>

<script lang="ts">
	import type { Place } from '$lib/types';
	import { formatRupiah } from '$lib/utils/format';
	import { imgThumb } from '$lib/utils/cloudinary';

	interface Props {
		place: Place;
	}
	let { place }: Props = $props();

	const href = $derived(
		place.type === 'villa' ? `/villa/${place.kode}` : `/${place.type}/${place.slug}`
	);

	const statusLabel = $derived(
		place.status === 'dijual' ? 'Dijual' : place.status === 'disewakan' ? 'Disewakan' : null
	);

	function stripHtml(html: string | null | undefined): string {
		if (!html) return '';
		return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
	}

	function previewHarga(html: string | null | undefined): string {
		if (!html) return 'Lihat Harga';
		const segments = html
			.replace(/<\/(p|li|td|th|div|h[1-6])>/gi, '\n')
			.replace(/<[^>]*>/g, '')
			.split('\n')
			.map((s) => s.replace(/&[a-z]+;/gi, ' ').replace(/\s+/g, ' ').trim())
			.filter(Boolean);

		// hanya cari segmen yang jelas mengandung info harga
		const hargaPattern = /rp[\s.]?\d|gratis|free/i;
		const found = segments.find((s) => hargaPattern.test(s) && s.length <= 60);
		return found ?? 'Lihat Harga';
	}
</script>

<a {href} class="card group flex flex-col" aria-label={place.name}>
	<div class="relative aspect-[4/3] overflow-hidden">
		<img
			src={imgThumb(place.cover_image)}
			alt={`Foto ${place.name} di ${place.lokasi ?? 'Puncak'}`}
			loading="lazy"
			class="h-full w-full object-cover transition duration-300 group-hover:scale-105"
		/>
		{#if place.is_promo}
			<span
				class="absolute left-2 top-2 rounded-xl bg-accent px-2.5 py-1 text-xs font-bold text-ink shadow"
			>
				Promo
			</span>
		{/if}
		{#if statusLabel}
			<span
				class="absolute bottom-2 right-2 rounded-xl bg-brand/90 px-2.5 py-1 text-xs font-semibold text-white"
			>
				{statusLabel}
			</span>
		{/if}
	</div>

	<div class="flex flex-1 flex-col p-3 md:p-4">
		{#if place.lokasi}
			<span class="text-xs text-brand/80">{place.lokasi}{place.type === 'villa' && place.kode ? ` · ${place.kode}` : ''}</span>
		{/if}
		<h3 class="mt-1 line-clamp-2 font-bold leading-snug">{place.name}</h3>

		{#if place.type === 'villa'}
			<div class="mt-auto pt-3 text-sm">
				{#if place.status === 'disewakan'}
					{#if place.is_promo && place.promo_harga_sewa_weekday}
						<div class="text-xs text-ink/60 line-through">
							{formatRupiah(place.harga_sewa_weekday)} / malam
						</div>
						<div class="font-bold text-brand">
							{formatRupiah(place.promo_harga_sewa_weekday)}
							<span class="text-xs font-normal text-ink/70">/ malam (weekday)</span>
						</div>
						<div class="text-xs text-ink/70">
							Weekend: {formatRupiah(place.promo_harga_sewa_weekend)}
						</div>
					{:else}
						<div class="font-bold text-brand">
							{formatRupiah(place.harga_sewa_weekday)}
							<span class="text-xs font-normal text-ink/70">/ malam (weekday)</span>
						</div>
						<div class="text-xs text-ink/70">
							Weekend: {formatRupiah(place.harga_sewa_weekend)}
						</div>
					{/if}
				{:else if place.status === 'dijual'}
					{#if place.is_promo && place.harga_promo}
						<div class="text-xs text-ink/60 line-through">{formatRupiah(place.harga_jual)}</div>
						<div class="font-bold text-brand">{formatRupiah(place.harga_promo)}</div>
					{:else}
						<div class="font-bold text-brand">{formatRupiah(place.harga_jual)}</div>
					{/if}
				{/if}
			</div>
		{:else if place.type === 'wisata'}
			<div class="mt-auto pt-3 text-sm text-ink/70">
				{#if place.harga_tiket}<div class="line-clamp-1">HTM: <span class="font-semibold text-brand">{previewHarga(place.harga_tiket)}</span></div>{/if}
				{#if place.jam_buka}<div class="line-clamp-1 text-xs">{stripHtml(place.jam_buka)}</div>{/if}
			</div>
		{:else}
			<div class="mt-auto pt-3 text-sm text-ink/70">
				{#if place.harga_range}<div class="font-semibold text-brand">{place.harga_range}</div>{/if}
				{#if place.jam_buka}<div class="line-clamp-1 text-xs">{stripHtml(place.jam_buka)}</div>{/if}
			</div>
		{/if}
	</div>
</a>

<script lang="ts">
	import { mapsEmbed } from '$lib/utils/format';

	interface Props {
		lat?: number | null;
		lng?: number | null;
		query?: string | null;
		title?: string;
		class?: string;
	}

	let {
		lat,
		lng,
		query,
		title = 'Peta lokasi',
		class: cls = 'h-72 w-full border-0 md:h-96'
	}: Props = $props();

	let loaded = $state(false);

	const src = $derived(mapsEmbed({ lat, lng, query }));
	const mapsUrl = $derived(
		lat != null && lng != null
			? `https://www.google.com/maps?q=${lat},${lng}`
			: `https://www.google.com/maps/search/${encodeURIComponent(query ?? 'Puncak, Bogor')}`
	);
</script>

<div class="relative overflow-hidden rounded-xl" style="aspect-ratio: unset;">
	{#if loaded}
		<iframe
			{title}
			{src}
			class={cls}
			referrerpolicy="no-referrer-when-downgrade"
		></iframe>
	{:else}
		<!-- Placeholder — tidak ada request ke Google Maps sama sekali -->
		<div class="flex {cls} w-full flex-col items-center justify-center gap-3 bg-ink/5">
			<svg class="h-10 w-10 text-ink/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
				<path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
				<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
			</svg>
			<p class="text-sm text-ink/50">Peta belum dimuat</p>
			<div class="flex gap-2">
				<button
					type="button"
					onclick={() => (loaded = true)}
					class="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white shadow hover:bg-brand/90 transition"
				>
					Tampilkan Peta
				</button>
				<a
					href={mapsUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="rounded-full border border-ink/20 px-5 py-2 text-sm font-medium text-ink/70 hover:bg-ink/5 transition"
				>
					Buka Google Maps
				</a>
			</div>
		</div>
	{/if}
</div>

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

	let container = $state<HTMLDivElement | null>(null);
	let loaded = $state(false);

	const src = $derived(mapsEmbed({ lat, lng, query }));

	$effect(() => {
		if (!container) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					loaded = true;
					observer.disconnect();
				}
			},
			{ rootMargin: '200px' } // mulai load 200px sebelum masuk viewport
		);

		observer.observe(container);
		return () => observer.disconnect();
	});
</script>

<div bind:this={container} class={cls} style="background:#e5e7eb;">
	{#if loaded}
		<iframe
			{title}
			{src}
			class={cls}
			loading="lazy"
			referrerpolicy="no-referrer-when-downgrade"
		></iframe>
	{:else}
		<!-- Placeholder sebelum di-scroll ke area peta -->
		<div class="flex h-full w-full items-center justify-center text-sm text-ink/50 bg-ink/5">
			<div class="text-center">
				<svg class="mx-auto mb-2 h-8 w-8 text-ink/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
					<path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
					<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
				</svg>
				<span>Memuat peta...</span>
			</div>
		</div>
	{/if}
</div>

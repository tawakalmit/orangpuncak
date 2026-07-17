<script lang="ts">
	import { onMount } from 'svelte';
	import type { Place } from '$lib/types';
	import Card from './Card.svelte';

	interface Props {
		places: Place[];
	}
	let { places }: Props = $props();

	let el: HTMLDivElement;
	let prevEl: HTMLButtonElement;
	let nextEl: HTMLButtonElement;

	onMount(() => {
		let swiper: { destroy: () => void } | undefined;
		(async () => {
			const { default: Swiper } = await import('swiper');
			const { Navigation } = await import('swiper/modules');
			swiper = new Swiper(el, {
				modules: [Navigation],
				spaceBetween: 16,
				slidesPerView: 1.2,
				navigation: { prevEl, nextEl },
				breakpoints: {
					640: { slidesPerView: 2.2 },
					768: { slidesPerView: 3 },
					1024: { slidesPerView: 4 }
				}
			});
		})();
		return () => swiper?.destroy();
	});
</script>

<div class="relative">
	<div bind:this={el} class="swiper px-1 pb-2">
		<div class="swiper-wrapper">
			{#each places as place}
				<div class="swiper-slide h-auto self-stretch">
					<Card {place} />
				</div>
			{/each}
		</div>
	</div>

	<!-- Tombol navigasi di luar swiper container agar tidak ter-clip -->
	<button
		bind:this={prevEl}
		type="button"
		aria-label="Sebelumnya"
		class="absolute left-0 top-1/2 z-10 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-black/10 transition hover:bg-cream disabled:opacity-0"
	>
		<svg class="h-5 w-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
			<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
		</svg>
	</button>
	<button
		bind:this={nextEl}
		type="button"
		aria-label="Berikutnya"
		class="absolute right-0 top-1/2 z-10 flex h-9 w-9 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-black/10 transition hover:bg-cream disabled:opacity-0"
	>
		<svg class="h-5 w-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
			<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
		</svg>
	</button>
</div>

<style>
	:global(.swiper-slide) {
		height: auto;
	}
</style>

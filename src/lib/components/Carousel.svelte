<script lang="ts">
	import { onMount } from 'svelte';
	import type { Place } from '$lib/types';
	import Card from './Card.svelte';

	interface Props {
		places: Place[];
	}
	let { places }: Props = $props();

	let el: HTMLDivElement;

	onMount(() => {
		let swiper: { destroy: () => void } | undefined;
		(async () => {
			const { default: Swiper } = await import('swiper');
			const { Navigation } = await import('swiper/modules');
			swiper = new Swiper(el, {
				modules: [Navigation],
				spaceBetween: 16,
				slidesPerView: 1.2,
				navigation: true,
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

<div bind:this={el} class="swiper px-1 pb-2">
	<div class="swiper-wrapper">
		{#each places as place}
			<div class="swiper-slide h-auto self-stretch">
				<Card {place} />
			</div>
		{/each}
	</div>
</div>

<style>
	:global(.swiper-slide) {
		height: auto;
	}
</style>

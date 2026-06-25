<script lang="ts">
	import { onMount } from 'svelte';
	import { imgCover } from '$lib/utils/cloudinary';

	interface Slide {
		image: string;
		title?: string;
		subtitle?: string;
		href?: string;
	}
	interface Props {
		slides: Slide[];
	}
	let { slides }: Props = $props();

	let el: HTMLDivElement;

	onMount(() => {
		let swiper: { destroy: () => void } | undefined;
		(async () => {
			const { default: Swiper } = await import('swiper');
			const { Autoplay, Pagination } = await import('swiper/modules');
			swiper = new Swiper(el, {
				modules: [Autoplay, Pagination],
				loop: slides.length > 1,
				autoplay: { delay: 8000, disableOnInteraction: false },
				pagination: { clickable: true },
				spaceBetween: 0
			});
		})();
		return () => swiper?.destroy();
	});
</script>

<div class="mx-auto max-w-banner px-0 w-11/12">
	<div bind:this={el} class="swiper overflow-hidden md:rounded-2xl">
		<div class="swiper-wrapper">
			{#each slides as slide}
				<div class="swiper-slide">
					<a href={slide.href ?? '#'} class="relative block aspect-[16/9] sm:aspect-[16/7] md:aspect-[16/5]">
						<img
							src={imgCover(slide.image)}
							alt={slide.title ?? 'Banner orangpuncak.com'}
							loading="lazy"
							class="h-full w-full object-cover"
						/>
						{#if slide.title}
							<div
								class="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 to-transparent p-5 text-white md:p-10"
							>
								<h2 class="font-heading text-xl font-bold drop-shadow md:text-4xl">{slide.title}</h2>
								{#if slide.subtitle}
									<p class="mt-1 max-w-xl text-sm text-white/90 md:text-lg">{slide.subtitle}</p>
								{/if}
							</div>
						{/if}
					</a>
				</div>
			{/each}
		</div>
		<div class="swiper-pagination"></div>
	</div>
</div>

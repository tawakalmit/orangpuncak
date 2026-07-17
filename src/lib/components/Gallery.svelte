<script lang="ts">
	import { onMount } from 'svelte';
	import { imgThumbSm } from '$lib/utils/imagekit';

	interface Props {
		images: string[];
		alt?: string;
	}
	let { images, alt = 'Galeri foto' }: Props = $props();

	let el: HTMLDivElement;
	let prevEl: HTMLButtonElement;
	let nextEl: HTMLButtonElement;

	// --- Lightbox state ---
	let open = $state(false);
	let current = $state(0);

	function openAt(i: number) {
		current = i;
		open = true;
	}
	function close() {
		open = false;
	}
	function next() {
		current = (current + 1) % images.length;
	}
	function prev() {
		current = (current - 1 + images.length) % images.length;
	}

	function onKey(e: KeyboardEvent) {
		if (!open) return;
		if (e.key === 'Escape') close();
		else if (e.key === 'ArrowRight') next();
		else if (e.key === 'ArrowLeft') prev();
	}

	// Kunci scroll body saat lightbox terbuka
	$effect(() => {
		if (typeof document === 'undefined') return;
		document.body.style.overflow = open ? 'hidden' : '';
		return () => {
			document.body.style.overflow = '';
		};
	});

	// --- Swipe (touch) di dalam lightbox ---
	let touchX = 0;
	function onTouchStart(e: TouchEvent) {
		touchX = e.changedTouches[0].clientX;
	}
	function onTouchEnd(e: TouchEvent) {
		const dx = e.changedTouches[0].clientX - touchX;
		if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
	}

	onMount(() => {
		let swiper: { destroy: () => void } | undefined;
		(async () => {
			const { default: Swiper } = await import('swiper');
			const { Navigation, Pagination } = await import('swiper/modules');
			swiper = new Swiper(el, {
				modules: [Navigation, Pagination],
				spaceBetween: 12,
				slidesPerView: 1,
				navigation: { prevEl, nextEl },
				pagination: { clickable: true },
				breakpoints: {
					640: { slidesPerView: 2 },
					768: { slidesPerView: 3 },
					1024: { slidesPerView: 4 },
					1280: { slidesPerView: 5 }
				}
			});
		})();
		return () => swiper?.destroy();
	});
</script>

<svelte:window onkeydown={onKey} />

<div class="relative">
	<div bind:this={el} class="swiper pb-10">
		<div class="swiper-wrapper">
			{#each images as src, i}
				<div class="swiper-slide">
					<button
						type="button"
						class="group block w-full cursor-zoom-in overflow-hidden rounded-lg md:rounded-xl"
						onclick={() => openAt(i)}
						aria-label={`Lihat ${alt} ${i + 1} layar penuh`}
					>
						<img
							src={imgThumbSm(src)}
							alt={`${alt} ${i + 1}`}
							loading="lazy"
							class="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-105"
						/>
					</button>
				</div>
			{/each}
		</div>
		<div class="swiper-pagination"></div>
	</div>

	<!-- Panah navigasi kustom (terlihat jelas, termasuk di mobile) -->
	<button
		bind:this={prevEl}
		type="button"
		class="absolute left-2 top-[calc(50%-1.25rem)] z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brand shadow-md ring-1 ring-black/5 transition hover:bg-white disabled:opacity-0 md:h-11 md:w-11"
		aria-label="Foto sebelumnya"
	>
		<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
			<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
		</svg>
	</button>
	<button
		bind:this={nextEl}
		type="button"
		class="absolute right-2 top-[calc(50%-1.25rem)] z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brand shadow-md ring-1 ring-black/5 transition hover:bg-white disabled:opacity-0 md:h-11 md:w-11"
		aria-label="Foto berikutnya"
	>
		<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
			<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
		</svg>
	</button>
</div>

<!-- Lightbox fullscreen -->
{#if open}
	<div
		class="fixed inset-0 z-[100] flex items-center justify-center bg-black/90"
		role="dialog"
		aria-modal="true"
		aria-label="Galeri layar penuh"
		tabindex="-1"
		ontouchstart={onTouchStart}
		ontouchend={onTouchEnd}
	>
		<!-- Backdrop: klik untuk menutup -->
		<button type="button" class="absolute inset-0 cursor-zoom-out" aria-label="Tutup" onclick={close}></button>

		<!-- Tombol tutup -->
		<button
			type="button"
			class="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25"
			aria-label="Tutup galeri"
			onclick={close}
		>
			<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M6 6l12 12M18 6L6 18" />
			</svg>
		</button>

		<!-- Counter -->
		<div class="absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-sm text-white">
			{current + 1} / {images.length}
		</div>

		<!-- Gambar aktif -->
		<img
			src={images[current]}
			alt={`${alt} ${current + 1}`}
			class="relative z-[1] max-h-[88vh] max-w-[92vw] select-none object-contain"
		/>

		{#if images.length > 1}
			<!-- Prev -->
			<button
				type="button"
				class="absolute left-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25 md:left-6"
				aria-label="Gambar sebelumnya"
				onclick={prev}
			>
				<svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
				</svg>
			</button>
			<!-- Next -->
			<button
				type="button"
				class="absolute right-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25 md:right-6"
				aria-label="Gambar berikutnya"
				onclick={next}
			>
				<svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
				</svg>
			</button>
		{/if}
	</div>
{/if}

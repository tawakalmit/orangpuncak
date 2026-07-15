<script lang="ts">
	interface Props {
		embedSrc?: string | null;
		mapsUrl?: string | null;
		title?: string;
		class?: string;
	}

	let {
		embedSrc,
		mapsUrl,
		title = 'Peta lokasi',
		class: cls = 'h-72 w-full border-0 md:h-96'
	}: Props = $props();

	let loaded = $state(false);
</script>

<div class="relative overflow-hidden rounded-xl">
	{#if loaded && embedSrc}
		<iframe
			{title}
			src={embedSrc}
			class={cls}
			allowfullscreen
			referrerpolicy="strict-origin-when-cross-origin"
		></iframe>
	{:else}
		<div class="flex {cls} w-full flex-col items-center justify-center gap-3 bg-ink/5">
			<svg class="h-10 w-10 text-ink/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
				<path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
				<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
			</svg>
			<p class="text-sm text-ink/50">Peta belum dimuat</p>
			<div class="flex flex-wrap justify-center gap-2">
				{#if embedSrc}
					<button
						type="button"
						onclick={() => (loaded = true)}
						class="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white shadow hover:bg-brand/90 transition"
					>
						Tampilkan Peta
					</button>
				{/if}
				{#if mapsUrl}
					<a
						href={mapsUrl}
						target="_blank"
						rel="noopener noreferrer"
						class="rounded-full border border-ink/20 px-5 py-2 text-sm font-medium text-ink/70 hover:bg-ink/5 transition"
					>
						Buka Google Maps
					</a>
				{/if}
			</div>
		</div>
	{/if}
</div>

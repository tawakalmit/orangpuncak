<script lang="ts">
	interface PlaceOption {
		id: string;
		name: string;
	}

	interface Props {
		name: string;
		label: string;
		options: PlaceOption[];
		selected?: string[];
		max?: number;
	}

	let {
		name,
		label,
		options = [],
		selected = $bindable([]),
		max = 8
	}: Props = $props();

	let query = $state('');
	let open = $state(false);
	let inputEl = $state<HTMLInputElement | null>(null);

	const filtered = $derived(
		options
			.filter((o) => !selected.includes(o.id))
			.filter((o) => !query || o.name.toLowerCase().includes(query.toLowerCase()))
			.slice(0, 100)
	);

	const selectedItems = $derived(options.filter((o) => selected.includes(o.id)));

	function add(id: string) {
		if (selected.length >= max) return;
		if (!selected.includes(id)) selected = [...selected, id];
		query = '';
		inputEl?.focus();
	}

	function remove(id: string) {
		selected = selected.filter((s) => s !== id);
	}

	function onFocus() {
		open = true;
	}

	// Delay close so click on option registers first
	function onBlur() {
		setTimeout(() => { open = false; }, 150);
	}
</script>

<div>
	<span class="mb-1 block text-sm font-medium">
		{label}
		<span class="font-normal text-ink/50">(maks. {max})</span>
	</span>

	<!-- hidden inputs untuk form submission -->
	{#each selected as id}
		<input type="hidden" {name} value={id} />
	{/each}

	<!-- Chips yang sudah dipilih -->
	{#if selectedItems.length}
		<div class="mb-2 flex flex-wrap gap-1.5">
			{#each selectedItems as item}
				<span class="flex items-center gap-1 rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand">
					{item.name}
					<button
						type="button"
						onclick={() => remove(item.id)}
						class="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full text-brand/50 hover:bg-brand/20 hover:text-red-500"
						aria-label="Hapus {item.name}"
					>×</button>
				</span>
			{/each}
		</div>
	{/if}

	<!-- Input + dropdown -->
	{#if selected.length < max}
		<div class="relative">
			<div class="flex items-center rounded-md border border-ink/20 bg-white px-3 focus-within:border-brand focus-within:ring-1 focus-within:ring-brand/30">
				<svg class="mr-2 h-4 w-4 shrink-0 text-ink/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
				</svg>
				<input
					bind:this={inputEl}
					type="text"
					placeholder="Cari dan pilih..."
					bind:value={query}
					onfocus={onFocus}
					onblur={onBlur}
					class="w-full bg-transparent py-2 text-sm outline-none placeholder:text-ink/40"
				/>
				{#if query}
					<button
						type="button"
						onclick={() => { query = ''; inputEl?.focus(); }}
						class="ml-1 text-ink/40 hover:text-ink/70"
						aria-label="Hapus pencarian"
					>
						<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				{/if}
			</div>

			{#if open}
				<div class="absolute z-20 mt-1 w-full rounded-md border border-ink/20 bg-white shadow-lg">
					{#if filtered.length}
						<ul class="max-h-56 overflow-y-auto py-1">
							{#each filtered as opt}
								<li>
									<button
										type="button"
										onmousedown={() => add(opt.id)}
										class="flex w-full items-center px-3 py-2 text-left text-sm hover:bg-brand/10 hover:text-brand"
									>
										<span class="flex-1">{opt.name}</span>
										<svg class="ml-2 h-3.5 w-3.5 shrink-0 text-brand/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
											<path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
										</svg>
									</button>
								</li>
							{/each}
						</ul>
					{:else}
						<div class="px-3 py-3 text-center text-sm text-ink/50">
							{query ? `Tidak ditemukan "${query}"` : 'Tidak ada opsi tersedia'}
						</div>
					{/if}
					<div class="border-t border-ink/10 px-3 py-1.5 text-xs text-ink/40">
						{selected.length}/{max} dipilih
					</div>
				</div>
			{/if}
		</div>
	{:else}
		<div class="rounded-md border border-ink/20 bg-ink/5 px-3 py-2 text-sm text-ink/50">
			Sudah mencapai batas {max} item.
		</div>
	{/if}
</div>

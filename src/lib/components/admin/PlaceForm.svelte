<script lang="ts">
	import { enhance } from '$app/forms';
	import CategoryPicker from './CategoryPicker.svelte';
	import ImageUpload from './ImageUpload.svelte';
	import NearbyPicker from './NearbyPicker.svelte';
	import RichTextEditor from './RichTextEditor.svelte';
	import type { Place } from '$lib/types';

	interface PlaceOption {
		id: string;
		name: string;
		type: string;
	}

	interface Props {
		place?: Partial<Place>;
		error?: string | null;
		submitLabel?: string;
		formAction?: string;
		allPlaces?: PlaceOption[];
		allCategories?: string[];
	}
	let { place = {}, error = null, submitLabel = 'Simpan', formAction = '', allPlaces = [], allCategories = [] }: Props = $props();

	let type = $state(place.type ?? 'wisata');
	let status = $state(place.status ?? 'disewakan');
	let cover = $state(place.cover_image ?? '');
	let gallery = $state<string[]>(place.gallery ?? []);
	let saving = $state(false);
	let categories = $state<string[]>(place.categories ?? []);

	let nearbyVilla = $state<string[]>(place.nearby_villa_ids ?? []);
	let nearbyWisata = $state<string[]>(place.nearby_wisata_ids ?? []);
	let nearbyKuliner = $state<string[]>(place.nearby_kuliner_ids ?? []);

	let content = $state(place.content ?? '');
	let tips = $state(place.tips ?? '');
	let hargaTiket = $state(place.harga_tiket ?? '');
	let jamBuka = $state(place.jam_buka ?? '');

	const villaOptions = $derived(allPlaces.filter((p) => p.type === 'villa'));
	const wisataOptions = $derived(allPlaces.filter((p) => p.type === 'wisata'));
	const kulinerOptions = $derived(allPlaces.filter((p) => p.type === 'kuliner'));

	const facilities: { key: string; label: string }[] = [
		{ key: 'wifi', label: 'Wifi' },
		{ key: 'kolam_renang', label: 'Kolam Renang' },
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

	const fac = (place.facilities ?? {}) as Record<string, boolean>;
	const inputClass = 'w-full rounded-md border border-ink/20 px-3 py-2';
</script>

<form
	method="POST"
	action={formAction}
	class="mt-5 space-y-6"
	use:enhance={() => {
		saving = true;
		return async ({ update }) => {
			await update();
			saving = false;
		};
	}}
>
	{#if error}
		<p class="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
	{/if}

	<!-- Dasar -->
	<section class="rounded-xl bg-surface p-5 shadow-md">
		<h2 class="font-heading font-semibold text-brand">Informasi Dasar</h2>
		<div class="mt-4 grid gap-4 md:grid-cols-2">
			<div>
				<label for="type" class="mb-1 block text-sm font-medium">Tipe *</label>
				<select id="type" name="type" bind:value={type} class={inputClass}>
					<option value="wisata">Wisata</option>
					<option value="villa">Villa</option>
					<option value="kuliner">Kuliner</option>
				</select>
			</div>
			<div>
				<label for="kode" class="mb-1 block text-sm font-medium">Kode {type === 'villa' ? '*' : ''}</label>
				<input id="kode" name="kode" value={place.kode ?? ''} class={inputClass} placeholder="mis. VP-001" />
			</div>
			<div>
				<label for="name" class="mb-1 block text-sm font-medium">Nama *</label>
				<input id="name" name="name" required value={place.name ?? ''} class={inputClass} />
			</div>
			<div>
				<label for="slug" class="mb-1 block text-sm font-medium">Slug</label>
				<input id="slug" name="slug" value={place.slug ?? ''} class={inputClass} placeholder="otomatis dari nama" />
			</div>
			<div class="md:col-span-2">
				<label for="meta_title" class="mb-1 block text-sm font-medium">Meta Title <span class="text-ink/50 font-normal">(untuk &lt;title&gt; di browser, kosongkan = pakai Nama)</span></label>
				<input id="meta_title" name="meta_title" value={place.meta_title ?? ''} class={inputClass} placeholder="mis. Wisata Air Terjun Cibeureum - Puncak" />
			</div>
			<div>
				<CategoryPicker name="categories" label="Kategori" options={allCategories} bind:selected={categories} />
			</div>
			<div>
				<label for="lokasi" class="mb-1 block text-sm font-medium">Lokasi</label>
				<select id="lokasi" name="lokasi" class={inputClass} value={place.lokasi ?? ''}>
					<option value="">-- Pilih Lokasi --</option>
					<option value="Cisarua">Cisarua</option>
					<option value="Puncak Pass">Puncak Pass</option>
					<option value="Cipanas">Cipanas</option>
					<option value="Megamendung">Megamendung</option>
					<option value="Pacet">Pacet</option>
					<option value="Sukaresmi">Sukaresmi</option>
				</select>
			</div>			<div class="md:col-span-2">
				<label for="address" class="mb-1 block text-sm font-medium">Alamat</label>
				<input id="address" name="address" value={place.address ?? ''} class={inputClass} />
			</div>
			<div>
				<label for="lat" class="mb-1 block text-sm font-medium">Latitude</label>
				<input id="lat" name="lat" type="number" step="any" value={place.lat ?? ''} class={inputClass} />
			</div>
			<div>
				<label for="lng" class="mb-1 block text-sm font-medium">Longitude</label>
				<input id="lng" name="lng" type="number" step="any" value={place.lng ?? ''} class={inputClass} />
			</div>
			<div>
				<label for="whatsapp" class="mb-1 block text-sm font-medium">WhatsApp (opsional)</label>
				<input id="whatsapp" name="whatsapp" value={place.whatsapp ?? ''} class={inputClass} placeholder="6281234567890" />
			</div>
			<div>
				<label for="video" class="mb-1 block text-sm font-medium">Video YouTube (opsional)</label>
				<input id="video" name="video" value={place.video ?? ''} class={inputClass} />
			</div>
			<div class="md:col-span-2">
				<label for="description" class="mb-1 block text-sm font-medium">Deskripsi singkat</label>
				<textarea id="description" name="description" rows="2" class={inputClass}>{place.description ?? ''}</textarea>
			</div>
			<div class="md:col-span-2">
				<label for="content" class="mb-1 block text-sm font-medium">Konten (boleh HTML)</label>
				<RichTextEditor name="content" label="Konten" bind:value={content} />
			</div>
		</div>

		<div class="mt-4 flex flex-wrap gap-5">
			<label class="flex items-center gap-2 text-sm"><input type="checkbox" name="is_promo" checked={place.is_promo} class="h-4 w-4 accent-brand" /> Promo</label>
			<label class="flex items-center gap-2 text-sm"><input type="checkbox" name="is_featured" checked={place.is_featured} class="h-4 w-4 accent-brand" /> Unggulan</label>
			<label class="flex items-center gap-2 text-sm"><input type="checkbox" name="published" checked={place.id ? (place as Place & {published?: boolean}).published ?? true : true} class="h-4 w-4 accent-brand" /> Tampilkan (published)</label>
		</div>
	</section>

	<!-- Gambar -->
	<section class="rounded-xl bg-surface p-5 shadow-md">
		<h2 class="font-heading font-semibold text-brand">Gambar</h2>
		<div class="mt-4 grid gap-5 md:grid-cols-2">
			<ImageUpload name="cover_image" label="Cover" bind:value={cover} />
			<ImageUpload name="gallery" label="Galeri (multi)" multiple bind:values={gallery} />
		</div>
	</section>

	<!-- Wisata / Kuliner -->
	{#if type !== 'villa'}
		<section class="rounded-xl bg-surface p-5 shadow-md">
			<h2 class="font-heading font-semibold text-brand">Detail {type === 'wisata' ? 'Wisata' : 'Kuliner'}</h2>
			<div class="mt-4 grid gap-4 md:grid-cols-2">
				<div class="md:col-span-2">
					<RichTextEditor name="jam_buka" label="Jam Buka" bind:value={jamBuka} />
				</div>
				{#if type === 'wisata'}
					<div class="md:col-span-2">
						<RichTextEditor name="harga_tiket" label="Harga Tiket (HTM)" bind:value={hargaTiket} />
					</div>
					<div class="md:col-span-2">
						<RichTextEditor name="tips" label="Tips" bind:value={tips} />
					</div>
				{:else}
					<div>
						<label for="harga_range" class="mb-1 block text-sm font-medium">Kisaran Harga</label>
						<input id="harga_range" name="harga_range" value={place.harga_range ?? ''} class={inputClass} />
					</div>
				{/if}
			</div>
		</section>
	{/if}

	<!-- Villa -->
	{#if type === 'villa'}
		<section class="rounded-xl bg-surface p-5 shadow-md">
			<h2 class="font-heading font-semibold text-brand">Detail Villa</h2>
			<div class="mt-4 grid gap-4 md:grid-cols-3">
				<div>
					<label for="status" class="mb-1 block text-sm font-medium">Status *</label>
					<select id="status" name="status" bind:value={status} class={inputClass}>
						<option value="disewakan">Disewakan</option>
						<option value="dijual">Dijual</option>
					</select>
				</div>
				<div><label class="mb-1 block text-sm font-medium" for="jumlah_kamar_tidur">Kamar Tidur</label><input id="jumlah_kamar_tidur" name="jumlah_kamar_tidur" type="number" value={place.jumlah_kamar_tidur ?? ''} class={inputClass} /></div>
				<div><label class="mb-1 block text-sm font-medium" for="jumlah_kamar_mandi">Kamar Mandi</label><input id="jumlah_kamar_mandi" name="jumlah_kamar_mandi" type="number" value={place.jumlah_kamar_mandi ?? ''} class={inputClass} /></div>
				<div><label class="mb-1 block text-sm font-medium" for="jumlah_lantai">Jumlah Lantai</label><input id="jumlah_lantai" name="jumlah_lantai" type="number" value={place.jumlah_lantai ?? ''} class={inputClass} /></div>
				<div><label class="mb-1 block text-sm font-medium" for="kapasitas">Kapasitas</label><input id="kapasitas" name="kapasitas" type="number" value={place.kapasitas ?? ''} class={inputClass} /></div>
			</div>

			{#if status === 'disewakan'}
				<div class="mt-4 grid gap-4 md:grid-cols-2">
					<div><label class="mb-1 block text-sm font-medium" for="harga_sewa_weekday">Harga Weekday</label><input id="harga_sewa_weekday" name="harga_sewa_weekday" type="number" value={place.harga_sewa_weekday ?? ''} class={inputClass} /></div>
					<div><label class="mb-1 block text-sm font-medium" for="harga_sewa_weekend">Harga Weekend</label><input id="harga_sewa_weekend" name="harga_sewa_weekend" type="number" value={place.harga_sewa_weekend ?? ''} class={inputClass} /></div>
					<div><label class="mb-1 block text-sm font-medium" for="promo_harga_sewa_weekday">Promo Weekday</label><input id="promo_harga_sewa_weekday" name="promo_harga_sewa_weekday" type="number" value={place.promo_harga_sewa_weekday ?? ''} class={inputClass} /></div>
					<div><label class="mb-1 block text-sm font-medium" for="promo_harga_sewa_weekend">Promo Weekend</label><input id="promo_harga_sewa_weekend" name="promo_harga_sewa_weekend" type="number" value={place.promo_harga_sewa_weekend ?? ''} class={inputClass} /></div>
				</div>
			{:else}
				<div class="mt-4 grid gap-4 md:grid-cols-2">
					<div><label class="mb-1 block text-sm font-medium" for="harga_jual">Harga Jual</label><input id="harga_jual" name="harga_jual" type="number" value={place.harga_jual ?? ''} class={inputClass} /></div>
					<div><label class="mb-1 block text-sm font-medium" for="harga_promo">Harga Promo</label><input id="harga_promo" name="harga_promo" type="number" value={place.harga_promo ?? ''} class={inputClass} /></div>
					<div><label class="mb-1 block text-sm font-medium" for="luas_tanah">Luas Tanah (m²)</label><input id="luas_tanah" name="luas_tanah" type="number" value={place.luas_tanah ?? ''} class={inputClass} /></div>
					<div><label class="mb-1 block text-sm font-medium" for="luas_bangunan">Luas Bangunan (m²)</label><input id="luas_bangunan" name="luas_bangunan" type="number" value={place.luas_bangunan ?? ''} class={inputClass} /></div>
					<div><label class="mb-1 block text-sm font-medium" for="kamar_art">Kamar ART</label><input id="kamar_art" name="kamar_art" type="number" value={place.kamar_art ?? ''} class={inputClass} /></div>
					<label class="flex items-center gap-2 text-sm md:mt-7"><input type="checkbox" name="shm" checked={place.shm ?? false} class="h-4 w-4 accent-brand" /> Sertifikat SHM</label>
				</div>
			{/if}

			<div class="mt-5">
				<span class="mb-2 block text-sm font-medium">Fasilitas</span>
				<div class="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
					{#each facilities as f}
						<label class="flex items-center gap-2 text-sm">
							<input type="checkbox" name={`facility_${f.key}`} checked={fac[f.key] ?? false} class="h-4 w-4 accent-brand" />
							{f.label}
						</label>
					{/each}
				</div>
			</div>
		</section>
	{/if}

	<!-- Nearby -->
	{#if allPlaces.length > 0}
		<section class="rounded-xl bg-surface p-5 shadow-md">
			<h2 class="font-heading font-semibold text-brand">Terdekat / Rekomendasi</h2>
			<div class="mt-4 grid gap-6 md:grid-cols-3">
				<NearbyPicker
					name="nearby_villa_ids"
					label="Villa Terdekat"
					options={villaOptions}
					bind:selected={nearbyVilla}
					max={8}
				/>
				<NearbyPicker
					name="nearby_wisata_ids"
					label="Wisata Terdekat"
					options={wisataOptions}
					bind:selected={nearbyWisata}
					max={8}
				/>
				<NearbyPicker
					name="nearby_kuliner_ids"
					label="Kuliner Terdekat"
					options={kulinerOptions}
					bind:selected={nearbyKuliner}
					max={8}
				/>
			</div>
		</section>
	{/if}

	<div class="flex gap-3">
		<button type="submit" disabled={saving} class="btn-primary">{saving ? 'Menyimpan...' : submitLabel}</button>
		<a href="/admin/places" class="rounded-full border border-ink/20 px-6 py-3 font-medium">Batal</a>
	</div>
</form>

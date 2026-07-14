<script lang="ts">
	import PlaceForm from '$lib/components/admin/PlaceForm.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<Seo title="Tambah Direktori" />

<a href="/admin/places" class="text-sm text-brand hover:underline">← Kembali</a>
<h1 class="mt-2 font-heading text-2xl font-bold text-brand">Tambah Direktori</h1>

<PlaceForm allPlaces={data.allPlaces} error={form?.error} submitLabel="Simpan" />

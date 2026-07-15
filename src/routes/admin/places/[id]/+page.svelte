<script lang="ts">
	import { enhance } from '$app/forms';
	import PlaceForm from '$lib/components/admin/PlaceForm.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<Seo title={`Edit ${data.place.name}`} />

<div class="flex items-center justify-between">
	<a href="/admin/places" class="text-sm text-brand hover:underline">← Kembali</a>
	<form
		method="POST"
		action="?/delete"
		use:enhance
		onsubmit={(e) => { if (!confirm('Hapus data ini?')) e.preventDefault(); }}
	>
		<button class="text-sm text-red-600 hover:underline">Hapus</button>
	</form>
</div>
<h1 class="mt-2 font-heading text-2xl font-bold text-brand">Edit: {data.place.name}</h1>

<PlaceForm place={data.place} allPlaces={data.allPlaces} allCategories={data.allCategories} error={form?.error} submitLabel="Perbarui" formAction="?/update" />

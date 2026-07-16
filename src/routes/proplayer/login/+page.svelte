<script lang="ts">
	import { enhance } from '$app/forms';
	import Seo from '$lib/components/Seo.svelte';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
	let loading = $state(false);
</script>

<Seo title="Login Admin" />

<div class="flex min-h-screen items-center justify-center bg-cream px-4">
	<div class="w-full max-w-sm rounded-2xl bg-surface p-8 shadow-xl">
		<div class="text-center">
			<span class="font-logo text-3xl font-bold text-brand">orang<span class="text-accent">puncak</span></span>
			<p class="mt-1 text-sm text-ink/60">Panel Admin</p>
		</div>

		<form
			method="POST"
			class="mt-6 space-y-4"
			use:enhance={() => {
				loading = true;
				return async ({ update }) => {
					await update();
					loading = false;
				};
			}}
		>
			{#if form?.error}
				<p class="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{form.error}</p>
			{/if}
			<div>
				<label for="email" class="mb-1 block text-sm font-medium">Email</label>
				<input id="email" name="email" type="email" required value={form?.email ?? ''} class="w-full rounded-md border border-ink/20 px-3 py-2" />
			</div>
			<div>
				<label for="password" class="mb-1 block text-sm font-medium">Password</label>
				<input id="password" name="password" type="password" required class="w-full rounded-md border border-ink/20 px-3 py-2" />
			</div>
			<button type="submit" disabled={loading} class="btn-primary w-full">
				{loading ? 'Memproses...' : 'Masuk'}
			</button>
		</form>

		<a href="/" class="mt-4 block text-center text-xs text-brand hover:underline">← Kembali ke situs</a>
	</div>
</div>

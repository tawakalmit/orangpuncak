<script lang="ts">
	import { enhance } from '$app/forms';
	import Seo from '$lib/components/Seo.svelte';
	import { SOCIAL_LINKS } from '$lib/config';
	import { env } from '$env/dynamic/public';
	import { waLink } from '$lib/utils/whatsapp';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();

	const siteKey = env.PUBLIC_RECAPTCHA_SITE_KEY ?? '';

	let loading = $state(false);
	let recaptchaToken = $state('');

	/** Minta token reCAPTCHA v3 sebelum submit */
	async function getRecaptchaToken(): Promise<string> {
		return new Promise((resolve) => {
			if (typeof window === 'undefined' || !window.grecaptcha || !siteKey) {
				resolve('');
				return;
			}
			window.grecaptcha.ready(() => {
				window.grecaptcha.execute(siteKey, { action: 'contact_form' }).then(resolve);
			});
		});
	}
</script>

<svelte:head>
	{#if siteKey}
		<script src="https://www.google.com/recaptcha/api.js?render={siteKey}" async defer></script>
	{/if}
</svelte:head>

<Seo title="Kontak" description="Hubungi orangpuncak.com untuk reservasi, kerjasama, dan pertanyaan seputar wisata Puncak." path="/kontak" />

<div class="mx-auto max-w-3xl px-4 py-10">
	<h1 class="section-title">Hubungi Kami</h1>
	<p class="mt-2 text-ink/70">Ada pertanyaan, reservasi, atau ingin bekerja sama? Hubungi kami melalui kanal berikut.</p>

	<div class="mt-6 grid gap-4 sm:grid-cols-2">
		<div class="rounded-xl bg-surface p-5 shadow-md">
			<h2 class="font-heading text-lg font-semibold text-brand">WhatsApp</h2>
			<p class="mt-1 text-sm text-ink/70">Respon cepat untuk booking & konsultasi.</p>
			<a href={waLink('Halo orangpuncak.com, saya ingin bertanya.')} target="_blank" rel="noopener" class="btn-action mt-3 inline-flex">
				Chat Sekarang
			</a>
		</div>

		<div class="rounded-xl bg-surface p-5 shadow-md">
			<h2 class="font-heading text-lg font-semibold text-brand">Sosial Media</h2>
			<div class="mt-3 flex flex-wrap gap-3">
				{#each SOCIAL_LINKS as s}
					<a href={s.href} target="_blank" rel="noopener" class="rounded-full bg-muted px-4 py-2 text-sm font-medium hover:bg-accent">{s.label}</a>
				{/each}
			</div>
		</div>
	</div>

	<!-- Form Pesan -->
	<div class="mt-8 rounded-xl bg-surface p-6 shadow-md">
		<h2 class="font-heading text-lg font-semibold text-brand">Kirim Pesan</h2>
		<p class="mt-1 text-sm text-ink/70">Isi form di bawah dan kami akan segera merespons.</p>

		{#if form?.success}
			<div class="mt-5 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800">
				<p class="font-medium">Pesan terkirim!</p>
				<p class="mt-1 text-sm">Terima kasih sudah menghubungi kami. Kami akan segera merespons.</p>
			</div>
		{:else}
			{#if form?.error}
				<div class="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
					{form.error}
				</div>
			{/if}

			<form
				method="POST"
				class="mt-5 space-y-4"
				use:enhance={async ({ formData, cancel }) => {
					loading = true;

					// Ambil token reCAPTCHA sebelum submit
					const token = await getRecaptchaToken();
					if (!token && siteKey) {
						// Gagal dapat token — batalkan submit
						cancel();
						loading = false;
						return;
					}
					formData.set('recaptcha_token', token);

					return async ({ update }) => {
						await update();
						loading = false;
					};
				}}
			>
				<!-- Honeypot: disembunyikan dari manusia, bot akan mengisinya -->
				<div class="hidden" aria-hidden="true">
					<label for="website">Website</label>
					<input type="text" id="website" name="website" tabindex="-1" autocomplete="off" />
				</div>

				<!-- Token reCAPTCHA dikirim sebagai hidden field (diisi oleh enhance di atas) -->
				<input type="hidden" name="recaptcha_token" value={recaptchaToken} />

				<div>
					<label for="nama" class="block text-sm font-medium text-ink">
						Nama <span class="text-red-500">*</span>
					</label>
					<input
						type="text"
						id="nama"
						name="nama"
						value={form?.nama ?? ''}
						maxlength="100"
						required
						placeholder="Nama kamu"
						class="mt-1 w-full rounded-lg border border-ink/20 bg-cream px-3 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
					/>
				</div>

				<div>
					<label for="pesan" class="block text-sm font-medium text-ink">
						Pesan <span class="text-red-500">*</span>
					</label>
					<textarea
						id="pesan"
						name="pesan"
						rows="5"
						maxlength="2000"
						required
						placeholder="Tulis pesan kamu di sini..."
						class="mt-1 w-full rounded-lg border border-ink/20 bg-cream px-3 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
					>{form?.pesan ?? ''}</textarea>
				</div>

				<div class="flex items-center gap-3">
					<button type="submit" disabled={loading} class="btn-primary">
						{loading ? 'Mengirim...' : 'Kirim Pesan'}
					</button>
					{#if siteKey}
						<p class="text-xs text-ink/40">
							Dilindungi reCAPTCHA —
							<a href="https://policies.google.com/privacy" target="_blank" rel="noopener" class="underline">Privasi</a>
							&amp;
							<a href="https://policies.google.com/terms" target="_blank" rel="noopener" class="underline">Ketentuan</a>
						</p>
					{/if}
				</div>
			</form>
		{/if}
	</div>
</div>



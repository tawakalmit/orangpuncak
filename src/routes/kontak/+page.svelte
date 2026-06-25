<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import { SOCIAL_LINKS } from '$lib/config';
	import { waLink } from '$lib/utils/whatsapp';
</script>

<Seo title="Kontak" description="Hubungi orangpuncak.com untuk reservasi, kerjasama, dan pertanyaan seputar wisata Puncak." path="/kontak" />

<div class="mx-auto max-w-3xl px-4 py-10">
	<h1 class="section-title">Hubungi Kami</h1>
	<p class="mt-2 text-ink/70">Ada pertanyaan, reservasi, atau ingin bekerja sama? Hubungi kami melalui kanal berikut.</p>

	<div class="mt-6 grid gap-4 sm:grid-cols-2">
		<div class="rounded-xl bg-surface p-5 shadow-md">
			<h2 class="font-heading text-lg font-semibold text-brand">WhatsApp</h2>
			<p class="mt-1 text-sm text-ink/70">Respon cepat untuk booking & konsultasi.</p>
			<a href={waLink('Halo orangpuncak.com, saya ingin bertanya.')} target="_blank" rel="noopener" class="btn-action mt-3">
				Chat Sekarang
			</a>
		</div>
		<div class="rounded-xl bg-surface p-5 shadow-md">
			<h2 class="font-heading text-lg font-semibold text-brand">Email</h2>
			<p class="mt-1 text-sm text-ink/70">Untuk kerjasama & media.</p>
			<a href="mailto:halo@orangpuncak.com" class="btn-action mt-3">halo@orangpuncak.com</a>
		</div>
	</div>

	<div class="mt-6 rounded-xl bg-surface p-5 shadow-md">
		<h2 class="font-heading text-lg font-semibold text-brand">Sosial Media</h2>
		<div class="mt-3 flex flex-wrap gap-3">
			{#each SOCIAL_LINKS as s}
				<a href={s.href} target="_blank" rel="noopener" class="rounded-full bg-muted px-4 py-2 text-sm font-medium hover:bg-accent">{s.label}</a>
			{/each}
		</div>
	</div>
</div>

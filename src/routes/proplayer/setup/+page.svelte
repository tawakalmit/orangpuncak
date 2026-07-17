<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
</script>

<Seo title="Setup Admin" />

<div class="mx-auto max-w-2xl px-4 py-12">
	<div class="rounded-2xl bg-surface p-8 shadow-xl">
		<span class="font-logo text-3xl font-bold text-brand">orang<span class="text-accent">puncak</span></span>
		<h1 class="mt-4 font-heading text-xl font-bold">Panel admin perlu Supabase</h1>
		<p class="mt-2 text-ink/70">
			Untuk memakai panel admin (login, kelola konten, upload gambar), kamu perlu mengaktifkan
			Supabase terlebih dahulu.
		</p>

		<ol class="mt-5 list-decimal space-y-3 pl-5 text-sm text-ink/80">
			<li>Buat project di <a href="https://supabase.com" target="_blank" rel="noopener" class="text-brand underline">supabase.com</a>.</li>
			<li>Jalankan SQL <code>supabase/migrations/0001_init.sql</code> lalu <code>supabase/seed.sql</code> di SQL Editor.</li>
			<li>Isi <code>.env</code>: <code>PUBLIC_SUPABASE_URL</code> &amp; <code>PUBLIC_SUPABASE_ANON_KEY</code>.</li>
			<li>Untuk upload gambar, isi <code>PUBLIC_IMAGEKIT_PUBLIC_KEY</code> &amp; <code>PUBLIC_IMAGEKIT_URL_ENDPOINT</code>.</li>
			<li>
				Buat user admin di Supabase: menu <strong>Authentication → Users → Add user</strong>
				(isi email &amp; password, centang auto-confirm).
			</li>
			<li>Restart <code>pnpm dev</code>, lalu buka <code>/admin/login</code>.</li>
		</ol>

		<a href="/" class="btn-primary mt-6 inline-flex">← Kembali ke situs</a>
	</div>
</div>

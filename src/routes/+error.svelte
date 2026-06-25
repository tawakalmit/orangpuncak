<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="mx-auto flex max-w-content flex-col items-center px-4 py-20 text-center 2xl:px-0">
	<h1 class="font-heading text-6xl font-bold text-brand">{$page.status}</h1>
	<p class="mt-3 text-lg text-ink/70">
		{$page.error?.message ?? 'Halaman tidak ditemukan.'}
	</p>
	<a href="/" class="btn-primary mt-6">Kembali ke Beranda</a>
</div>

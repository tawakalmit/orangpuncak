<script lang="ts">
	import '../../app.css';
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: import('svelte').Snippet } = $props();

	const nav = [
		{ href: '/proplayer', label: 'Dashboard' },
		{ href: '/proplayer/places', label: 'Direktori' },
		{ href: '/proplayer/articles', label: 'Artikel' },
		{ href: '/proplayer/leads', label: 'Leads Iklan' },
		{ href: '/proplayer/messages', label: 'Pesan Masuk' }
	];

	const isActive = (href: string) =>
		href === '/proplayer' ? $page.url.pathname === '/proplayer' : $page.url.pathname.startsWith(href);
</script>

<svelte:head>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

{#if data.userEmail}
	<div class="flex min-h-screen bg-cream">
		<aside class="hidden w-64 shrink-0 flex-col bg-brand text-white md:flex">
			<div class="border-b border-white/15 px-5 py-4">
				<a href="/proplayer" class="font-logo text-2xl font-bold">orang<span class="text-accent">puncak</span></a>
				<p class="text-xs text-white/70">Panel Admin</p>
			</div>
			<nav class="flex-1 space-y-1 p-3">
				{#each nav as item}
					<a
						href={item.href}
						class="block rounded-md px-3 py-2 text-sm transition hover:bg-white/10 {isActive(item.href) ? 'bg-white/15 font-semibold' : ''}"
					>
						{item.label}
					</a>
				{/each}
			</nav>
			<div class="border-t border-white/15 p-3 text-sm">
				<p class="truncate text-white/70" title={data.userEmail}>{data.userEmail}</p>
				<form method="POST" action="/proplayer/logout" use:enhance>
					<button class="mt-2 w-full rounded-md bg-white/10 px-3 py-2 text-left hover:bg-white/20">
						Keluar
					</button>
				</form>
				<a href="/" target="_blank" class="mt-2 block text-xs text-accent hover:underline">Lihat situs ↗</a>
			</div>
		</aside>

		<div class="flex-1">
			<!-- Mobile top bar -->
			<div class="flex items-center justify-between bg-brand px-4 py-3 text-white md:hidden">
				<a href="/proplayer" class="font-logo text-xl font-bold">orang<span class="text-accent">puncak</span></a>
				<form method="POST" action="/proplayer/logout" use:enhance>
					<button class="rounded-md bg-white/10 px-3 py-1.5 text-sm">Keluar</button>
				</form>
			</div>
			<!-- Mobile nav -->
			<nav class="flex gap-1 overflow-x-auto bg-brand-dark px-3 py-2 text-white md:hidden">
				{#each nav as item}
					<a href={item.href} class="whitespace-nowrap rounded-md px-3 py-1.5 text-xs {isActive(item.href) ? 'bg-white/20' : 'bg-white/5'}">
						{item.label}
					</a>
				{/each}
			</nav>

			<main class="p-4 md:p-8">
				{@render children()}
			</main>
		</div>
	</div>
{:else}
	<!-- Halaman tanpa shell (login / setup) -->
	{@render children()}
{/if}

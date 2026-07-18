<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { afterNavigate } from '$app/navigation';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
	import { GA_MEASUREMENT_ID } from '$lib/config';

	injectAnalytics();
	injectSpeedInsights();

	let { children } = $props();

	const isAdmin = $derived($page.url.pathname.startsWith('/proplayer'));

	// Track pageview pada setiap navigasi SvelteKit (SPA navigation)
	afterNavigate(({ to }) => {
		if (!GA_MEASUREMENT_ID || typeof window === 'undefined' || !(window as any).gtag) return;
		(window as any).gtag('config', GA_MEASUREMENT_ID, {
			page_path: to?.url.pathname
		});
	});
</script>

<!-- svelte:head harus di top level, tidak boleh di dalam {#if} -->
<svelte:head>
	{#if GA_MEASUREMENT_ID}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html `<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA_MEASUREMENT_ID}');</script>`}
	{/if}
</svelte:head>

{#if isAdmin}
	{@render children()}
{:else}
	<div class="flex min-h-screen flex-col">
		<Navbar />
		<main class="flex-1">
			{@render children()}
		</main>
		<Footer />
	</div>
{/if}

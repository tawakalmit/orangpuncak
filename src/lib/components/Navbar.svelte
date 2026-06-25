<script lang="ts">
	import { page } from '$app/stores';
	import { NAV_LINKS, SITE_NAME } from '$lib/config';

	let open = $state(false);

	function close() {
		open = false;
	}

	const isActive = (href: string) => $page.url.pathname.startsWith(href);
</script>

<header class="fixed inset-x-0 top-0 z-50 bg-brand text-white shadow-md">
	<nav
		class="mx-auto flex h-14 max-w-content items-center justify-between md:h-16 xl:h-20 2xl:px-0 w-11/12"
		aria-label="Navigasi utama"
	>
		<a href="/" class="flex items-center" onclick={close}>
			<img class="w-10" src="/orang-puncak-icon.png" alt="Logo orangpuncak.com">
			<span class="font-logo text-2xl font-bold leading-none xl:text-3xl">orang<span class="text-accent">puncak</span></span>
		</a>

		<!-- Desktop links -->
		<ul class="hidden items-center gap-1 lg:flex">
			{#each NAV_LINKS as link}
				<li>
					<a
						href={link.href}
						class="rounded-full px-4 py-2 text-sm font-medium transition hover:bg-accent hover:text-black xl:text-base {isActive(
							link.href
						)
							? 'bg-white/15'
							: ''}"
					>
						{link.label}
					</a>
				</li>
			{/each}
		</ul>

		<!-- Mobile toggle -->
		<button
			type="button"
			class="inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-white/15 lg:hidden"
			aria-label="Buka menu"
			aria-expanded={open}
			onclick={() => (open = true)}
		>
			<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
			</svg>
		</button>
	</nav>
</header>

<!-- Mobile full-screen overlay -->
{#if open}
	<div class="fixed inset-0 z-[60] flex flex-col bg-brand text-white lg:hidden">
		<div class="flex h-14 items-center justify-between px-4 md:h-16">
			<span class="font-logo text-3xl font-bold">{SITE_NAME}</span>
			<button
				type="button"
				class="inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-white/15"
				aria-label="Tutup menu"
				onclick={close}
			>
				<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 6l12 12M18 6L6 18" />
				</svg>
			</button>
		</div>
		<ul class="flex flex-1 flex-col items-center justify-center gap-4 text-xl">
			<li><a href="/" class="font-medium hover:text-accent" onclick={close}>Beranda</a></li>
			{#each NAV_LINKS as link}
				<li>
					<a href={link.href} class="font-medium hover:text-accent" onclick={close}>{link.label}</a>
				</li>
			{/each}
		</ul>
	</div>
{/if}

<!-- Spacer karena navbar fixed -->
<div class="h-14 md:h-16 xl:h-20" aria-hidden="true"></div>

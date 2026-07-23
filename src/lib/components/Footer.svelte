<script lang="ts">
	import { NAV_LINKS, SITE_NAME, SITE_TAGLINE, SOCIAL_LINKS } from '$lib/config';
	import { waLink } from '$lib/utils/whatsapp';

	const year = new Date().getFullYear();
	const waHref = waLink('Halo orangpuncak.com, saya ingin bertanya.');
</script>

<footer class="bg-brand text-white">
	<div class="mx-auto grid max-w-content px-4 py-10 md:grid-cols-3 2xl:px-0">
		<div>
			<div class="flex items-center gap-2">
				<img class="w-10" src="/orang-puncak-icon.png" alt="Logo orangpuncak.com">
				<span class="font-logo text-2xl font-bold">orang<span class="text-accent">puncak</span></span>
			</div>
			<p class="mt-3 text-sm text-white/80">{SITE_TAGLINE}</p>
		</div>

		<div>
			<h3 class="font-heading text-lg font-semibold">Jelajahi</h3>
			<ul class="mt-3 space-y-2 text-sm text-white/80">
				{#each NAV_LINKS as link}
					<li><a href={link.href} class="hover:text-accent">{link.label}</a></li>
				{/each}
				<li><a href="/tentang" class="hover:text-accent">Tentang Kami</a></li>
			</ul>
		</div>

		<div>
			<h3 class="font-heading text-lg font-semibold">
				<a
					href="/kontak"
					class="group inline-flex items-center gap-1.5 rounded-full border border-accent/50 bg-accent/10 px-3 py-1 text-accent transition hover:bg-accent hover:text-white"
				>
					Hubungi Kami
					<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
					</svg>
				</a>
			</h3>
			<ul class="mt-3 space-y-2 text-sm text-white/80">
				<li>
					<a href={waHref} target="_blank" rel="noopener" class="hover:text-accent">
						WhatsApp: 087721325332
					</a>
				</li>
			</ul>
			<div class="mt-4 flex gap-3 text-sm flex-col">
				{#each SOCIAL_LINKS as s}
					<a href={s.href} target="_blank" rel="noopener" class="hover:text-accent">{s.label} : {s.username}</a>
				{/each}
			</div>
		</div>
	</div>

	<div class="bg-accent py-3 text-center text-sm font-medium text-ink">
		© {year} {SITE_NAME}
		<!-- <a href="/proplayer" class="ml-2 text-ink/60 hover:underline">Admin</a> -->
	</div>
</footer>

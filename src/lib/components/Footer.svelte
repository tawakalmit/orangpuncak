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
			</ul>
		</div>

		<div>
			<h3 class="font-heading text-lg font-semibold">Kontak</h3>
			<ul class="mt-3 space-y-2 text-sm text-white/80">
				<li>
					<a href={waHref} target="_blank" rel="noopener" class="hover:text-accent">
						WhatsApp: chat sekarang
					</a>
				</li>
				<li>Kawasan Puncak, Bogor &amp; Cianjur</li>
			</ul>
			<div class="mt-4 flex gap-3 text-sm">
				{#each SOCIAL_LINKS as s}
					<a href={s.href} target="_blank" rel="noopener" class="hover:text-accent">{s.label}</a>
				{/each}
			</div>
		</div>
	</div>

	<div class="bg-accent py-3 text-center text-sm font-medium text-ink">
		© {year} {SITE_NAME} — Media &amp; Direktori Wisata Puncak.
		<a href="/proplayer" class="ml-2 text-ink/60 hover:underline">Admin</a>
	</div>
</footer>

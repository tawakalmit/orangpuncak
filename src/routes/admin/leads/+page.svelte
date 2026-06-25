<script lang="ts">
	import { enhance } from '$app/forms';
	import Seo from '$lib/components/Seo.svelte';
	import { formatTanggal } from '$lib/utils/format';
	import { waLink } from '$lib/utils/whatsapp';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const statuses = ['new', 'contacted', 'deal', 'rejected'];
	const statusColor: Record<string, string> = {
		new: 'bg-accent text-ink',
		contacted: 'bg-blue-100 text-blue-700',
		deal: 'bg-green-100 text-green-700',
		rejected: 'bg-red-100 text-red-700'
	};
</script>

<Seo title="Leads Iklan" />

<h1 class="font-heading text-2xl font-bold text-brand">Leads Iklan</h1>
<p class="mt-1 text-ink/60">Pengajuan kerjasama dari form Pasang Iklan.</p>

<div class="mt-5 space-y-4">
	{#each data.leads as lead (lead.id)}
		<div class="rounded-xl bg-surface p-5 shadow-md">
			<div class="flex flex-wrap items-start justify-between gap-3">
				<div>
					<h2 class="font-bold">{lead.business_name}</h2>
					<p class="text-sm text-ink/70">{lead.contact_name} · {lead.phone}{lead.email ? ` · ${lead.email}` : ''}</p>
					<p class="mt-1 text-sm">Paket: <span class="font-medium text-brand">{lead.package}</span></p>
					{#if lead.message}<p class="mt-2 text-sm text-ink/80">{lead.message}</p>{/if}
					<p class="mt-2 text-xs text-ink/50">{formatTanggal(lead.created_at)}</p>
				</div>
				<span class="rounded-full px-3 py-1 text-xs font-medium {statusColor[lead.status] ?? 'bg-muted'}">{lead.status}</span>
			</div>
			<div class="mt-3 flex flex-wrap items-center gap-3 border-t border-ink/10 pt-3">
				<form method="POST" action="?/updateStatus" use:enhance class="flex items-center gap-2">
					<input type="hidden" name="id" value={lead.id} />
					<select name="status" class="rounded-md border border-ink/20 px-2 py-1.5 text-sm">
						{#each statuses as s}<option value={s} selected={lead.status === s}>{s}</option>{/each}
					</select>
					<button class="btn-filter text-sm">Ubah Status</button>
				</form>
				<a href={waLink('Halo, terima kasih sudah mengajukan kerjasama di orangpuncak.com.', lead.phone)} target="_blank" rel="noopener" class="text-sm text-brand hover:underline">
					Hubungi via WhatsApp ↗
				</a>
			</div>
		</div>
	{:else}
		<p class="rounded-xl bg-surface p-6 text-center text-ink/50 shadow-md">Belum ada leads.</p>
	{/each}
</div>

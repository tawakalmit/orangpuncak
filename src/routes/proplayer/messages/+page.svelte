<script lang="ts">
	import { enhance } from '$app/forms';
	import Seo from '$lib/components/Seo.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const statuses = ['new', 'read', 'archived'];
	const statusColor: Record<string, string> = {
		new: 'bg-accent text-ink',
		read: 'bg-blue-100 text-blue-700',
		archived: 'bg-ink/10 text-ink/50'
	};

	function formatTanggal(str?: string) {
		if (!str) return '-';
		return new Date(str).toLocaleString('id-ID', {
			day: 'numeric',
			month: 'short',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	const totalNew = $derived(data.messages.filter((m: { status: string }) => m.status === 'new').length);
</script>

<Seo title="Pesan Masuk" />

<div class="flex flex-wrap items-start justify-between gap-2">
	<div>
		<h1 class="font-heading text-2xl font-bold text-brand">Pesan Masuk</h1>
		<p class="mt-1 text-ink/60">Pesan dari form kontak pengunjung situs.</p>
	</div>
	{#if totalNew > 0}
		<span class="rounded-full bg-accent px-3 py-1 text-sm font-semibold text-ink">
			{totalNew} pesan baru
		</span>
	{/if}
</div>

<div class="mt-5 space-y-4">
	{#each data.messages as msg (msg.id)}
		<div class="rounded-xl bg-surface p-5 shadow-md {msg.status === 'new' ? 'border-l-4 border-accent' : ''}">
			<div class="flex flex-wrap items-start justify-between gap-3">
				<div class="flex-1 min-w-0">
					<div class="flex flex-wrap items-center gap-2">
						<h2 class="font-bold">{msg.nama}</h2>
						<span class="rounded-full px-2.5 py-0.5 text-xs font-medium {statusColor[msg.status] ?? 'bg-muted'}">
							{msg.status}
						</span>
					</div>
					<p class="mt-2 whitespace-pre-wrap text-sm text-ink/80">{msg.pesan}</p>
					<p class="mt-2 text-xs text-ink/40">{formatTanggal(msg.created_at)}</p>
				</div>
			</div>

			<div class="mt-3 flex flex-wrap items-center gap-3 border-t border-ink/10 pt-3">
				<!-- Update status -->
				<form method="POST" action="?/updateStatus" use:enhance class="flex items-center gap-2">
					<input type="hidden" name="id" value={msg.id} />
					<select name="status" class="rounded-md border border-ink/20 px-2 py-1.5 text-sm">
						{#each statuses as s}
							<option value={s} selected={msg.status === s}>{s}</option>
						{/each}
					</select>
					<button class="btn-filter text-sm">Ubah Status</button>
				</form>

				<!-- Hapus -->
				<form
					method="POST"
					action="?/delete"
					use:enhance
					onsubmit={(e) => {
						if (!confirm('Hapus pesan ini?')) e.preventDefault();
					}}
				>
					<input type="hidden" name="id" value={msg.id} />
					<button class="text-sm text-red-500 hover:underline">Hapus</button>
				</form>
			</div>
		</div>
	{:else}
		<p class="rounded-xl bg-surface p-6 text-center text-ink/50 shadow-md">Belum ada pesan masuk.</p>
	{/each}
</div>

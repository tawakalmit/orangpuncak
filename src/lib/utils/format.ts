/** Format angka ke Rupiah dengan pemisah ribuan titik. Contoh: Rp 1.500.000 */
export function formatRupiah(value?: number | null): string {
	if (value === null || value === undefined || isNaN(value)) return '-';
	return 'Rp ' + Math.round(value).toLocaleString('id-ID');
}

/** Ubah URL/embed YouTube apa pun menjadi URL embed yang valid. */
export function youtubeEmbed(url?: string | null): string | null {
	if (!url) return null;
	const patterns = [
		/(?:youtube\.com\/watch\?v=)([\w-]{11})/,
		/(?:youtu\.be\/)([\w-]{11})/,
		/(?:youtube\.com\/embed\/)([\w-]{11})/
	];
	for (const p of patterns) {
		const m = url.match(p);
		if (m) return `https://www.youtube.com/embed/${m[1]}`;
	}
	return url;
}

/** Embed Google Maps berdasarkan koordinat atau query alamat. */
export function mapsEmbed(opts: {
	lat?: number | null;
	lng?: number | null;
	query?: string | null;
}): string {
	const { lat, lng, query } = opts;
	if (lat != null && lng != null) {
		return `https://www.google.com/maps?q=${lat},${lng}&hl=id&z=15&output=embed`;
	}
	const q = encodeURIComponent(query || 'Puncak, Bogor');
	return `https://www.google.com/maps?q=${q}&hl=id&z=14&output=embed`;
}

export function formatTanggal(iso?: string | null): string {
	if (!iso) return '';
	try {
		return new Date(iso).toLocaleDateString('id-ID', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	} catch {
		return iso;
	}
}

import { env } from '$env/dynamic/public';

export const IMAGEKIT_PUBLIC_KEY = env.PUBLIC_IMAGEKIT_PUBLIC_KEY ?? '';
export const IMAGEKIT_URL_ENDPOINT = env.PUBLIC_IMAGEKIT_URL_ENDPOINT ?? '';
export const imagekitConfigured = !!IMAGEKIT_PUBLIC_KEY && !!IMAGEKIT_URL_ENDPOINT;

/** Placeholder SVG data-URI untuk item tanpa cover image. */
export const PLACEHOLDER_IMAGE =
	"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='450' viewBox='0 0 600 450'%3E%3Crect width='600' height='450' fill='%23e8f0f0'/%3E%3Crect x='240' y='160' width='120' height='90' rx='8' fill='%23b0cece'/%3E%3Ccircle cx='270' cy='185' r='14' fill='%23e8f0f0'/%3E%3Cpolygon points='240,250 300,190 360,250' fill='%23b0cece'/%3E%3Cpolygon points='280,250 330,210 380,250' fill='%2390b8b8'/%3E%3Ctext x='300' y='310' text-anchor='middle' font-family='sans-serif' font-size='18' fill='%2390b8b8'%3EBelum ada foto%3C%2Ftext%3E%3C%2Fsvg%3E";

export interface ImageKitResult {
	url: string;
	fileId: string;
	name: string;
	width: number;
	height: number;
}

/**
 * Sisipkan transformasi ImageKit ke dalam URL.
 * ImageKit mendukung dua format transformasi:
 *   - Path-based: https://ik.imagekit.io/id/tr:w-600,h-450/image.jpg
 *   - Query-based: https://ik.imagekit.io/id/image.jpg?tr=w-600,h-450
 * Fungsi ini memakai path-based agar konsisten.
 * Mengembalikan URL apa adanya bila bukan URL ImageKit (mis. seed picsum/eksternal).
 */
export function ikTransform(url: string | null | undefined, transform: string): string {
	if (!url) return '';
	if (!url.includes('ik.imagekit.io')) return url; // bukan URL ImageKit, biarkan apa adanya

	// Hindari menumpuk transformasi yang identik
	if (url.includes(`/tr:${transform}/`)) return url;

	// Cari posisi setelah URL endpoint untuk sisipkan transformasi
	// Format: https://ik.imagekit.io/{id}/{path}
	// Sisipkan /tr:{transform}/ sebelum path gambar
	const match = url.match(/^(https:\/\/ik\.imagekit\.io\/[^/]+)(\/.*)?$/);
	if (!match) return url;

	const base = match[1];
	const path = match[2] ?? '/';

	// Jika sudah ada /tr:.../ di path, ganti
	const existingTr = path.match(/^\/tr:[^/]+/);
	if (existingTr) {
		return base + path.replace(/^\/tr:[^/]+/, `/tr:${transform}`);
	}

	return `${base}/tr:${transform}${path}`;
}

/**
 * Terapkan transformasi Cloudinary ke URL.
 * Format asli: https://res.cloudinary.com/{cloud}/image/upload/v{ts}/{path}
 * Format target: https://res.cloudinary.com/{cloud}/image/upload/{transforms}/v{ts}/{path}
 *
 * Jika sudah ada transforms setelah /upload/ (bukan versi), ganti seluruhnya.
 * Jika tidak ada transforms, sisipkan sebelum versi atau langsung setelah /upload/.
 */
export function cloudinaryTransform(url: string | null | undefined, transforms: string): string {
	if (!url) return '';
	if (!url.includes('res.cloudinary.com')) return url;
	// Sudah punya transform yang sama — skip
	if (url.includes(`/upload/${transforms}/`)) return url;

	// Pisah URL menjadi bagian sebelum /upload/ dan setelahnya
	const uploadIdx = url.indexOf('/upload/');
	if (uploadIdx === -1) return url;

	const before = url.slice(0, uploadIdx + '/upload/'.length); // ...com/image/upload/
	const after = url.slice(uploadIdx + '/upload/'.length);     // [existing_transforms/]v123/path atau path

	// Kalau setelah /upload/ ada transform existing (bukan versi, bukan path langsung),
	// ganti dengan transform baru. Deteksi: ada koma atau underscore sebelum slash pertama
	// dan tidak diawali 'v' diikuti angka
	const firstSegment = after.split('/')[0];
	const isVersionSegment = /^v\d+$/.test(firstSegment);
	const isTransformSegment = !isVersionSegment && (firstSegment.includes('_') || firstSegment.includes(','));

	if (isTransformSegment) {
		// Ganti transform lama
		const rest = after.slice(firstSegment.length + 1);
		return `${before}${transforms}/${rest}`;
	}

	// Tidak ada transform — sisipkan langsung
	return `${before}${transforms}/${after}`;
}

/** Thumbnail untuk kartu/grid/daftar (rasio 4:3). */
export function imgThumb(url: string | null | undefined): string {
	if (!url) return PLACEHOLDER_IMAGE;
	if (url.includes('res.cloudinary.com')) {
		// w_600,h_450,c_fill,f_auto,q_auto:eco
		return cloudinaryTransform(url, 'w_600,h_450,c_fill,f_auto,q_auto:eco');
	}
	return ikTransform(url, 'c-at_max,w-600,h-450,fo-auto,q-80,f-auto');
}

/** Thumbnail kecil (strip galeri). */
export function imgThumbSm(url: string | null | undefined): string {
	if (!url) return PLACEHOLDER_IMAGE;
	if (url.includes('res.cloudinary.com')) {
		return cloudinaryTransform(url, 'w_500,h_375,c_fill,f_auto,q_auto:eco');
	}
	return ikTransform(url, 'c-at_max,w-500,h-375,fo-auto,q-80,f-auto');
}

/** Gambar besar teroptimasi (banner/cover) tanpa crop paksa. */
export function imgCover(url: string | null | undefined): string {
	if (!url) return PLACEHOLDER_IMAGE;
	if (url.includes('res.cloudinary.com')) {
		return cloudinaryTransform(url, 'w_1600,f_auto,q_auto:good');
	}
	return ikTransform(url, 'w-1600,q-80,f-auto');
}

/** Gambar hero detail page — lebih kecil dari cover, cukup untuk ~800px wide column. */
export function imgHero(url: string | null | undefined): string {
	if (!url) return PLACEHOLDER_IMAGE;
	if (url.includes('res.cloudinary.com')) {
		return cloudinaryTransform(url, 'w_900,f_auto,q_auto:good');
	}
	return ikTransform(url, 'w-900,q-82,f-auto');
}

/**
 * Dapatkan auth params dari server untuk satu kali upload.
 */
async function getAuthParams(): Promise<{ token: string; expire: number; signature: string }> {
	const authRes = await fetch('/api/imagekit-auth');
	if (!authRes.ok) {
		throw new Error('Gagal mendapatkan parameter autentikasi upload.');
	}
	return authRes.json();
}

/**
 * Upload sebuah file ke ImageKit.
 * Alur:
 *   1. Fetch token/signature/expire dari server route /api/imagekit-auth (per file)
 *      (Private Key aman di server, tidak pernah ke browser).
 *   2. POST file langsung ke ImageKit API dari browser.
 * Mengembalikan url yang siap disimpan ke database.
 */
export async function uploadToImageKit(file: File): Promise<ImageKitResult> {
	if (!imagekitConfigured) {
		throw new Error(
			'ImageKit belum dikonfigurasi. Isi PUBLIC_IMAGEKIT_PUBLIC_KEY & PUBLIC_IMAGEKIT_URL_ENDPOINT di .env'
		);
	}

	// Dapatkan auth params segar untuk setiap file
	const { token, expire, signature } = await getAuthParams();

	// Upload langsung ke ImageKit dari browser
	const formData = new FormData();
	formData.append('file', file);
	formData.append('publicKey', IMAGEKIT_PUBLIC_KEY);
	formData.append('fileName', file.name);
	formData.append('token', token);
	formData.append('expire', String(expire));
	formData.append('signature', signature);

	const res = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
		method: 'POST',
		body: formData
	});

	if (!res.ok) {
		const err = await res.json().catch(() => ({}));
		throw new Error(err?.message ?? 'Upload ke ImageKit gagal.');
	}

	return (await res.json()) as ImageKitResult;
}

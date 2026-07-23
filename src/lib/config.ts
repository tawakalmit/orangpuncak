import { env } from '$env/dynamic/public';

export const SITE_NAME = 'orangpuncak.com';
export const SITE_TAGLINE = 'Media & Direktori Wisata Kawasan Puncak';
export const SITE_URL = env.PUBLIC_SITE_URL || 'https://orangpuncak.com';
export const WHATSAPP_NUMBER = env.PUBLIC_WHATSAPP_NUMBER || '6281234567890';
export const GA_MEASUREMENT_ID = env.PUBLIC_GA_MEASUREMENT_ID || '';

/** Gambar Open Graph default (fallback) untuk halaman tanpa gambar khusus.
 *  Untuk kompatibilitas maksimal di Facebook/LinkedIn, ganti dengan PNG/JPG 1200x630. */
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.svg`;

export const NAV_LINKS = [
	{ href: '/wisata', label: 'Wisata' },
	{ href: '/villa', label: 'Villa' },
	{ href: '/kuliner', label: 'Kuliner' },
	{ href: '/artikel', label: 'Artikel' },
	{ href: '/iklan', label: 'Pasang Iklan' }
];

export const SOCIAL_LINKS = [
	{ label: 'Instagram', href: 'https://www.instagram.com/orangpuncakdotcom', username: "orangpuncakdotcom" },
	{ label: 'TikTok', href: 'https://tiktok.com/@orangpuncak.com', username: "orangpuncak.com" }
	// { label: 'YouTube', href: 'https://youtube.com/@orangpuncak' }
];

export const LOKASI_OPTIONS = [
	'Cisarua',
	'Puncak Pass',
	'Cipanas',
	'Megamendung',
	'Pacet',
	'Sukaresmi',
	'Puncak Dua'
];

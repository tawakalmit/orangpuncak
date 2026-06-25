import { WHATSAPP_NUMBER } from '$lib/config';

/** Bangun deep link WhatsApp dengan pesan terisi otomatis. */
export function waLink(message: string, phone: string = WHATSAPP_NUMBER): string {
	const number = (phone || WHATSAPP_NUMBER).replace(/[^0-9]/g, '');
	return `https://api.whatsapp.com/send?phone=${number}&text=${encodeURIComponent(message)}`;
}

export type WaAction = 'Booking' | 'Konsultasi' | 'Survey' | 'Reservasi' | 'Info';

/** Pesan WhatsApp untuk villa, menyertakan kode villa. */
export function villaWaMessage(action: WaAction, kode: string, name: string): string {
	const base = `Halo orangpuncak.com, saya tertarik dengan villa *${name}* (kode: ${kode}).`;
	switch (action) {
		case 'Booking':
			return `${base} Saya ingin *booking*. Mohon info ketersediaan & harga.`;
		case 'Konsultasi':
			return `${base} Saya ingin *konsultasi* lebih lanjut.`;
		case 'Survey':
			return `${base} Saya ingin menjadwalkan *survey* lokasi.`;
		default:
			return base;
	}
}

/** Pesan WhatsApp generik untuk wisata/kuliner. */
export function itemWaMessage(typeLabel: string, name: string, kode?: string): string {
	const k = kode ? ` (kode: ${kode})` : '';
	return `Halo orangpuncak.com, saya ingin info/reservasi untuk ${typeLabel} *${name}*${k}.`;
}

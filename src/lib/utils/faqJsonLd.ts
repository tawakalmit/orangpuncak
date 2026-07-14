import type { Article, Place } from '$lib/types';
import { formatRupiah } from './format';

interface FaqItem {
	'@type': 'Question';
	name: string;
	acceptedAnswer: { '@@type': 'Answer'; text: string } | { '@type': 'Answer'; text: string };
}

function faq(question: string, answer: string) {
	return {
		'@type': 'Question' as const,
		name: question,
		acceptedAnswer: { '@type': 'Answer' as const, text: answer }
	};
}

function buildFaqLd(items: ReturnType<typeof faq>[]) {
	if (items.length === 0) return null;
	return {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: items
	};
}

export function wisataFaqJsonLd(p: Place) {
	const items: ReturnType<typeof faq>[] = [];

	if (p.jam_buka) {
		items.push(faq(
			`${p.name} buka jam berapa?`,
			`${p.name} buka pada jam ${p.jam_buka}.`
		));
	}

	if (p.harga_tiket) {
		items.push(faq(
			`Berapa harga tiket masuk ${p.name}?`,
			`Harga tiket masuk ${p.name} adalah ${p.harga_tiket}.`
		));
	}

	if (p.address) {
		items.push(faq(
			`Di mana lokasi ${p.name}?`,
			`${p.name} berlokasi di ${p.address}${p.lokasi ? `, kawasan ${p.lokasi}` : ''}.`
		));
	}

	if (p.tips) {
		items.push(faq(
			`Apa tips berkunjung ke ${p.name}?`,
			p.tips
		));
	}

	if (p.description) {
		items.push(faq(
			`Apa itu ${p.name}?`,
			p.description
		));
	}

	return buildFaqLd(items);
}

export function kulinerFaqJsonLd(p: Place) {
	const items: ReturnType<typeof faq>[] = [];

	if (p.jam_buka) {
		items.push(faq(
			`${p.name} buka jam berapa?`,
			`${p.name} buka pada jam ${p.jam_buka}.`
		));
	}

	if (p.harga_range) {
		items.push(faq(
			`Berapa kisaran harga makan di ${p.name}?`,
			`Kisaran harga di ${p.name} adalah ${p.harga_range} per orang.`
		));
	}

	if (p.address) {
		items.push(faq(
			`Di mana lokasi ${p.name}?`,
			`${p.name} berlokasi di ${p.address}${p.lokasi ? `, kawasan ${p.lokasi}` : ''}.`
		));
	}

	if (p.category) {
		items.push(faq(
			`${p.name} menyajikan masakan apa?`,
			`${p.name} menyajikan masakan ${p.category}.`
		));
	}

	if (p.description) {
		items.push(faq(
			`Apa keistimewaan ${p.name}?`,
			p.description
		));
	}

	return buildFaqLd(items);
}

export function villaFaqJsonLd(p: Place) {
	const items: ReturnType<typeof faq>[] = [];

	if (p.status === 'disewakan' && (p.harga_sewa_weekday || p.harga_sewa_weekend)) {
		const weekday = p.harga_sewa_weekday ? formatRupiah(p.is_promo && p.promo_harga_sewa_weekday ? p.promo_harga_sewa_weekday : p.harga_sewa_weekday) : null;
		const weekend = p.harga_sewa_weekend ? formatRupiah(p.is_promo && p.promo_harga_sewa_weekend ? p.promo_harga_sewa_weekend : p.harga_sewa_weekend) : null;
		const hargaText = [weekday && `weekday ${weekday}`, weekend && `weekend ${weekend}`].filter(Boolean).join(', ');
		items.push(faq(
			`Berapa harga sewa ${p.name}?`,
			`Harga sewa ${p.name} per malam: ${hargaText}.`
		));
	}

	if (p.status === 'dijual' && p.harga_jual) {
		const harga = formatRupiah(p.is_promo && p.harga_promo ? p.harga_promo : p.harga_jual);
		items.push(faq(
			`Berapa harga jual ${p.name}?`,
			`${p.name} dijual dengan harga ${harga}.`
		));
	}

	if (p.kapasitas) {
		items.push(faq(
			`${p.name} bisa menampung berapa orang?`,
			`${p.name} memiliki kapasitas maksimal ${p.kapasitas} orang.`
		));
	}

	if (p.jumlah_kamar_tidur) {
		items.push(faq(
			`${p.name} memiliki berapa kamar tidur?`,
			`${p.name} memiliki ${p.jumlah_kamar_tidur} kamar tidur dan ${p.jumlah_kamar_mandi ?? '-'} kamar mandi.`
		));
	}

	if (p.address) {
		items.push(faq(
			`Di mana lokasi ${p.name}?`,
			`${p.name} berlokasi di ${p.address}${p.lokasi ? `, kawasan ${p.lokasi}` : ''}.`
		));
	}

	const fascList: string[] = [];
	const fac = p.facilities ?? {};
	if (fac.kolam_renang) fascList.push('kolam renang');
	if (fac.wifi) fascList.push('wifi');
	if (fac.ac) fascList.push('AC');
	if (fac.karaoke) fascList.push('karaoke');
	if (fac.barbeque) fascList.push('area barbeque');
	if (fac.billiard) fascList.push('meja billiard');
	if (fascList.length) {
		items.push(faq(
			`Apa saja fasilitas yang tersedia di ${p.name}?`,
			`Fasilitas yang tersedia di ${p.name} antara lain: ${fascList.join(', ')}.`
		));
	}

	if (p.description) {
		items.push(faq(
			`Apa keunggulan ${p.name}?`,
			p.description
		));
	}

	return buildFaqLd(items);
}

export function artikelFaqJsonLd(article: Article) {
	const items: ReturnType<typeof faq>[] = [];

	if (article.excerpt) {
		items.push(faq(
			`Apa yang dibahas dalam artikel "${article.title}"?`,
			article.excerpt
		));
	}

	if (article.tags?.length) {
		items.push(faq(
			`Topik apa saja yang relevan dengan artikel ini?`,
			`Artikel ini membahas topik: ${article.tags.join(', ')}.`
		));
	}

	return buildFaqLd(items);
}

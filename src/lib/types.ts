export type PlaceType = 'wisata' | 'villa' | 'kuliner';
export type VillaStatus = 'disewakan' | 'dijual';

export interface Category {
	id: string;
	name: string;
	slug: string;
	type: PlaceType;
}

export interface VillaFacilities {
	wifi?: boolean;
	kolam_renang?: boolean;
	billiard?: boolean;
	karaoke?: boolean;
	barbeque?: boolean;
	ac?: boolean;
	alat_dapur_dan_kitchen_set?: boolean;
	gas_dan_kompor?: boolean;
	rice_cooker?: boolean;
	dispenser?: boolean;
	smart_tv?: boolean;
	balkon?: boolean;
	teras?: boolean;
	halaman?: boolean;
	living_room?: boolean;
	car_port?: boolean;
	gazebo?: boolean;
	dapur?: boolean;
	tenis_meja?: boolean;
}

export interface Place {
	id: string;
	kode: string;
	name: string;
	slug: string;
	meta_title?: string | null;
	category_id?: string | null;
	category?: string | null;
	categories?: string[] | null;
	type: PlaceType;
	status?: VillaStatus | null;
	description?: string | null;
	content?: string | null;
	lokasi?: string | null;
	address?: string | null;
	lat?: number | null;
	lng?: number | null;
	cover_image?: string | null;
	gallery?: string[] | null;
	video?: string | null;
	whatsapp?: string | null;
	is_promo?: boolean;
	is_featured?: boolean;

	// villa pricing
	harga_sewa_weekday?: number | null;
	harga_sewa_weekend?: number | null;
	promo_harga_sewa_weekday?: number | null;
	promo_harga_sewa_weekend?: number | null;
	harga_jual?: number | null;
	harga_promo?: number | null;

	// villa spec
	jumlah_kamar_tidur?: number | null;
	jumlah_kamar_mandi?: number | null;
	jumlah_lantai?: number | null;
	kapasitas?: number | null;
	luas_tanah?: number | null;
	luas_bangunan?: number | null;
	kamar_art?: number | null;
	shm?: boolean | null;

	facilities?: VillaFacilities | null;

	// nearby
	nearby_villa_ids?: string[] | null;
	nearby_wisata_ids?: string[] | null;
	nearby_kuliner_ids?: string[] | null;

	// wisata / kuliner
	jam_buka?: string | null;
	harga_tiket?: string | null;
	harga_range?: string | null;
	tips?: string | null;

	created_at?: string;
	updated_at?: string;
}

export interface Article {
	id: string;
	title: string;
	slug: string;
	excerpt?: string | null;
	content?: string | null;
	cover_image?: string | null;
	tags?: string[] | null;
	published_at?: string | null;
	created_at?: string;
	updated_at?: string;
}

export interface AdLead {
	business_name: string;
	contact_name: string;
	phone: string;
	email?: string | null;
	package: string;
	message?: string | null;
}

export interface VillaFilter {
	q?: string;
	lokasi?: string;
	jumlah_kamar?: number;
	status?: VillaStatus;
	facilities?: (keyof VillaFacilities)[];
}

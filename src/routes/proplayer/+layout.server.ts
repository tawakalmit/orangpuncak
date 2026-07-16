import { cloudinaryConfigured } from '$lib/utils/cloudinary';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const user = await locals.getUser();
	return {
		userEmail: user?.email ?? null,
		cloudinaryConfigured
	};
};

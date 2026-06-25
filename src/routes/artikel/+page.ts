import { getArticles } from '$lib/data';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	const articles = await getArticles();
	return { articles };
};

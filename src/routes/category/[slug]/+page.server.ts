import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getCategoryBySlug, getInnovatorPostsByCategory } from '$lib/api';

export const load: PageServerLoad = async ({ params }) => {
	const slug = params.slug;

	const category = await getCategoryBySlug(slug);
	if (!category) {
		throw error(404, 'Category not found');
	}

	const posts = await getInnovatorPostsByCategory(category.id, { per_page: 30, order: 'desc' });

	return {
		category,
		posts
	};
};

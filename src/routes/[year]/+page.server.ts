import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getInnovatorPosts } from '$lib/api';

export const load: PageServerLoad = async ({ params }) => {
	const year = Number.parseInt(params.year, 10);
	if (!Number.isFinite(year) || year < 1970 || year > 3000) {
		throw error(404, 'Invalid year');
	}

	const start = new Date(Date.UTC(year, 0, 1, 0, 0, 0));
	const end = new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999));

	const posts = await getInnovatorPosts({
		order: 'desc',
		per_page: 100,
		after: start.toISOString(),
		before: end.toISOString()
	});

	return {
		year,
		posts
	};
};

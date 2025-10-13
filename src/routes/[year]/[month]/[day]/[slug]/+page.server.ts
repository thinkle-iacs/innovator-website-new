import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getInnovatorPosts } from '$lib/api';

export const load: PageServerLoad = async ({ params }) => {
	const { slug, year, month, day } = params;

	const posts = await getInnovatorPosts({ slug, per_page: 1 });
	const post = posts[0];

	if (!post) {
		// If the slug is missing or invalid, fall back to the date archive.
		if (year && month && day) {
			throw redirect(302, `/${year}/${month}/${day}`);
		}
		throw error(404, 'Post not found');
	}

	return {
		post
	};
};

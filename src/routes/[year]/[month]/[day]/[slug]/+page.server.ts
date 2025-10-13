import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getInnovatorPosts } from '$lib/api';

export const load: PageServerLoad = async ({ params }) => {
	const { slug } = params;

	const posts = await getInnovatorPosts({ slug, per_page: 1 });
	const post = posts[0];

	if (!post) {
		throw error(404, 'Post not found');
	}

	return {
		post
	};
};

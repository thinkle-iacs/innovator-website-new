import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getTagBySlug, getInnovatorPostsByTag } from '$lib/api';

export const load: PageServerLoad = async ({ params }) => {
	const slug = params.tag;

	const tag = await getTagBySlug(slug);
	if (!tag) {
		throw error(404, 'Tag not found');
	}

	const posts = await getInnovatorPostsByTag(tag.id, { per_page: 20 });

	return {
		tag,
		posts
	};
};

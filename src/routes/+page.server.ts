import type { PageServerLoad } from './$types';
import { getFrontPagePosts } from '$lib/api';
import type { FrontPagePosts } from '$lib/api';

export const load: PageServerLoad = async () => {
	try {
		const frontPage: FrontPagePosts = await getFrontPagePosts();
		return { frontPage };
	} catch (err) {
		// Return a friendly message, but keep the error for server logs.
		//console.error('Failed fetching posts from WP API', err);
		console.error('Error fetching front page: ', err);
		return {
			frontPage: {
				currentYear: { highlighted: [], others: [] },
				prevYears: []
			}
		};
	}
};

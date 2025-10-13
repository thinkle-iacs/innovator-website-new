import type { PageServerLoad } from './$types';
import {
	FRONT_PAGE_PAGE_SIZE,
	getInnovatorPostsPaginated,
	partitionFrontPagePosts
} from '$lib/api';
import type { FrontPagePosts, PaginatedInnovatorPosts, InnovatorPost } from '$lib/api';

export const load: PageServerLoad = async () => {
	try {
		const paginated: PaginatedInnovatorPosts = await getInnovatorPostsPaginated({
			per_page: FRONT_PAGE_PAGE_SIZE,
			page: 1
		});
		const frontPage: FrontPagePosts = partitionFrontPagePosts(paginated.posts);

		return {
			frontPage,
			initialPosts: paginated.posts,
			pagination: {
				page: paginated.page,
				perPage: paginated.perPage,
				total: paginated.total,
				totalPages: paginated.totalPages,
				hasMore: paginated.hasMore
			}
		};
	} catch (err) {
		// Return a friendly message, but keep the error for server logs.
		//console.error('Failed fetching posts from WP API', err);
		console.error('Error fetching front page: ', err);
		return {
			frontPage: {
				currentYear: { highlighted: [], others: [] },
				prevYears: []
			},
			initialPosts: [] as InnovatorPost[],
			pagination: {
				page: 1,
				perPage: FRONT_PAGE_PAGE_SIZE,
				total: 0,
				totalPages: 0,
				hasMore: false
			}
		};
	}
};

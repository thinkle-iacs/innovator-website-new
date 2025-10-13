import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { FRONT_PAGE_PAGE_SIZE, getInnovatorPostsPaginated } from '$lib/api';

function parsePositiveInt(value: string | null, fallback: number): number {
	if (!value) return fallback;
	const parsed = Number.parseInt(value, 10);
	return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export const GET: RequestHandler = async ({ url }) => {
	const page = parsePositiveInt(url.searchParams.get('page'), 1);
	const perPage = parsePositiveInt(url.searchParams.get('per_page'), FRONT_PAGE_PAGE_SIZE);

	try {
		const result = await getInnovatorPostsPaginated({
			page,
			per_page: perPage
		});
		return json(result);
	} catch (err) {
		console.error('Error fetching paginated posts', err);
		return json(
			{ error: 'Failed to load posts. Please try again later.' },
			{
				status: 500
			}
		);
	}
};

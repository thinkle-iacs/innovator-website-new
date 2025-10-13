import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getInnovatorPosts } from '$lib/api';

function parseMonth(month: string): number | null {
	const value = Number.parseInt(month, 10);
	if (!Number.isFinite(value) || value < 1 || value > 12) return null;
	return value;
}

export const load: PageServerLoad = async ({ params }) => {
	const year = Number.parseInt(params.year, 10);
	const month = parseMonth(params.month);

	if (!Number.isFinite(year) || year < 1970 || year > 3000 || month == null) {
		throw error(404, 'Invalid date');
	}

	const start = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
	const end = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

	const posts = await getInnovatorPosts({
		order: 'desc',
		per_page: 50,
		after: start.toISOString(),
		before: end.toISOString()
	});

	return {
		year,
		month,
		posts
	};
};

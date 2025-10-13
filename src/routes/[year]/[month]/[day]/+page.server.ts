import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getInnovatorPosts } from '$lib/api';

function parsePart(value: string, min: number, max: number): number | null {
	const parsed = Number.parseInt(value, 10);
	if (!Number.isFinite(parsed) || parsed < min || parsed > max) return null;
	return parsed;
}

export const load: PageServerLoad = async ({ params }) => {
	const year = parsePart(params.year, 1970, 3000);
	const month = parsePart(params.month, 1, 12);
	const day = parsePart(params.day, 1, 31);

	if (year == null || month == null || day == null) {
		throw error(404, 'Invalid date');
	}

	const start = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
	const end = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));

	const posts = await getInnovatorPosts({
		order: 'desc',
		per_page: 20,
		after: start.toISOString(),
		before: end.toISOString()
	});

	return {
		year,
		month,
		day,
		posts
	};
};

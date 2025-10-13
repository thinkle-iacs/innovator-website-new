import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getInnovatorPostsBySchoolYear, schoolYearBounds } from '$lib/api';

export const load: PageServerLoad = async ({ params }) => {
	const { year } = params;

	try {
		// Validate the year format; we only care if it throws.
		schoolYearBounds(year);
	} catch (err) {
		throw error(404, 'Invalid school year');
	}

	const posts = await getInnovatorPostsBySchoolYear(year);

	return {
		year,
		posts
	};
};

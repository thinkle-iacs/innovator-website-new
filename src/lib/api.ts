/* A convenience wrapper around the raw WP API */

import type { WPPost, WPPostsQuery, WPCategory, WPUser } from '$lib/wp-api';
import { getPosts, getPost, getCategories, getUser } from '$lib/wp-api';

interface InnovatorPost {
	// Core content fields (extracted for convenience)
	content: string;
	excerpt: string;
	title: string;
	id: number;
	author: { id: number; name: string; slug: string };
	// Enhanced fields
	relativeLink?: string;
	categoryNames?: string[];
	dateline: string;
	byline: string;
	schoolYear: string;

	// Reference to original WP post
	wpPostObject: WPPost;

	// Optional media fields
	featuredVideo?: string;
	featuredImage?: string;
}

// Cache for categories to avoid repeated API calls
let categoriesCache: WPCategory[] | null = null;
let categoriesPromise: Promise<WPCategory[]> | null = null;

// Cache for authors to avoid repeated API calls
const authorsCache: Map<number, { id: number; name: string; slug: string }> = new Map();

// Author name overrides for known posts
const authorOverrides: Record<number, string> = {
	1004: 'The Innovator Staff' // "The Innovator's First Video Edition"
	// Add more post IDs and their correct author names here
	// 999: "Another Author",
	// 996: "Yet Another Author",
};

interface EmbeddedAuthor {
	id: number;
	name: string;
	slug?: string;
	url?: string;
	description?: string;
	link?: string;
	avatar_urls?: Record<string, string>;
	_links?: Record<string, unknown>;
}

/**
 * Get author data by ID with caching and embedded data support
 */
async function getAuthorCached(
	authorId: number,
	postId?: number,
	embeddedAuthor?: EmbeddedAuthor
): Promise<{ id: number; name: string; slug: string }> {
	// If we have embedded author data (from Molongui), use it first
	if (embeddedAuthor && embeddedAuthor.name) {
		return {
			id: authorId,
			name: embeddedAuthor.name,
			slug: embeddedAuthor.slug || embeddedAuthor.name.toLowerCase().replace(/\s+/g, '-')
		};
	}

	// Check for post-specific author override
	if (postId && authorOverrides[postId]) {
		return {
			id: authorId,
			name: authorOverrides[postId],
			slug: authorOverrides[postId].toLowerCase().replace(/\s+/g, '-')
		};
	}

	if (authorsCache.has(authorId)) {
		return authorsCache.get(authorId)!;
	}

	try {
		const author: WPUser = await getUser(authorId);
		const authorData = { id: author.id, name: author.name, slug: author.slug };
		authorsCache.set(authorId, authorData);
		return authorData;
	} catch (error) {
		console.warn(`Could not fetch author ${authorId}:`, error);
		return { id: authorId, name: `Author ${authorId}`, slug: `author-${authorId}` };
	}
}

/**
 * Extract URL path from a full URL
 */
function extractPathFromUrl(url: string): string {
	try {
		const urlObj = new URL(url);
		return urlObj.pathname;
	} catch {
		// Fallback: try to extract path from theinnovator.org URLs
		const match = url.match(/https:\/\/theinnovator\.org(\/.*)/);
		return match ? match[1] : url;
	}
}

/**
 * Extract the first embedded video URL from post content.
 * Currently focuses on iframe embeds (e.g. YouTube).
 */
function extractFeaturedVideoUrl(html: string): string | undefined {
	const iframeMatch = html.match(/<iframe[^>]+src=["']([^"']+)["'][^>]*>/i);
	if (!iframeMatch) return undefined;

	const rawSrc = iframeMatch[1].trim();
	if (!rawSrc) return undefined;

	// Handle protocol-relative URLs
	const normalizedSrc = rawSrc.startsWith('//') ? `https:${rawSrc}` : rawSrc;

	try {
		const url = new URL(normalizedSrc);
		if (url.protocol === 'http:' || url.protocol === 'https:') {
			return url.toString();
		}
	} catch {
		// If URL constructor fails (e.g. relative path), fall back to the raw value.
		return normalizedSrc;
	}

	return undefined;
}

export function schoolYearFromDate(date: Date): string {
	const month = date.getMonth(); // 0-indexed; July is 6
	const startYear = month >= 6 ? date.getFullYear() : date.getFullYear() - 1;
	const endYear = startYear + 1;
	const formatYear = (year: number) => String(year).slice(-2).padStart(2, '0');
	return `${formatYear(startYear)}-${formatYear(endYear)}`;
}

/**
 * Extract URL from HTML anchor tag
 * Example: <a href="https://example.com/path">text</a> -> /path
 * @param html - HTML string containing anchor tags
 * @returns The extracted path or null if no anchor found
 */
// function extractPathFromAnchor(html: string): string | null {
// 	const anchorMatch = html.match(/<a[^>]+href=["']([^"']+)["'][^>]*>/i);
// 	if (anchorMatch) {
// 		return extractPathFromUrl(anchorMatch[1]);
// 	}
// 	return null;
// }

/**
 * Get all categories with caching
 */
async function getCategoriesCached(): Promise<WPCategory[]> {
	if (categoriesCache) {
		return categoriesCache;
	}

	if (categoriesPromise) {
		return categoriesPromise;
	}

	categoriesPromise = getCategories({ per_page: 100 }).then((cats: WPCategory[]) => {
		categoriesCache = cats;
		return cats;
	});

	return categoriesPromise;
}

/**
 * Transform a WP post into our convenient InnovatorPost format
 * This function enriches the post with additional computed fields
 */
async function toInnovatorPost(post: WPPost): Promise<InnovatorPost> {
	const relativeLink = extractPathFromUrl(post.link);

	// Get category names for this post
	const categories = await getCategoriesCached();
	const categoryNames = post.categories
		.map((catId) => categories.find((cat) => cat.id === catId)?.name)
		.filter(Boolean) as string[];

	const publishedDate = new Date(post.date);
	const dateline = publishedDate.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
	const schoolYear = schoolYearFromDate(publishedDate);
	const featuredVideo = extractFeaturedVideoUrl(post.content.rendered);

	// Extract embedded author data if available (from Molongui Authorship plugin)
	const embeddedAuthor = post._embedded?.author?.[0];

	// Look up author information
	const author = await getAuthorCached(post.author, post.id, embeddedAuthor);
	const byline = author.name == 'admin' ? 'Innovator Staff' : author.name;

	return {
		content: post.content.rendered,
		excerpt: post.excerpt.rendered,
		title: post.title.rendered,
		author,
		id: post.id,
		relativeLink,
		categoryNames,
		wpPostObject: post,
		dateline,
		byline,
		schoolYear,
		featuredVideo
	};
}

/**
 * Get posts with convenience transformations
 */
export const getInnovatorPosts = async (query: WPPostsQuery): Promise<InnovatorPost[]> => {
	const basePosts = await getPosts(query);

	// Molongui only injects guest author data when fetching single posts or when per_page=1.
	// Re-fetch each post individually (in parallel) to guarantee we get the enriched author info.
	const postsWithEmbeddedAuthors = await Promise.all(
		basePosts.map(async (post) => {
			try {
				return await getPost(post.id);
			} catch (error) {
				console.warn(`Falling back to list payload for post ${post.id}`, error);
				return post;
			}
		})
	);

	return Promise.all(postsWithEmbeddedAuthors.map(toInnovatorPost));
};

/**
 * Get a single post with convenience transformations
 */
export const getInnovatorPost = async (id: number | string): Promise<InnovatorPost> => {
	const post = await getPost(id);
	return toInnovatorPost(post);
};

/**
 * Get categories (cached)
 */
export const getInnovatorCategories = getCategoriesCached;

/**
 * Utility function to extract paths from HTML content
 * Useful if you have HTML content with links you want to process
 */
export const extractPathsFromHtml = (html: string): string[] => {
	const anchorRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>/gi;
	const paths: string[] = [];
	let match;

	while ((match = anchorRegex.exec(html)) !== null) {
		const path = extractPathFromUrl(match[1]);
		if (path && path !== '/') {
			paths.push(path);
		}
	}

	return paths;
};

export const currentSchoolYear = schoolYearFromDate(new Date());

export type FrontPagePosts = {
	currentYear: { highlighted: InnovatorPost[]; others: InnovatorPost[] };
	prevYears: { highlighted: InnovatorPost[]; others: InnovatorPost[] };
};

// Get posts from *this school year* for front page, with "highlighted" posts first
export const getFrontPagePosts = async (): Promise<FrontPagePosts> => {
	const posts = await getInnovatorPosts({ per_page: 30 });
	const thisYear = posts.filter((p) => p.schoolYear === currentSchoolYear);
	const prevYears = posts.filter((p) => p.schoolYear !== currentSchoolYear);
	return {
		currentYear: {
			highlighted: thisYear.filter((p) => p.categoryNames?.includes('Highlighted')),
			others: thisYear.filter((p) => !p.categoryNames?.includes('Highlighted'))
		},
		prevYears: {
			highlighted: prevYears.filter((p) => p.categoryNames?.includes('Highlighted')),
			others: prevYears.filter((p) => !p.categoryNames?.includes('Highlighted'))
		}
	};
};

// Re-export the raw WP functions for when you need them
export { getPosts, getPost, getPages, getCategories } from '$lib/wp-api';
export type { WPPost, WPPostsQuery, WPCategory } from '$lib/wp-api';

// Export our enhanced types
export type { InnovatorPost };

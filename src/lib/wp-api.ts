import { env } from '$env/dynamic/public';

// WordPress REST API Types
export interface WPRenderedContent {
	rendered: string;
	protected?: boolean;
}

export interface WPGuid {
	rendered: string;
}

export interface WPMeta {
	episode_type?: string;
	audio_file?: string;
	cover_image?: string;
	cover_image_id?: string;
	duration?: string;
	filesize?: string;
	date_recorded?: string;
	explicit?: string;
	block?: string;
	itunes_episode_number?: string;
	itunes_title?: string;
	itunes_season_number?: string;
	itunes_episode_type?: string;
	filesize_raw?: string;
	footnotes?: string;
}

export interface WPFeaturedImageCaption {
	caption_text: string;
	source_text: string;
	source_url: string;
}

export interface WPFeaturedMedia {
	id: number;
	date: string;
	slug: string;
	type: string;
	link: string;
	title: WPRenderedContent;
	author: number;
	alt_text: string;
	caption: WPRenderedContent;
	description: WPRenderedContent;
	media_type: string;
	mime_type: string;
	media_details?: {
		width?: number;
		height?: number;
		file?: string;
		sizes?: Record<
			string,
			{
				file: string;
				width: number;
				height: number;
				mime_type: string;
				source_url: string;
			}
		>;
	};
	source_url: string;
	[key: string]: unknown;
}

export interface WPLink {
	href: string;
	targetHints?: {
		allow: string[];
	};
	embeddable?: boolean;
	taxonomy?: string;
	name?: string;
	templated?: boolean;
	count?: number;
	id?: number;
}

export interface WPLinks {
	self: WPLink[];
	collection: WPLink[];
	about: WPLink[];
	author: WPLink[];
	replies: WPLink[];
	'version-history'?: WPLink[];
	'predecessor-version'?: WPLink[];
	'wp:attachment'?: WPLink[];
	'wp:term'?: WPLink[];
	curies?: WPLink[];
}

export interface WPCategory {
	id: number;
	count: number;
	description: string;
	link: string;
	name: string;
	slug: string;
	taxonomy: string;
	parent: number;
	meta: unknown[];
	_links: unknown;
}

export interface WPTag {
	id: number;
	count: number;
	description: string;
	link: string;
	name: string;
	slug: string;
	taxonomy: string;
	parent: number;
	meta: unknown[];
	_links: unknown;
}

export interface WPPost {
	id: number;
	date: string;
	date_gmt: string;
	guid: WPGuid;
	modified: string;
	modified_gmt: string;
	slug: string;
	status: 'publish' | 'draft' | 'pending' | 'private' | 'future';
	type: 'post' | 'page';
	link: string;
	title: WPRenderedContent;
	content: WPRenderedContent;
	excerpt: WPRenderedContent;
	author: number;
	featured_media: number;
	comment_status: 'open' | 'closed';
	ping_status: 'open' | 'closed';
	sticky: boolean;
	template: string;
	format:
		| 'standard'
		| 'aside'
		| 'chat'
		| 'gallery'
		| 'link'
		| 'image'
		| 'quote'
		| 'status'
		| 'video'
		| 'audio';
	meta: WPMeta;
	categories: number[];
	tags: number[];
	class_list: string[];
	cc_featured_image_caption: WPFeaturedImageCaption;
	_links: WPLinks;
	_embedded?: {
		author?: Array<{
			id: number;
			name: string;
			slug?: string;
			url?: string;
			description?: string;
			link?: string;
			avatar_urls?: Record<string, string>;
			_links?: Record<string, unknown>;
		}>;
		'wp:featuredmedia'?: WPFeaturedMedia[];
	};
}

export interface WPPostsQuery {
	page?: number;
	per_page?: number;
	search?: string;
	after?: string;
	before?: string;
	author?: number | number[];
	author_exclude?: number | number[];
	offset?: number;
	order?: 'asc' | 'desc';
	orderby?:
		| 'author'
		| 'date'
		| 'id'
		| 'include'
		| 'modified'
		| 'parent'
		| 'relevance'
		| 'slug'
		| 'include_slugs'
		| 'title';
	slug?: string | string[];
	status?: string | string[];
	categories?: number | number[];
	categories_exclude?: number | number[];
	tags?: number | number[];
	tags_exclude?: number | number[];
	sticky?: boolean;
	_embed?: string | string[] | boolean;
	[key: string]: unknown;
}

export interface WPUser {
	id: number;
	name: string;
	slug: string;
	description?: string;
	url?: string;
	link?: string;
	avatar_urls?: Record<string, string>;
	meta?: unknown[];
	[key: string]: unknown;
}

// Centralised API base for the WordPress REST API. Set this in your env as
// PUBLIC_WP_API_BASE (example in project root .env or .env.example).
const BASE = (env.PUBLIC_WP_API_BASE || 'https://theinnovator.org/wp-json').replace(/\/+$/u, '');
const DEFAULT_EMBEDS: Array<string> = ['author', 'wp:featuredmedia'];

function joinPath(base: string, path: string) {
	if (!path) return base;
	const cleaned = path.replace(/^\/+|\/+$/gu, '');
	return `${base}/${cleaned}`;
}

async function apiFetch(path: string, options?: RequestInit) {
	const url = path.match(/^https?:\/\//u) ? path : joinPath(BASE, path);

	const res = await fetch(url, options);
	if (!res.ok) {
		// include body (if any) for easier debugging
		let body = '';
		try {
			body = await res.text();
		} catch {
			/* ignore */
		}
		throw new Error(`API request failed: ${res.status} ${res.statusText} - ${body}`);
	}
	return res.json();
}

function qs(obj: Record<string, unknown> | URLSearchParams | undefined) {
	if (!obj) return '';
	if (obj instanceof URLSearchParams) return `?${obj.toString()}`;
	const params = new URLSearchParams();
	for (const [k, v] of Object.entries(obj)) {
		if (v == null) continue;
		if (Array.isArray(v)) {
			for (const value of v) {
				if (value == null) continue;
				params.append(k, String(value));
			}
		} else {
			params.append(k, String(v));
		}
	}
	const s = params.toString();
	return s ? `?${s}` : '';
}

function withDefaultEmbed(
	query: Record<string, unknown> | undefined,
		defaultEmbed: string | string[]
	): Record<string, unknown> {
		const params = { ...(query ?? {}) };
		if (params._embed == null) {
			params._embed = defaultEmbed;
		}
	return params;
}

// Convenience helpers for common WP endpoints. You can expand these as needed.
export async function getPosts(query?: WPPostsQuery): Promise<WPPost[]> {
	const queryWithEmbed = withDefaultEmbed(query as Record<string, unknown> | undefined, DEFAULT_EMBEDS);
	return apiFetch(`wp/v2/posts${qs(queryWithEmbed)}`);
}

export async function getPost(
	id: number | string,
	query?: Record<string, unknown>
): Promise<WPPost> {
	const queryWithEmbed = withDefaultEmbed(query, DEFAULT_EMBEDS);
	return apiFetch(`wp/v2/posts/${id}${qs(queryWithEmbed)}`);
}

export async function getPages(query?: WPPostsQuery): Promise<WPPost[]> {
	const q = qs(query);
	return apiFetch(`wp/v2/pages${q}`);
}

export async function getCategories(query?: Record<string, unknown>): Promise<WPCategory[]> {
	const q = qs(query);
	return apiFetch(`wp/v2/categories${q}`);
}

export async function getTags(query?: Record<string, unknown>): Promise<WPTag[]> {
	const q = qs(query);
	return apiFetch(`wp/v2/tags${q}`);
}

export async function getUser(id: number | string): Promise<WPUser> {
	return apiFetch(`wp/v2/users/${id}`);
}

export default {
	apiFetch,
	getPosts,
	getPost,
	getPages,
	getCategories,
	getTags,
	getUser
};

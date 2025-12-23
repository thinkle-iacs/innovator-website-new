/**
 * Report a post view to the backend, with client-side deduplication via localStorage.
 *
 * Safe to call multiple times - only reports once per post per browser.
 * Network failures are silently ignored.
 */

const STORAGE_KEY = 'headless_seen_posts_v1';
const ENDPOINT = 'https://wp.theinnovator.org/wp-json/headless/v1/view';

/**
 * Load the set of post IDs that have already been reported from localStorage.
 */
function getSeenPosts(): Set<number> {
	try {
		const stored = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
		if (!stored) return new Set();
		const parsed = JSON.parse(stored);
		return new Set(Array.isArray(parsed) ? parsed : []);
	} catch {
		return new Set();
	}
}

/**
 * Save the set of seen post IDs to localStorage.
 */
function saveSeenPosts(ids: Set<number>): void {
	try {
		if (typeof window !== 'undefined') {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(ids)));
		}
	} catch {
		// Silently ignore storage errors (quota exceeded, etc.)
	}
}

/**
 * Report a post view to the backend.
 *
 * @param postId - The WordPress post ID to report
 */
export async function reportView(postId: number): Promise<void> {
	// Server-side safety check
	console.log('Report view', postId);
	if (typeof window === 'undefined') return;

	const seen = getSeenPosts();

	// Already reported in this browser
	if (seen.has(postId)) return;

	// Mark as seen immediately to prevent duplicate requests
	seen.add(postId);
	saveSeenPosts(seen);

	// Fire and forget - retry on network failures
	try {
		console.log('Not reported yet, firing request');
		await fetch(ENDPOINT, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ postId })
		});
	} catch (error) {
		// Log error and mark as unseen so we'll retry on next visit
		console.error(`Failed to report view for post ${postId}:`, error);
		seen.delete(postId);
		saveSeenPosts(seen);
	}
}

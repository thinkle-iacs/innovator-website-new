<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import type { PageProps } from './$types';
	import Mission from '$lib/components/Mission.svelte';
	import PastIssues from '$lib/components/PastIssues.svelte';
	import Snippet from '$lib/components/Snippet.svelte';
	import { partitionFrontPagePosts } from '$lib/api';
	import type {
		FrontPagePosts,
		InnovatorPost,
		PaginatedInnovatorPosts
	} from '$lib/api';

	type PaginationState = Omit<PaginatedInnovatorPosts, 'posts'>;

	let { data }: PageProps = $props();

	let frontPage = $state<FrontPagePosts>(data.frontPage);
	let posts = $state<InnovatorPost[]>([...data.initialPosts]);
	let pagination = $state<PaginationState>(data.pagination);
	let isLoading = $state(false);
	let loadError = $state<string | null>(null);

	let sentinel = $state<HTMLDivElement | null>(null);
	let observer = $state<IntersectionObserver | null>(null);
	let lastObservedSentinel = $state<HTMLDivElement | null>(null);

	async function loadMore() {
		if (isLoading || !pagination?.hasMore) return;
		isLoading = true;
		loadError = null;

		const nextPage = pagination.page + 1;

		try {
			const response = await fetch(`/api/posts?page=${nextPage}&per_page=${pagination.perPage}`);
			if (!response.ok) {
				throw new Error(`Failed to load more posts (${response.status})`);
			}

			const payload: PaginatedInnovatorPosts = await response.json();

			if (payload.posts.length > 0) {
				posts = [...posts, ...payload.posts];
				frontPage = partitionFrontPagePosts(posts);
			}

			pagination = {
				page: payload.page,
				perPage: payload.perPage,
				total: payload.total,
				totalPages: payload.totalPages,
				hasMore: payload.hasMore
			};
		} catch (err) {
			console.error(err);
			loadError =
				err instanceof Error ? err.message : 'Unexpected error while trying to load more posts.';
		} finally {
			isLoading = false;
		}
	}

	onMount(() => {
		if (!browser || typeof IntersectionObserver === 'undefined') {
			return;
		}

		observer = new IntersectionObserver(
			(entries) => {
				if (entries.some((entry) => entry.isIntersecting)) {
					void loadMore();
				}
			},
			{ rootMargin: '200px 0px' }
		);

		if (sentinel) {
			observer.observe(sentinel);
			lastObservedSentinel = sentinel;
		}

		return () => {
			observer?.disconnect();
			observer = null;
			lastObservedSentinel = null;
		};
	});

	$effect(() => {
		frontPage = data.frontPage;
		posts = [...data.initialPosts];
		pagination = data.pagination;
		isLoading = false;
		loadError = null;
	});

	$effect(() => {
		if (!browser || !observer) return;

		if (sentinel && sentinel !== lastObservedSentinel) {
			observer.disconnect();
			observer.observe(sentinel);
			lastObservedSentinel = sentinel;
		} else if (!sentinel && lastObservedSentinel) {
			observer.disconnect();
			lastObservedSentinel = null;
		}
	});
</script>

<div class="full-page">
	<div class="banner">
		<img
			src="https://theinnovator.org/wp-content/uploads/2020/04/Horizontal-Logo-PNG.png"
			alt="The Innovator"
		/>
	</div>
	<aside class="left"></aside>
	<main>
		{#each frontPage.currentYear.highlighted as post}
			<Snippet {post} />
		{/each}
		{#each frontPage.currentYear.others as post}
			<Snippet {post} />
		{/each}
		{#if frontPage.prevYears.length > 0}
			<section class="previous-years">
				<h2>From Previous Years</h2>
				{#each frontPage.prevYears as group}
					<h3>{group.year} Articles</h3>
					{#each group.highlighted as post}
						<Snippet {post} />
					{/each}
					{#each group.others as post}
						<Snippet {post} />
					{/each}
				{/each}
			</section>
		{/if}
		{#if loadError}
			<div class="load-error" role="alert">
				<p>{loadError}</p>
				<button class="load-more-button" on:click={() => void loadMore()} disabled={isLoading}>
					Try again
				</button>
			</div>
		{/if}
		{#if pagination.hasMore && !loadError}
			<div class="load-more">
				<div class="infinite-scroll-sentinel" bind:this={sentinel} aria-hidden="true"></div>
				<button class="load-more-button" on:click={() => void loadMore()} disabled={isLoading}>
					{isLoading ? 'Loading…' : 'Load more'}
				</button>
			</div>
		{:else if isLoading}
			<p class="loading">Loading…</p>
		{/if}
	</main>
	<aside class="right">
		<Mission />
		<PastIssues />
	</aside>
</div>

<style>
	h2 {
		color: var(--color-accent);
	}
	h3 {
		border-top: 1px solid var(--color-accent-2);
		padding-top: 0.5rem;
		color: var(--color-accent-2);
	}
	.full-page {
		display: grid;
		grid-template-areas:
			'banner banner banner'
			'left main right';
		grid-template-columns: 1fr min(800px, 70%) 1fr;
		gap: clamp(1rem, 3vw, 2rem);
		padding: var(--page-padding, 2rem);
	}

	.left {
		grid-area: left;
	}

	main {
		grid-area: main;
		display: grid;
		gap: clamp(1.5rem, 3vw, 2rem);
	}

	.right {
		grid-area: right;
	}

	.banner {
		grid-area: banner;
		text-align: center;
		border-bottom: 1px solid var(--color-border, #d9dce4);
		padding: clamp(1rem, 3vw, 2rem);
		background: var(--color-surface, #ffffff);
	}

	.banner img {
		width: min(100%, 800px);
		height: auto;
	}

	.previous-years {
		display: grid;
		gap: clamp(1rem, 2.5vw, 1.75rem);
		margin-top: clamp(2rem, 4vw, 3rem);
	}

	.previous-years h2 {
		border-top: 2px solid var(--color-border, #d9dce4);
		padding-top: 1.5rem;
		margin-bottom: 0;
	}

	.previous-years h3 {
		font-family: var(--font-sans, 'Work Sans', sans-serif);
		font-size: 1rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--meta-text, #3c3f52);
		margin: 1rem 0 0.5rem;
	}

	.load-more {
		display: grid;
		gap: 0.75rem;
		justify-items: center;
		margin: clamp(2rem, 4vw, 3rem) 0 0;
	}

	.load-more-button {
		background: var(--color-accent);
		color: #fff;
		border: none;
		padding: 0.75rem 1.75rem;
		border-radius: 999px;
		font-size: 0.95rem;
		font-weight: 600;
		cursor: pointer;
		transition: opacity 0.2s ease, transform 0.2s ease;
	}

	.load-more-button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
		transform: none;
	}

	.load-more-button:not(:disabled):hover {
		transform: translateY(-1px);
	}

	.infinite-scroll-sentinel {
		width: 100%;
		height: 1px;
	}

	.load-error {
		border: 1px solid var(--color-border, #d9dce4);
		border-radius: 0.75rem;
		background: var(--color-surface, #ffffff);
		padding: 1rem;
		margin-top: clamp(1.5rem, 3vw, 2rem);
		text-align: center;
		display: grid;
		gap: 0.75rem;
		color: var(--color-accent-2, #5c5f73);
	}

	.loading {
		text-align: center;
		color: var(--meta-text, #3c3f52);
		margin-top: clamp(1rem, 2vw, 1.5rem);
	}

	@media (max-width: 1200px) {
		.full-page {
			grid-template-columns: min(800px, 70%) 1fr;
			grid-template-areas:
				'banner banner'
				'main right'
				'main left';
		}
	}

	@media (max-width: 900px) {
		.full-page {
			grid-template-areas:
				'banner'
				'main'
				'left'
				'right';
			grid-template-columns: 1fr;
		}
	}
</style>

<script lang="ts">
	import Links from '$lib/components/Links.svelte';

	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import type { PageProps } from './$types';
	import Mission from '$lib/components/Mission.svelte';
	import PastIssues from '$lib/components/PastIssues.svelte';
	import Snippet from '$lib/components/Snippet.svelte';
	import { partitionFrontPagePosts } from '$lib/api';
	import type { FrontPagePosts, InnovatorPost, PaginatedInnovatorPosts } from '$lib/api';

	type PaginationState = Omit<PaginatedInnovatorPosts, 'posts'>;

	let { data }: PageProps = $props();

	let frontPage = $state<FrontPagePosts>(data.frontPage);
	let posts = $state<InnovatorPost[]>([...data.initialPosts]);
	let pagination = $state<PaginationState>(data.pagination);
	let isLoading = $state(false);
	let loadError = $state<string | null>(null);
	let isSidebarOpen = $state(false);

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

	onMount(() => {
		if (!browser || typeof window.matchMedia !== 'function') {
			return;
		}

		const desktopMediaQuery = window.matchMedia('(min-width: 1024px)');
		const handleViewportChange = (event: MediaQueryListEvent) => {
			if (event.matches) {
				isSidebarOpen = false;
			}
		};

		desktopMediaQuery.addEventListener('change', handleViewportChange);

		return () => {
			desktopMediaQuery.removeEventListener('change', handleViewportChange);
		};
	});

	$effect(() => {
		frontPage = data.frontPage;
		posts = [...data.initialPosts];
		pagination = data.pagination;
		isLoading = false;
		loadError = null;
		isSidebarOpen = false;
	});

	console.log($state.snapshot(data.initialPosts));

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

	$effect(() => {
		if (!browser) return;

		document.body.classList.toggle('mobile-sidebar-open', isSidebarOpen);

		return () => {
			document.body.classList.remove('mobile-sidebar-open');
		};
	});

	$effect(() => {
		if (!browser || !isSidebarOpen) return;

		const handleKeydown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				isSidebarOpen = false;
			}
		};

		window.addEventListener('keydown', handleKeydown);

		return () => {
			window.removeEventListener('keydown', handleKeydown);
		};
	});
</script>

<div class="full-page">
	<div class="banner">
		<img
			src="https://wp.theinnovator.org/wp-content/uploads/2020/04/Horizontal-Logo-PNG.png"
			alt="The Innovator"
		/>
	</div>
	<aside class="left"></aside>
	<button
		class="mobile-sidebar-toggle"
		type="button"
		aria-expanded={isSidebarOpen}
		aria-controls="homepage-sidebar"
		aria-label={isSidebarOpen ? 'Close about and issues panel' : 'Open about and issues panel'}
		onclick={() => {
			isSidebarOpen = !isSidebarOpen;
		}}
	>
		<span aria-hidden="true">☰</span>
		<span>About &amp; Issues</span>
	</button>
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
				<button class="load-more-button" onclick={() => void loadMore()} disabled={isLoading}>
					Try again
				</button>
			</div>
		{/if}
		{#if pagination.hasMore && !loadError}
			<div class="load-more">
				<div class="infinite-scroll-sentinel" bind:this={sentinel} aria-hidden="true"></div>
				<button class="load-more-button" onclick={() => void loadMore()} disabled={isLoading}>
					{isLoading ? 'Loading…' : 'Load more'}
				</button>
			</div>
		{:else if isLoading}
			<p class="loading">Loading…</p>
		{/if}
	</main>
	<button
		class="sidebar-backdrop"
		type="button"
		aria-label="Close about and issues panel"
		class:is-visible={isSidebarOpen}
		onclick={() => {
			isSidebarOpen = false;
		}}
	></button>
	<aside
		id="homepage-sidebar"
		class="right"
		class:is-open={isSidebarOpen}
		aria-label="About The Innovator"
	>
		<div class="sidebar-header">
			<p>About The Innovator</p>
			<button
				class="sidebar-close"
				type="button"
				aria-label="Close about and issues panel"
				onclick={() => {
					isSidebarOpen = false;
				}}
			>
				×
			</button>
		</div>
		<div class="sidebar-sections">
			<Mission />
			<PastIssues />
			<Links></Links>
		</div>
	</aside>
</div>

<style>
	:global(body.mobile-sidebar-open) {
		overflow: hidden;
	}

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

	.mobile-sidebar-toggle,
	.sidebar-backdrop,
	.sidebar-header {
		display: none;
	}

	main {
		grid-area: main;
		display: grid;
		gap: clamp(1.5rem, 3vw, 2rem);
	}

	.right {
		grid-area: right;
	}

	.sidebar-sections {
		display: grid;
		gap: 1.25rem;
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
		transition:
			opacity 0.2s ease,
			transform 0.2s ease;
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

	@media (max-width: 1023px) {
		.full-page {
			grid-template-areas:
				'banner'
				'main';
			grid-template-columns: minmax(0, 1fr);
			padding: var(--page-padding, 1rem);
		}

		.left {
			display: none;
		}

		.mobile-sidebar-toggle {
			position: fixed;
			right: 1rem;
			bottom: calc(1rem + env(safe-area-inset-bottom, 0px));
			z-index: 50;
			display: inline-flex;
			align-items: center;
			gap: 0.5rem;
			border: none;
			border-radius: 999px;
			padding: 0.8rem 1rem;
			background: var(--color-accent, #6e112a);
			color: #fff;
			font-family: var(--font-sans, 'Work Sans', sans-serif);
			font-size: 0.95rem;
			font-weight: 600;
			box-shadow: 0 16px 40px rgba(15, 22, 38, 0.24);
		}

		.sidebar-backdrop {
			position: fixed;
			inset: 0;
			z-index: 59;
			border: 0;
			padding: 0;
			background: rgba(15, 22, 38, 0.5);
			opacity: 0;
			visibility: hidden;
			transition:
				opacity 0.2s ease,
				visibility 0.2s ease;
		}

		.sidebar-backdrop.is-visible {
			display: block;
			opacity: 1;
			visibility: visible;
		}

		.right {
			position: fixed;
			top: 0;
			right: 0;
			z-index: 60;
			display: grid;
			grid-template-rows: auto 1fr;
			gap: 1rem;
			width: min(24rem, calc(100vw - 1.5rem));
			height: 100dvh;
			padding: 1rem;
			background: linear-gradient(180deg, #f6efe6 0%, #f3f4f6 100%);
			box-shadow: -18px 0 45px rgba(15, 22, 38, 0.18);
			overflow-y: auto;
			transform: translateX(calc(100% + 1rem));
			opacity: 0;
			visibility: hidden;
			pointer-events: none;
			transition:
				transform 0.25s ease,
				opacity 0.2s ease,
				visibility 0.2s ease;
		}

		.sidebar-sections > :global(*) {
			padding: 1rem 1.1rem;
			background: var(--color-surface, #ffffff);
			border: 1px solid var(--color-border, #d9dce4);
			box-shadow: 0 10px 30px rgba(15, 22, 38, 0.06);
		}

		.right.is-open {
			transform: translateX(0);
			opacity: 1;
			visibility: visible;
			pointer-events: auto;
		}

		.sidebar-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 1rem;
			padding-bottom: 0.75rem;
			border-bottom: 1px solid rgba(15, 22, 38, 0.12);
		}

		.sidebar-header p {
			margin: 0;
			font-family: var(--font-sans, 'Work Sans', sans-serif);
			font-size: 0.75rem;
			font-weight: 600;
			letter-spacing: 0.12em;
			text-transform: uppercase;
			color: var(--color-accent-2, #363a42);
		}

		.sidebar-close {
			border: none;
			background: transparent;
			color: var(--color-accent-2, #363a42);
			font-size: 2rem;
			line-height: 1;
		}
	}
</style>

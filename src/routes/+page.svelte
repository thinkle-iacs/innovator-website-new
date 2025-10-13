<script lang="ts">
	import type { PageProps } from './$types';
	import Mission from '$lib/components/Mission.svelte';
	import PastIssues from '$lib/components/PastIssues.svelte';
	import Snippet from '$lib/components/Snippet.svelte';

	// Use the generated PageData type so the shape matches your server load.
	let { data }: PageProps = $props();
	const { frontPage } = data;
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

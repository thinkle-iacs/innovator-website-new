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
					<h3>{group.year}</h3>
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
	.full-page {
		display: grid;
	}
	.left {
		grid-area: left;
	}
	.main {
		grid-area: main;
	}
	.right {
		grid-area: right;
		/* Was going to stick but then it's not all visible, which is bad.
    We could put a max-height and an overflow-y on it, but then we have two
    scrolling boxes which is awkward */
		/* 	position: sticky;
		align-self: start;
		top: 16px; */
	}
	.banner {
		grid-area: banner;
		text-align: center;
		border-bottom: 1px solid #ccc;
		padding: 16px;
	}
	.banner img {
		width: 800px;
	}
	.full-page {
		grid-template-areas:
			'banner banner banner'
			'left main right';
		grid-template-columns: 1fr min(800px, 70%) 1fr;
		gap: 20px;
		padding: 20px;
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
		.banner img {
			width: 100%;
			max-width: max(100%, 600px);
		}
	}
</style>

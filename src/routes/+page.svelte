<script lang="ts">
	import type { PageProps } from './$types';
	import type { InnovatorPost } from '$lib/api';
	import Mission from '$lib/components/Mission.svelte';
	import PastIssues from '$lib/components/PastIssues.svelte';
	import Snippet from '$lib/components/Snippet.svelte';

	// Use the generated PageData type so the shape matches your server load.
	let { data }: PageProps = $props();
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
		<h1>The Innovator</h1>
		{#each data.frontPage.currentYear.highlighted as post}
			<Snippet {post} />
		{/each}
		{#each data.frontPage.currentYear.others as post}
			<Snippet {post} />
		{/each}
		{#if data.frontPage.prevYears.highlighted || data.frontPage.prevYears.others}
			<h2>From Previous Years</h2>
			{#each data.frontPage.prevYears.highlighted as post}
				<Snippet {post} />
			{/each}
			{#each data.frontPage.prevYears.others as post}
				<Snippet {post} />
			{/each}
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

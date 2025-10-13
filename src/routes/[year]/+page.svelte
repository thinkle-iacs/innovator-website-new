<script lang="ts">
	import type { PageProps } from './$types';
	import Snippet from '$lib/components/Snippet.svelte';
	import PageShell from '$lib/components/PageShell.svelte';

	let { data }: PageProps = $props();
	const { year, posts } = data;
</script>

<svelte:head>
	<title>{year} Archives | The Innovator</title>
	<meta name="description" content={`Articles published in ${year} on The Innovator.`} />
</svelte:head>

<PageShell>
	<section class="list-page">
		<h1>{year} Archives</h1>
		{#if posts.length === 0}
			<p>No stories were published in {year}.</p>
		{:else}
			<div class="post-list">
				{#each posts as post}
					<Snippet {post} />
				{/each}
			</div>
		{/if}
	</section>
</PageShell>

<style>
	.list-page {
		display: grid;
		gap: clamp(1rem, 3vw, 2rem);
		max-width: 900px;
		margin: 0 auto;
	}

	.post-list {
		display: grid;
		gap: clamp(1.25rem, 3vw, 2rem);
	}
</style>

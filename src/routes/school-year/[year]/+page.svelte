<script lang="ts">
	import type { PageProps } from './$types';
	import Snippet from '$lib/components/Snippet.svelte';

	let { data }: PageProps = $props();
	const { posts, year } = data;
</script>

<svelte:head>
	<title>School Year {year} | The Innovator</title>
	<meta name="description" content={`Stories published during the ${year} school year on The Innovator.`} />
</svelte:head>

<section class="school-year">
	<h1>{year} School Year</h1>
	{#if posts.length === 0}
		<p>No stories were found for this school year.</p>
	{:else}
		<div class="post-list">
			{#each posts as post}
				<Snippet {post} />
			{/each}
		</div>
	{/if}
</section>

<style>
	.school-year {
		display: grid;
		gap: 1.5rem;
		margin-inline: auto;
		max-width: 60rem;
		padding: 1rem;
	}

	.post-list {
		display: grid;
		gap: 1.5rem;
	}
</style>

<script lang="ts">
	import type { PageProps } from './$types';
	import Snippet from '$lib/components/Snippet.svelte';
	import type { InnovatorPost, WPCategory } from '$lib/api';
	import PageShell from '$lib/components/PageShell.svelte';

	let { data }: PageProps = $props();
	const posts: InnovatorPost[] = data.posts;
	const category: WPCategory = data.category;
	const descriptionText =
		category.description
			?.replace(/<[^>]*>/g, '')
			.replace(/\s+/g, ' ')
			.trim() ?? '';
</script>

<svelte:head>
	<title>Category: {category.name} | The Innovator</title>
	{#if descriptionText}
		<meta
			name="description"
			content={`Articles in the ${category.name} category: ${descriptionText.slice(0, 140)}`}
		/>
	{:else}
		<meta name="description" content={`Articles filed under ${category.name} on The Innovator.`} />
	{/if}
</svelte:head>

<PageShell>
	<section class="list-page">
		<h1>Category: {category.name}</h1>
		{#if category.description}
			<p class="intro">{@html category.description}</p>
		{/if}

		{#if posts.length === 0}
			<p>No stories found for this category.</p>
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

	.intro {
		font-family: var(--font-sans, 'Work Sans', sans-serif);
		color: var(--meta-text, #3c3f52);
	}
</style>

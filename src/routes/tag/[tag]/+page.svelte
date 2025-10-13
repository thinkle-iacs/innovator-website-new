<script lang="ts">
	import type { PageProps } from './$types';
	import type { InnovatorPost, WPTag } from '$lib/api';
	import Snippet from '$lib/components/Snippet.svelte';

	let { data }: PageProps = $props();
	const posts: InnovatorPost[] = data.posts;
	const tag: WPTag = data.tag;
	const descriptionText = tag.description?.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim() ?? '';
</script>

<svelte:head>
	<title>Tag: {tag.name} | The Innovator</title>
	{#if descriptionText}
		<meta name="description" content={`Articles tagged ${tag.name}: ${descriptionText.slice(0, 140)}`} />
	{:else}
		<meta name="description" content={`Articles tagged ${tag.name} on The Innovator.`} />
	{/if}
</svelte:head>

<section class="tag-page">
	<h1>Tag: {tag.name}</h1>
	{#if tag.description}
		<p class="tag-description">{@html tag.description}</p>
	{/if}

	{#if posts.length === 0}
		<p>No stories found for this tag.</p>
	{:else}
		<div class="post-list">
			{#each posts as post}
				<Snippet {post} />
			{/each}
		</div>
	{/if}
</section>

<style>
	.tag-page {
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

	.tag-description {
		font-style: italic;
		color: #444;
	}
</style>

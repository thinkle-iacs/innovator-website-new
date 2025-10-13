<script lang="ts">
	import type { PageProps } from './$types';
	import type { InnovatorPost, WPTag } from '$lib/api';
	import Snippet from '$lib/components/Snippet.svelte';
	import PageShell from '$lib/components/PageShell.svelte';

	let { data }: PageProps = $props();
	const posts: InnovatorPost[] = data.posts;
	const tag: WPTag = data.tag;
	const descriptionText =
		tag.description
			?.replace(/<[^>]*>/g, '')
			.replace(/\s+/g, ' ')
			.trim() ?? '';
</script>

<svelte:head>
	<title>Tag: {tag.name} | The Innovator</title>
	{#if descriptionText}
		<meta
			name="description"
			content={`Articles tagged ${tag.name}: ${descriptionText.slice(0, 140)}`}
		/>
	{:else}
		<meta name="description" content={`Articles tagged ${tag.name} on The Innovator.`} />
	{/if}
</svelte:head>

<PageShell>
	<section class="list-page">
		<h1>Tag: {tag.name}</h1>
		{#if tag.description}
			<p class="intro">{@html tag.description}</p>
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

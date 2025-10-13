<script lang="ts">
	import type { InnovatorPost } from '$lib/api';
	let { post }: { post: InnovatorPost } = $props();
</script>

{#if post.categories.length > 0}
	<div class="categories" aria-label="Categories">
		{#each post.categories as category}
			<a
				class="category"
				href={`/category/${category.slug}`}
				rel="tag"
				title={`View all posts in ${category.name}`}
			>
				{category.name}
			</a>
		{/each}
	</div>
{/if}

<style>
	.categories {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5em;
		font-family: var(--font-sans, 'Work Sans', sans-serif);
	}

	.category {
		display: inline-flex;
		align-items: center;
		padding: 0.15em 0.6em;
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.03em;
		background-color: var(--tag-color, #333);
		border-radius: 999px;
		color: var(--tag-text, #fafafa);
		transition: background-color 0.2s ease, color 0.2s ease;
	}

	.category:hover,
	.category:focus-visible {
		background-color: var(--tag-hover-color, #1f2a44);
		color: var(--tag-hover-text, #ffffff);
	}
</style>

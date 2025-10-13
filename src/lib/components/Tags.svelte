<script lang="ts">
	import type { InnovatorPost } from '$lib/api';
	let { post }: { post: InnovatorPost } = $props();
</script>

<div class="categories">
	{#each post.categoryNames as cat}
		<span class="category">{cat}</span>
	{/each}
</div>

<style>
	.category {
		display: inline-block;
		padding: 0.2em 0.5em;
		margin-right: 0.5em;
		background-color: var(--tag-color, #333);
		border-radius: 0.25em;
		color: var(--tag-text, #fafafa);
	}
</style>

<script lang="ts">
	import type { InnovatorPost } from '$lib/api';
	let { post }: { post: InnovatorPost } = $props();

	function normalizeBylineText(text: string): string {
		// WordPress/plugin fields occasionally include literal entity strings like "&nbsp;".
		// Svelte escapes text nodes, so we normalize them to real spaces.
		return text
			.replace(/&nbsp;|&#160;|&#xA0;/gimu, ' ')
			.replace(/\u00A0/gmu, ' ')
			.replace(/\s+/gmu, ' ')
			.trim();
	}

	let embeddedAuthors = post._embedded?.author?.map((author) => normalizeBylineText(author.name));
</script>

{#if embeddedAuthors?.length}
	<div class="byline">
		{#if embeddedAuthors.length === 1}
			By {embeddedAuthors[0]}
		{:else if embeddedAuthors.length === 2}
			By {embeddedAuthors[0]} and {embeddedAuthors[1]}
		{:else}
			By
			{#each embeddedAuthors.slice(0, -1) as author, index}
				{author},
			{/each}
			and {embeddedAuthors[embeddedAuthors.length - 1]}
		{/if}
	</div>
{:else}
	<div class="byline">{@html post.byline}</div>
{/if}

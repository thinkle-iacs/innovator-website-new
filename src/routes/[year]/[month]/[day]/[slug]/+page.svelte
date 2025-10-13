<script lang="ts">
	import type { PageProps } from './$types';
	import type { InnovatorPost } from '$lib/api';
	import FullPage from '$lib/components/FullPage.svelte';
	import PageShell from '$lib/components/PageShell.svelte';

	let { data }: PageProps = $props();
	const post: InnovatorPost = data.post;
	const plainTitle = post.title
		.replace(/<[^>]*>/g, '')
		.replace(/\s+/g, ' ')
		.trim();
	const plainExcerpt = post.excerpt
		.replace(/<[^>]*>/g, '')
		.replace(/\s+/g, ' ')
		.trim();
	const description = plainExcerpt ? plainExcerpt.slice(0, 160) : 'Article on The Innovator';
</script>

<svelte:head>
	<title>{plainTitle ? `${plainTitle} | The Innovator` : 'The Innovator'}</title>
	<meta name="description" content={description} />
</svelte:head>

<PageShell>
	<div class="article-container">
		<FullPage {post} />
	</div>
</PageShell>

<style>
	.article-container {
		max-width: 900px;
		margin: 0 auto;
	}
</style>

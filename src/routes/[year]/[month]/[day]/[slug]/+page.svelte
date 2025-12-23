<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageProps } from './$types';
	import type { InnovatorPost } from '$lib/api';
	import FullPage from '$lib/components/FullPage.svelte';
	import PageShell from '$lib/components/PageShell.svelte';
	import { reportView } from '$lib/reportView';

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

	// Report view to backend when component mounts
	onMount(() => {
		reportView(post.id);
	});
	console.log('Loaded post: ', $state.snapshot(post));
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

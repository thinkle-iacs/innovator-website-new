<script lang="ts">
	import type { InnovatorPost } from '$lib/api';
	import Dateline from './Dateline.svelte';
	import Byline from './Byline.svelte';
	let { post }: { post: InnovatorPost } = $props();
	let isTiny = post.content.length < 500;
</script>

<article>
	<h2><a href={post.relativeLink}>{@html post.title}</a></h2>
	<Dateline {post} />
	<Byline {post} />
	{#if isTiny}
		<div class="page">{@html post.content}</div>
	{:else}
		{#if post.featuredVideo}
			<div class="video-container">
				<iframe
					src={post.featuredVideo}
					title="YouTube video player"
					frameborder="0"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
					allowfullscreen
				></iframe>
			</div>
		{:else if post.featuredImage}
			<img src={post.featuredImage} alt="Featured image for {post.title}" />
		{/if}
		<div class="excerpt">{@html post.excerpt}</div>
	{/if}
</article>

<style>
	h2 a {
		text-decoration: none;
		color: inherit;
	}
	iframe,
	article :global(iframe),
	img,
	article :global(img) {
		max-width: 100%;
	}
	iframe,
	video,
	:global(video, iframe) {
		aspect-ratio: 16 / 9;
		height: auto;
	}
</style>

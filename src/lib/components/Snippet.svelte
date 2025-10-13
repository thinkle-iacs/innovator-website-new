<script lang="ts">
	import type { InnovatorPost } from '$lib/api';
	import Dateline from './Dateline.svelte';
	import Byline from './Byline.svelte';
	let { post }: { post: InnovatorPost } = $props();

	const stripHtml = (html: string) =>
		html
			.replace(/<[^>]*>/g, '')
			.replace(/\s+/g, ' ')
			.trim();
	const isTiny = (p: InnovatorPost) => p.content.length < 500;
	const getFeaturedImageAlt = (p: InnovatorPost) => {
		if (p.featuredImageAlt) return p.featuredImageAlt;
		const title = stripHtml(p.title);
		return title ? `Featured image for ${title}` : 'Featured image';
	};
	const shouldShowFeaturedImage = (p: InnovatorPost) =>
		Boolean(p.featuredImage && !p.contentHasFeaturedImage);
	const shouldShowFeaturedVideo = (p: InnovatorPost) =>
		Boolean(p.featuredVideo && !p.contentHasFeaturedVideo);
</script>

<article class="snippet">
	<h3><a href={post.relativeLink}>{@html post.title}</a></h3>
	<Dateline {post} />
	<Byline {post} />
	{#if isTiny(post)}
		<div class="page">
			{#if shouldShowFeaturedImage(post)}
				<div class="featured-image-container">
					<a href={post.relativeLink}>
						<img src={post.featuredImage} alt={getFeaturedImageAlt(post)} />
					</a>
				</div>
			{/if}
			{#if shouldShowFeaturedVideo(post)}
				<div class="featured-video-container">
					<iframe
						src={post.featuredVideo}
						title="YouTube video player"
						frameborder="0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in
-picture; web-share"
						allowfullscreen
					></iframe>
				</div>
			{/if}
			{@html post.content}
		</div>
	{:else}
		{#if shouldShowFeaturedVideo(post)}
			<div class="video-container">
				<iframe
					src={post.featuredVideo}
					title="YouTube video player"
					frameborder="0"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
					allowfullscreen
				></iframe>
			</div>
		{:else if shouldShowFeaturedImage(post)}
			<div class="featured-image-container">
				<img src={post.featuredImage} alt={getFeaturedImageAlt(post)} />
			</div>
		{/if}
		<div class="excerpt">{@html post.excerpt}</div>
		<div class="read-more">
			<a href={post.relativeLink}>Read More</a>
		</div>
	{/if}
</article>

<style>
	article {
		padding-bottom: 16px;
		border-bottom: 1px solid #19243d;
	}
	h3 a {
		text-decoration: none;
		color: inherit;
	}
	iframe,
	article :global(iframe),
	img,
	article :global(img) {
		max-width: 100%;
		width: min(400px, 100%);
	}
	iframe,
	video,
	:global(video, iframe) {
		aspect-ratio: 16 / 9;
		height: auto;
	}
	.featured-image-container {
		text-align: center;
	}
	.read-more {
		font-style: italic;
		text-align: right;
	}
	h3 {
		margin-bottom: 0;
	}
</style>

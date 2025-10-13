<script lang="ts">
	import type { InnovatorPost } from '$lib/api';
	import Dateline from './Dateline.svelte';
	import Byline from './Byline.svelte';

	let { post }: { post: InnovatorPost } = $props();
	$inspect(post);
	const stripHtml = (html: string) =>
		html
			.replace(/<[^>]*>/g, '')
			.replace(/\s+/g, ' ')
			.trim();
	const getFeaturedImageAlt = () => {
		if (post.featuredImageAlt) return post.featuredImageAlt;
		const title = stripHtml(post.title);
		return title ? `Featured image for ${title}` : 'Featured image';
	};
	const getFeaturedCaption = () =>
		post.wpPostObject.cc_featured_image_caption?.caption_text?.trim() || '';
	const shouldShowFeaturedVideo = () =>
		Boolean(post.featuredVideo && !post.contentHasFeaturedVideo);
	const shouldShowFeaturedImage = () =>
		Boolean(post.featuredImage && !post.contentHasFeaturedImage);
</script>

<article class="full-post">
	<h1>{@html post.title}</h1>
	<div class="meta">
		<Dateline {post} />
		<Byline {post} />
	</div>
	{#if shouldShowFeaturedVideo()}
		<div class="featured-video">
			<iframe
				src={post.featuredVideo}
				title="Featured video player"
				frameborder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
				allowfullscreen
			></iframe>
		</div>
	{:else if shouldShowFeaturedImage()}
		<figure class="featured-image">
			<img src={post.featuredImage} alt={getFeaturedImageAlt()} />
			{#if getFeaturedCaption()}
				<figcaption>{getFeaturedCaption()}</figcaption>
			{/if}
		</figure>
	{/if}
	<div class="content">
		{@html post.content}
	</div>
</article>

<style>
	.full-post {
		display: grid;
		gap: 1rem;
		margin-inline: auto;
		max-width: 60rem;
		padding: 1rem;
	}

	.meta {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		color: #444;
		font-size: 0.95rem;
	}

	.content :global(img),
	.content :global(iframe),
	.content :global(video),
	.content :global(figure) {
		max-width: 100%;
		margin-inline: auto;
		display: block;
	}

	.content :global(iframe),
	.content :global(video) {
		aspect-ratio: 16 / 9;
		height: auto;
	}

	.featured-video iframe {
		max-width: 100%;
		width: 100%;
		aspect-ratio: 16 / 9;
	}

	.featured-image {
		margin: 0 auto;
		max-width: 100%;
	}

	.featured-image img {
		display: block;
		max-width: 100%;
		margin: 0 auto;
	}

	.featured-image figcaption {
		margin-top: 0.5rem;
		font-size: 0.9rem;
		color: #555;
		text-align: center;
	}
</style>

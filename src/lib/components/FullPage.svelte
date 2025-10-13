<script lang="ts">
	import type { InnovatorPost } from '$lib/api';
	import Dateline from './Dateline.svelte';
	import Byline from './Byline.svelte';
	import Tags from './Tags.svelte';

	let { post }: { post: InnovatorPost } = $props();
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
		<div class="left">
			<Dateline {post} />
			<Byline {post} />
		</div>
		<div class="right">
			<Tags {post} />
		</div>
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
	article {
		max-width: var(--article-width, 45rem);
		margin: clamp(1rem, 4vw, 3rem) auto;
		padding: clamp(1.5rem, 4vw, 3rem);
		background: var(--color-surface, #ffffff);
		border-radius: 1rem;
		box-shadow: 0 10px 30px rgba(15, 22, 38, 0.08);
	}
	article h1 {
		text-align: center;
		margin-bottom: 0;
		font-size: clamp(2rem, 5vw, 3.5rem);
		line-height: 1.1;
	}
	.meta {
		font-size: 0.85rem;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 0.75rem;
		font-family: var(--font-sans, 'Work Sans', sans-serif);
		color: var(--meta-text, #3c3f52);
	}

	.meta .left,
	.meta .right {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.75rem;
	}

	.content :global(img),
	.content :global(iframe),
	.content :global(video),
	.content :global(figure) {
		max-width: 100%;
		height: auto;
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
		height: auto;
	}

	.featured-image {
		margin: 0 auto;
		max-width: 100%;
	}

	.featured-image img {
		display: block;
		max-width: 100%;
		margin: 0 auto;
		height: auto;
	}

	.featured-image figcaption {
		margin-top: 0.5rem;
		font-size: 0.9rem;
		font-family: var(--font-sans, 'Work Sans', sans-serif);
		color: var(--meta-text, #3c3f52);
		text-align: center;
	}

	.content :global(p:first-of-type::first-letter) {
		font-size: clamp(2.5rem, 6vw, 4rem);
		font-weight: 600;
		line-height: 1;
		margin-right: 0.2em;
		float: left;
		color: var(--color-accent, #6e112a);
	}
</style>

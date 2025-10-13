<script lang="ts">
	import type { PageProps } from './$types';
	import Snippet from '$lib/components/Snippet.svelte';
	import HeaderBar from '$lib/components/HeaderBar.svelte';

	let { data }: PageProps = $props();
	const { year, month, day, posts } = data;

	const dateLabel = new Date(Date.UTC(year, month - 1, day)).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
</script>

<svelte:head>
	<title>{dateLabel} | The Innovator</title>
	<meta name="description" content={`Stories published on ${dateLabel} at The Innovator.`} />
</svelte:head>

<div class="page">
	<HeaderBar />
	<div class="content-layout">
		<main class="list-page">
			<h1>{dateLabel}</h1>
			{#if posts.length === 0}
				<p>No stories were published on this date.</p>
			{:else}
				<div class="post-list">
					{#each posts as post}
						<Snippet {post} />
					{/each}
				</div>
			{/if}
		</main>
		<aside></aside>
	</div>
</div>

<style>
	.page {
		padding: var(--page-padding, 2rem);
		background: var(--color-background, #f4f4f4);
	}

	.content-layout {
		display: grid;
		gap: clamp(1.5rem, 4vw, 3rem);
		max-width: 1200px;
		margin: 0 auto;
	}

	.list-page {
		display: grid;
		gap: clamp(1rem, 3vw, 2rem);
	}

	.post-list {
		display: grid;
		gap: clamp(1.25rem, 3vw, 2rem);
	}

	@media (min-width: 1024px) {
		.content-layout {
			grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
			align-items: start;
		}
	}
</style>

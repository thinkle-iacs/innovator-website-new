<script lang="ts">
	import HeaderBar from './HeaderBar.svelte';

	let { children, sidebar, showHomeLink } = $props();

	const hasSidebar = typeof sidebar === 'function';
</script>

<div class="page">
	<HeaderBar {showHomeLink} />
	<div class="content-layout" class:has-sidebar={hasSidebar}>
		<main>{@render children?.()}</main>
		{#if hasSidebar}
			<aside>{@render sidebar?.()}</aside>
		{/if}
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

	.content-layout :global(main),
	.content-layout main {
		min-width: 0;
	}

	.content-layout.has-sidebar {
		align-items: start;
	}

	aside {
		min-width: 0;
	}

	@media (min-width: 1024px) {
		.content-layout.has-sidebar {
			grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
		}
	}

	@media (max-width: 1023px) {
		.content-layout {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>

<script lang="ts">
	export let showHomeLink = true;
</script>

<header class="header">
	<a class="brand" href="/">
		<img
			src="https://wp.theinnovator.org/wp-content/uploads/2020/04/Horizontal-Logo-PNG.png"
			alt="The Innovator"
			loading="lazy"
		/>
	</a>
	{#if showHomeLink}
		<nav aria-label="Primary navigation">
			<a href="/" class="home-link">← Back to Home</a>
		</nav>
	{/if}
</header>

<style>
	.header {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: clamp(0.75rem, 2vw, 1.5rem);
		padding: clamp(1rem, 4vw, 2rem) 0;
		text-align: center;
	}

	.brand img {
		width: min(100%, 480px);
		height: auto;
	}

	nav {
		font-family: var(--font-sans, 'Work Sans', sans-serif);
	}

	.home-link {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		color: var(--link-color, #1949b1);
		font-weight: 500;
	}

	.home-link:hover,
	.home-link:focus {
		color: var(--link-hover-color, #102c73);
		text-decoration: underline;
	}
</style>

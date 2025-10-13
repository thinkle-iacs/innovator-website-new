<script lang="ts">
	import favicon from '$lib/assets/i.jpg';
	import '$lib/css/global.css';
	import '$lib/css/content.css';
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}

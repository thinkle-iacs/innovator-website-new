<script lang="ts">
	import type { InnovatorPost } from '$lib/api';
	let { post }: { post: InnovatorPost } = $props();
</script>

<div class="byline">{@html post.byline}</div>

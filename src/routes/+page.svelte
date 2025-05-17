<script lang="ts">
	import { connect } from '$lib/combined.svelte';

	const buttonVariants = {
		primary:
			'rounded-sm border-2 border-r-4 border-b-4 border-green-900 bg-green-500 px-4 py-2 font-bold text-white active:border-t-4 active:border-r-2 active:border-b-2 active:border-l-4 active:bg-green-600',
		secondary:
			'rounded-sm border-2 border-r-4 border-b-4 border-slate-900 bg-sky-600 px-4 py-2 text-center font-bold text-white active:border-t-4 active:border-r-2 active:border-b-2 active:border-l-4 active:bg-sky-700',
		disabled:
			'cursor-not-allowed rounded-sm border-2 border-r-4 border-b-4 border-slate-900 bg-neutral-400 px-4 py-2 text-center font-bold text-white active:border-t-4 active:border-r-2 active:border-b-2 active:border-l-4 active:bg-neutral-500'
	};
</script>

<div class="flex flex-col items-stretch gap-2">
	<button class={buttonVariants.primary} onclick={connect}>З'єднатись зі сканером</button>

	<a href="all-parameters" class={buttonVariants.secondary}>Всі параметри</a>

	<a href="all-parameters" class={buttonVariants.disabled}>Всі параметри</a>
</div>

<script lang="ts">
	import { enterDemoMode, exitDemoMode, isInDemoMode } from '$lib/demo-mode.svelte';
	import {
		connect as realConnect,
		mockConnect,
		startDataReading as realStartDataReading,
		mockStartDataReading,
		bluetoothState
	} from '$lib/bluetooth.store.svelte';

	const connect = isInDemoMode ? mockConnect : realConnect;
	const startDataReading = isInDemoMode ? mockStartDataReading : realStartDataReading;
	const connectAndStartDataReading = async () => {
		const isConnectedSuccessfully = await connect();
		if (isConnectedSuccessfully) {
			startDataReading();
		}
	};

	let elmDeviceStatus = $derived(bluetoothState.elmDeviceStatus);

	const buttonVariants = {
		primary:
			'rounded-sm border-2 border-r-4 border-b-4 border-green-900 bg-green-500 px-4 py-2 font-bold text-white active:border-t-4 active:border-r-2 active:border-b-2 active:border-l-4 active:bg-green-600',
		secondary:
			'rounded-sm border-2 border-r-4 border-b-4 border-slate-900 bg-sky-600 px-4 py-2 text-center font-bold text-white active:border-t-4 active:border-r-2 active:border-b-2 active:border-l-4 active:bg-sky-700 dark:border-slate-800',
		disabled:
			'cursor-not-allowed rounded-sm border-2 border-r-4 border-b-4 border-slate-900 bg-neutral-400 px-4 py-2 text-center font-bold text-white active:border-t-4 active:border-r-2 active:border-b-2 active:border-l-4 active:bg-neutral-500 dark:border-slate-800 dark:bg-slate-600 dark:active:bg-slate-700'
	};
</script>

<div class="flex flex-col items-stretch gap-2">
	<button class={buttonVariants.primary} onclick={connectAndStartDataReading}
		>З'єднатись зі сканером</button
	>
	<hr />
	<a
		href="all-parameters"
		class={elmDeviceStatus === 'ready' ? buttonVariants.secondary : buttonVariants.disabled}
		>Всі параметри</a
	>
	<a
		href="/"
		class={elmDeviceStatus === 'ready' ? buttonVariants.secondary : buttonVariants.disabled}
	>
		🚧 Батарея</a
	>
	<a
		href="/"
		class={elmDeviceStatus === 'ready' ? buttonVariants.secondary : buttonVariants.disabled}
	>
		🚧 Витрата</a
	>
	<hr />
	<a
		href="/"
		class={buttonVariants.secondary}
		onclick={isInDemoMode ? exitDemoMode : enterDemoMode}
	>
		{#if isInDemoMode}
			Вийти з Демо режиму
		{:else}
			Демо режим
		{/if}</a
	>
</div>

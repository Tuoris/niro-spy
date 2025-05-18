<script lang="ts">
	import { enterDemoMode, exitDemoMode, isInDemoMode } from '$lib/demo-mode.svelte';
	import {
		connect as realConnect,
		mockConnect,
		startDataReading as realStartDataReading,
		mockStartDataReading,
		bluetoothState
	} from '$lib/bluetooth.store.svelte';

	import ButtonLink from '$lib/components/button-link.svelte';
	import Button from '$lib/components/button.svelte';

	const connect = isInDemoMode ? mockConnect : realConnect;
	const startDataReading = isInDemoMode ? mockStartDataReading : realStartDataReading;
	const connectAndStartDataReading = async () => {
		const isConnectedSuccessfully = await connect();
		if (isConnectedSuccessfully) {
			startDataReading();
		}
	};

	let elmDeviceStatus = $derived(bluetoothState.elmDeviceStatus);
</script>

<div class="absolute top-1 font-bold text-neutral-600">Niro Spy</div>
<div class="flex flex-col items-stretch gap-2">
	<Button variant="primary" onclick={connectAndStartDataReading}>З'єднатись зі сканером</Button>
	<hr />
	<ButtonLink href="all-parameters" variant="secondary" disabled={elmDeviceStatus !== 'ready'}
		>Всі параметри</ButtonLink
	>
	<ButtonLink href="/" variant="secondary" disabled={elmDeviceStatus !== 'ready'}>
		🚧 Батарея</ButtonLink
	>
	<ButtonLink href="/" variant="secondary" disabled={elmDeviceStatus !== 'ready'}>
		🚧 Витрата</ButtonLink
	>
	<hr />
	<ButtonLink href="/" variant="tertiary" onclick={isInDemoMode ? exitDemoMode : enterDemoMode}>
		{#if isInDemoMode}
			Вийти з Демо режиму
		{:else}
			Демо режим
		{/if}</ButtonLink
	>
</div>

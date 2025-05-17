<script lang="ts">
	import '../app.css';
	import { bluetoothState } from '$lib/bluetooth.store.svelte';

	let serialConnectionStatus = $derived(bluetoothState.serialConnectionStatus);
	let elmDeviceStatus = $derived(bluetoothState.elmDeviceStatus);

	let heartbeat = $derived.by(() => (bluetoothState.heartbeat % 3) + 1);

	let { children } = $props();
</script>

<section class="flex h-full flex-col">
	<main class="flex grow items-center justify-center overflow-auto">
		{@render children()}
	</main>
	<footer
		class="flex justify-center gap-4 border-t-1 border-slate-900 bg-slate-100 text-sm text-slate-800"
	>
		<div class="flex items-center gap-2">
			<span class="icon-[mdi--bluetooth-transfer]"></span>

			Bluetooth: {serialConnectionStatus === 'idle' || serialConnectionStatus === 'disconnected'
				? 'не підключено'
				: serialConnectionStatus === 'connecting'
					? "з'єднання..."
					: serialConnectionStatus === 'error'
						? 'помилка'
						: "з'єднано"}
		</div>
		<div class="flex items-center gap-2">
			<span class="icon-[mdi--car-info]"></span>
			ELM 327: {elmDeviceStatus === 'idle'
				? 'не ініціалізовано'
				: elmDeviceStatus === 'initializing'
					? 'ініціалізація'
					: elmDeviceStatus === 'error'
						? 'помилка ініціалізації'
						: 'готовий'}
		</div>
		<div class="flex items-center gap-2">
			{#if heartbeat === 1}
				<span class="icon-[mdi--signal-cellular-1]"></span>
			{:else if heartbeat === 2}
				<span class="icon-[mdi--signal-cellular-2]"></span>
			{:else}
				<span class="icon-[mdi--signal-cellular-3]"></span>
			{/if}
		</div>
	</footer>
</section>

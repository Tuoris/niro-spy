<script lang="ts">
	import '../app.css';
	import { getBluetoothState, getElmDeviceState } from '$lib/combined.svelte';

	let bluetoothState = $derived.by(getBluetoothState);
	let elmDeviceState = $derived.by(getElmDeviceState);

	let { children } = $props();
</script>

<section class="flex h-full flex-col">
	<main class="flex grow items-center justify-center overflow-auto">
		{@render children()}
	</main>
	<footer
		class="flex justify-center gap-4 border-t-1 border-t-slate-200 bg-slate-100 text-slate-700"
	>
		<div class="flex items-center gap-2">
			<span class="icon-[mdi--bluetooth-transfer]"></span>

			Bluetooth: {bluetoothState === 'idle' || bluetoothState === 'disconnected'
				? 'Не підключено'
				: bluetoothState === 'connecting'
					? "З'єднання..."
					: bluetoothState === 'error'
						? 'Помилка'
						: "З'єднано"}
		</div>
		<div class="flex items-center gap-2">
			<span class="icon-[mdi--car-info]"></span>
			ELM 327: {elmDeviceState === 'idle'
				? 'Не ініціалізовано'
				: elmDeviceState === 'initializing'
					? 'Ініціалізація'
					: elmDeviceState === 'error'
						? 'Помилка ініціалізації'
						: 'Готовий'}
		</div>
	</footer>
</section>

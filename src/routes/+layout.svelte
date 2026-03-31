<script lang="ts">
	import '../app.css';
	import '$lib/i18n/i18n';

	import { bluetoothState } from '$lib/bluetooth.store.svelte';
	import { isInDemoMode } from '$lib/demo-mode.svelte';
	import { i18n } from '$lib/i18n/i18n';
	import NoSleep from 'nosleep.js';
	import { onMount } from 'svelte';
	import type { BluetoothError } from '$lib/common/types/common.types';
	import Button from '$lib/components/button.svelte';
	import { settingsStore, settingsSaveToLocalStorage } from '$lib/settings.store.svelte';

	let serialConnectionStatus = $derived(bluetoothState.serialConnectionStatus);
	let elmDeviceStatus = $derived(bluetoothState.elmDeviceStatus);
	let bluetoothError = $derived(bluetoothState.bluetoothError);
	let scannerName = $derived(bluetoothState.scannerName);
	let lastCommandTime = $derived(bluetoothState.lastCommandTime);
	let heartbeat = $derived.by(() => (bluetoothState.heartbeat % 3) + 1);

	let { children } = $props();

	let errorNotifications: BluetoothError[] = $derived.by(() =>
		bluetoothError ? [bluetoothError] : []
	);

	let hideNewScannerNotification = $state(false);
	let shouldShowNewScannerNotification = $derived.by(() => {
		return (
			elmDeviceStatus === 'ready' &&
			settingsStore.askAboutSavingDefaultScanner &&
			scannerName !== settingsStore.defaultScannerName &&
			!hideNewScannerNotification
		);
	});

	const saveScannerName = () => {
		hideNewScannerNotification = true;
		settingsStore.defaultScannerName = scannerName;
		settingsSaveToLocalStorage();
	};

	const discardSaveScannerName = () => {
		hideNewScannerNotification = true;
		settingsSaveToLocalStorage();
	};

	const discardAndDontAskAgainSaveScannerName = () => {
		settingsStore.askAboutSavingDefaultScanner = false;
		settingsSaveToLocalStorage();
	};

	const noSleep = new NoSleep();

	let isFullscreenActive = $state(false);

	const toggleFullscreen = () => {
		const appContainer = document.querySelector('#app');
		if (!appContainer) return;

		const isInFullScreen = Boolean(document.fullscreenElement);

		if (isInFullScreen) {
			document.exitFullscreen();
			noSleep.disable();
		} else {
			appContainer.requestFullscreen();
			noSleep.enable();
		}
	};

	onMount(() => {
		document.onfullscreenchange = (event) => {
			isFullscreenActive = Boolean(document.fullscreenElement);
		};
	});
</script>

{#if i18n.isInitialized}
	<div
		class={[
			'fixed right-2 bottom-2 z-10 flex flex-col gap-4 border-0',
			errorNotifications.length ? 'px-4 py-4' : ''
		]}
	>
		{#each errorNotifications as notification, index}
			{#if notification}
				<div
					class="red pointer-events-auto flex rounded-sm border-2 border-l-8 border-red-600 bg-red-950 px-8 py-4 pl-4 font-bold"
				>
					<div class="flex items-center gap-4">
						<span class="icon-[mdi--error-outline] text-2xl text-red-400"></span>
						{notification.params
							? i18n.t(notification.message, notification.params)
							: i18n.t(notification.message)}
					</div>
				</div>
			{/if}
		{/each}
		{#if shouldShowNewScannerNotification}
			<div
				class="neutral pointer-events-auto flex rounded-sm border-2 border-l-8 border-neutral-600 bg-neutral-950 px-8 py-4 pl-4 font-bold"
			>
				<div class="flex items-center gap-4">
					<span class="icon-[mdi--error-outline] text-2xl text-neutral-400"></span>
					<div>
						<p class="pb-4">{i18n.t('saveScannerHint')}</p>
						<div class="flex items-center gap-2">
							<Button size="compact" onclick={saveScannerName}
								><span class="capitalize">{i18n.t('yes')}</span></Button
							>
							<Button size="compact" variant="tertiary" onclick={discardSaveScannerName}
								><span class="capitalize">{i18n.t('no')}</span></Button
							>
							<Button
								size="compact"
								variant="tertiary"
								onclick={discardAndDontAskAgainSaveScannerName}>{i18n.t('neverAskAgain')}</Button
							>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
	<section class="flex h-full flex-col">
		<main class="flex grow flex-col overflow-auto">
			{@render children()}
		</main>
		<footer
			class={[
				'flex flex-nowrap justify-center gap-4 border-t-1 border-neutral-900 bg-neutral-100 py-1 text-sm text-neutral-800 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
				isInDemoMode
					? "after:width-[80%] after:absolute after:scale-125 after:overflow-hidden after:font-bold after:opacity-20 after:content-['Demo-Demo-Demo-Demo-Demo-Demo']"
					: ''
			]}
		>
			<div class="flex items-center">
				<button
					class="flex items-center rounded-sm p-2 hover:bg-neutral-600"
					onclick={toggleFullscreen}
					aria-label="Повноекранний режим"
				>
					{#if isFullscreenActive}
						<span class="icon-[mdi--fullscreen-exit]"></span>
					{:else}
						<span class="icon-[mdi--fullscreen]"></span>
					{/if}
				</button>
			</div>
			<div class="flex flex-wrap items-center gap-2">
				<span class="icon-[mdi--bluetooth-transfer]"></span>
				<div>
					<div class="leading-none font-bold">{i18n.t('bluetooth')}</div>
					<div>
						{serialConnectionStatus === 'idle' || serialConnectionStatus === 'disconnected'
							? i18n.t('notConnected')
							: serialConnectionStatus === 'connecting'
								? i18n.t('connecting')
								: serialConnectionStatus === 'error'
									? i18n.t('error')
									: i18n.t('connected')}
					</div>
				</div>
			</div>
			<div class="flex flex-wrap items-center gap-2">
				<span class="icon-[mdi--car-info]"></span>
				<div>
					<div class="leading-none font-bold">ELM 327</div>
					<div>
						{elmDeviceStatus === 'idle'
							? i18n.t('notInitialized')
							: elmDeviceStatus === 'initializing'
								? i18n.t('initializing')
								: elmDeviceStatus === 'error'
									? i18n.t('initError')
									: i18n.t('ready')}
					</div>
				</div>
			</div>
			<div class="flex items-center gap-2">
				{#if heartbeat === 1}
					<span class="icon-[mdi--signal-cellular-1]"></span>
				{:else if heartbeat === 2}
					<span class="icon-[mdi--signal-cellular-2]"></span>
				{:else}
					<span class="icon-[mdi--signal-cellular-3]"></span>
				{/if}
				<span class="block min-w-[6ch] text-end text-sm">
					{i18n.t('lastCommandTimeMs', { lastCommandTime })}
				</span>
			</div>
		</footer>
	</section>
{/if}

<script lang="ts">
	import { bluetoothState } from '$lib/bluetooth.store.svelte';
	import ButtonLink from '$lib/components/button-link.svelte';
	import { isInDemoMode, exitDemoMode, enterDemoMode } from '$lib/demo-mode.svelte';
	import { i18n } from '$lib/i18n/i18n';
	import {
		changeGeolocationEnabled,
		settingsStore,
		settingsSaveToLocalStorage
	} from '$lib/settings.store.svelte';

	let geolocationEnabled = $derived(settingsStore.geolocationEnabled);

	let currentGeolocationPermission = $derived(settingsStore.geoLocationPermission);

	const tryChangeGeolocationSetting = (event: Event) => {
		const target = event.target as HTMLInputElement;

		const newValue = target.checked;

		if (!newValue) {
			changeGeolocationEnabled(false);
			return;
		}

		if (currentGeolocationPermission === 'denied') {
			return;
		}

		const options = {
			enableHighAccuracy: true,
			timeout: 5000,
			maximumAge: 0
		};
		navigator.geolocation.getCurrentPosition(
			() => {
				changeGeolocationEnabled(true);
			},
			() => {
				// currentGeolocationPermission = 'denied';
			},
			options
		);
	};

	$effect(settingsSaveToLocalStorage);
</script>

<div class="h-full w-full p-2 dark:text-neutral-100">
	<div class="flex items-start gap-2 py-2">
		<ButtonLink href="/" aria-label="Назад" variant="tertiary" size="compact">
			<span class="icon-[mdi--arrow-back]"></span>
		</ButtonLink>
		<h2 class="flex-grow text-center text-lg font-bold dark:text-neutral-400">
			{i18n.t('settings')}
		</h2>
	</div>

	<div>
		<div class="flex items-center justify-between gap-2 border-b-1 border-neutral-600 p-2">
			<div>
				<div><strong>{i18n.t('useGeolocation')}</strong></div>
				{#if currentGeolocationPermission === 'granted' && !geolocationEnabled}
					{i18n.t('clickOnCheckboxToUseGeolocation')}
				{:else if currentGeolocationPermission === 'not available'}
					{i18n.t('notAvailable')}
				{:else if currentGeolocationPermission === 'denied'}
					{i18n.t('geolocationUseDenied')}
				{/if}
			</div>
			<div class="basis-24 border-l-1 border-neutral-600 p-2 text-center">
				<input
					type="checkbox"
					class="h-4 w-4"
					checked={geolocationEnabled}
					onclick={tryChangeGeolocationSetting}
					disabled={currentGeolocationPermission === 'denied'}
				/>
			</div>
		</div>
		<div class="flex items-center justify-between gap-2 border-b-1 border-neutral-600 p-2">
			<div>{i18n.t('pricePerKwh')}</div>
			<div class="flex basis-24 justify-end border-l-1 border-neutral-600">
				<input type="number" step="0.01" class="w-18 p-2" bind:value={settingsStore.priceOfKwh} />
			</div>
		</div>
		<div class="flex items-center justify-between gap-2 border-b-1 border-neutral-600 p-2">
			<div>{i18n.t('defaultScannerName')}</div>
			<div class="flex basis-24 justify-end border-l-1 border-neutral-600">
				<input type="text" class="w-18 p-2" bind:value={settingsStore.defaultScannerName} />
			</div>
		</div>
		<div class="flex items-center justify-between gap-2 border-b-1 border-neutral-600 p-2">
			<div>{i18n.t('askAbountSavingDefaultScanner')}</div>
			<div class="basis-24 border-l-1 border-neutral-600 p-2 text-center">
				<input
					type="checkbox"
					class="h-4 w-4"
					bind:checked={settingsStore.askAboutSavingDefaultScanner}
				/>
			</div>
		</div>
	</div>
	<div class="mt-8 flex flex-col items-center justify-center gap-2">
		<ButtonLink
			href="/debugger"
			onclick={() => (bluetoothState.isElmDebuggerEnabled = true)}
			variant="secondary">{i18n.t('debugger')}</ButtonLink
		>
		<ButtonLink
			href="/settings"
			variant="tertiary"
			onclick={isInDemoMode ? exitDemoMode : enterDemoMode}
		>
			{#if isInDemoMode}
				{i18n.t('exitDemoMode')}
			{:else}
				{i18n.t('demoMode')}
			{/if}</ButtonLink
		>
	</div>
</div>

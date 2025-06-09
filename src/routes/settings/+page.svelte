<script lang="ts">
	import { bluetoothState } from '$lib/bluetooth.store.svelte';
	import ButtonLink from '$lib/components/button-link.svelte';
	import { changeGeolocationEnabled, settingsStore } from '$lib/settings.store.svelte';

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
</script>

<div class="h-full w-full p-2 dark:text-neutral-100">
	<div class="flex items-start gap-2 py-2">
		<ButtonLink href="/" aria-label="Назад" variant="tertiary" size="compact">
			<span class="icon-[mdi--arrow-back]"></span>
		</ButtonLink>
		<h2 class="flex-grow text-center text-lg font-bold dark:text-neutral-400">Налаштування</h2>
	</div>

	<div>
		<div class="flex items-center justify-between gap-2 border-b-1 border-neutral-600 p-2">
			<div>
				<div><strong>Використовувати геолокацію</strong></div>
				{#if currentGeolocationPermission === 'granted' && !geolocationEnabled}
					Натисніть на прапорець для використання
				{:else if currentGeolocationPermission === 'not available'}
					Недоступно
				{:else if currentGeolocationPermission === 'denied'}
					Використання геолокації заборонено
				{/if}
			</div>
			<div class="basis-10 border-l-1 border-neutral-600 pt-1 pl-2">
				<input
					type="checkbox"
					class="h-4 w-4"
					checked={geolocationEnabled}
					onclick={tryChangeGeolocationSetting}
					disabled={currentGeolocationPermission === 'denied'}
				/>
			</div>
		</div>
	</div>
	<div class="mt-8 flex items-center justify-center">
		<ButtonLink
			href="/debugger"
			onclick={() => (bluetoothState.isElmDebuggerEnabled = true)}
			variant="secondary">Налагоджувач</ButtonLink
		>
	</div>
</div>

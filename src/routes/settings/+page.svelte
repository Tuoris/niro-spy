<script lang="ts">
	import ButtonLink from '$lib/components/button-link.svelte';
	import Button from '$lib/components/button.svelte';
	import { settingsStore } from '$lib/settings.store.svelte';

	const isGeolocationSupported = navigator?.geolocation;

	const geolocationRequest = $state({
		idle: true,
		loading: false,
		error: false
	});
	const checkGeolocation = () => {
		const options = {
			enableHighAccuracy: true,
			timeout: 5000,
			maximumAge: 0
		};
		geolocationRequest.idle = false;
		navigator.geolocation.getCurrentPosition(
			() => {
				geolocationRequest.loading = false;
				geolocationRequest.error = false;
				settingsStore.geolocationAllowed = true;
			},
			() => {
				geolocationRequest.loading = false;
				geolocationRequest.error = true;
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

	<div class="mx-auto mt-4 mb-4 flex max-w-2xl flex-col">
		<div>
			<Button onclick={checkGeolocation} disabled={!isGeolocationSupported}
				>{geolocationRequest.idle
					? 'Використовувати геолокацію'
					: geolocationRequest.loading
						? 'Запит використання...'
						: geolocationRequest.error
							? 'Помилка'
							: 'Використання геолокації дозволено'}</Button
			>
		</div>
	</div>
</div>

<script lang="ts">
	import { bluetoothState } from '$lib/bluetooth.store.svelte';
	import { PARAM_FIELDS } from '$lib/common/constants/common-params.constants';
	import ButtonLink from '$lib/components/button-link.svelte';
	import Button from '$lib/components/button.svelte';
	import { paramsState, type ParamValue } from '$lib/params.svelte';
	import { downloadTripDataFile } from '$lib/trip-data';

	const averageByTime = (values: ParamValue[]) => {
		const numberOfValues = values.length;

		if (numberOfValues === 0) {
			return 0;
		}

		const firstValue = values[0];
		if (numberOfValues === 1) {
			return firstValue.value;
		}

		const lastValue = values[numberOfValues - 1];
		const timePassed = lastValue.timestamp - firstValue.timestamp;

		let accumulatedValue = 0;
		for (let index = 1; index < values.length; index++) {
			const value = values[index];
			const previousValue = values[index - 1];

			accumulatedValue +=
				((value.value + previousValue.value) / 2) * (value.timestamp - previousValue.timestamp);
		}

		const average = accumulatedValue / timePassed;

		return average;
	};

	let averageSpeedByTime = $derived.by(() => {
		const speedValues = paramsState.values[PARAM_FIELDS.VEHICLE_SPEED];

		return averageByTime(speedValues);
	});

	let averageGpsSpeedByTime = $derived.by(() => {
		const speedValues = paramsState.values[PARAM_FIELDS.SPEED_GPS];

		return averageByTime(speedValues);
	});

	let distanceTraveled = $derived.by(() => {
		const speedValues = paramsState.values[PARAM_FIELDS.VEHICLE_SPEED];

		const numberOfValues = speedValues.length;

		if (numberOfValues < 2) {
			return 0;
		}

		const firstValue = speedValues[0];
		const lastValue = speedValues[numberOfValues - 1];

		const timePassedMs = lastValue.timestamp - firstValue.timestamp;
		const timePassedHours = timePassedMs / 1000 / 60 / 60;

		return averageSpeedByTime * timePassedHours;
	});

	let distanceTraveledGps = $derived.by(() => {
		const speedValues = paramsState.values[PARAM_FIELDS.SPEED_GPS];

		const numberOfValues = speedValues.length;

		if (numberOfValues < 2) {
			return 0;
		}

		const firstValue = speedValues[0];
		const lastValue = speedValues[numberOfValues - 1];

		const timePassedMs = lastValue.timestamp - firstValue.timestamp;
		const timePassedHours = timePassedMs / 1000 / 60 / 60;

		return averageGpsSpeedByTime * timePassedHours;
	});

	let averagePowerByTime = $derived.by(() => {
		const powerValues = paramsState.values[PARAM_FIELDS.BATTERY_POWER];

		return averageByTime(powerValues);
	});

	let energyConsumed = $derived.by(() => {
		const powerValues = paramsState.values[PARAM_FIELDS.VEHICLE_SPEED];

		const numberOfValues = powerValues.length;

		if (numberOfValues < 2) {
			return 0;
		}

		const firstValue = powerValues[0];
		const lastValue = powerValues[numberOfValues - 1];

		const timePassedMs = lastValue.timestamp - firstValue.timestamp;
		const timePassedHours = timePassedMs / 1000 / 60 / 60;

		return averagePowerByTime * timePassedHours;
	});

	let consumption = $derived.by(() => {
		if (energyConsumed === 0 || distanceTraveled === 0) {
			return 0;
		}
		const energyConsumedKwh = energyConsumed / 1000;
		return energyConsumedKwh / (distanceTraveled / 100);
	});

	let consumptionGps = $derived.by(() => {
		if (energyConsumed === 0 || distanceTraveledGps === 0) {
			return 0;
		}
		const energyConsumedKwh = energyConsumed / 1000;
		return energyConsumedKwh / (distanceTraveledGps / 100);
	});

	let tripTime = $derived.by(() => {
		const currentTime = new Date().valueOf();
		const powerValues = paramsState.values[PARAM_FIELDS.BATTERY_POWER];
		const speedValues = paramsState.values[PARAM_FIELDS.VEHICLE_SPEED];

		let startTime = currentTime;
		let endTime = currentTime;

		if (powerValues.length) {
			startTime = powerValues[0].timestamp;
		}

		if (powerValues.length > 1 && paramsState.recording) {
			endTime = powerValues[powerValues.length - 1].timestamp;
		}

		const milliseconds = endTime - startTime;

		const seconds = Math.round(milliseconds / 1000);
		const minutes = Math.round(seconds / 60);
		const hours = Math.round(minutes / 60);

		return `${(hours % 24).toFixed().padStart(2, '0')}:${(minutes % 60).toFixed().padStart(2, '0')}:${(seconds % 60).toFixed().padStart(2, '0')}`;
	});

	let altitudeChange = $derived.by(() => {
		const altitudeGpsValues = paramsState.values[PARAM_FIELDS.ALTITUDE_GPS];

		const numberOfValues = altitudeGpsValues.length;
		if (numberOfValues <= 1) {
			return '0';
		}

		const firstValue = altitudeGpsValues[0];
		const lastValue = altitudeGpsValues[numberOfValues - 1];

		const altitudeChange = lastValue.value - firstValue.value;
		const sign = altitudeChange > 0 ? '+' : '-';
		return `${sign}${Math.abs(altitudeChange).toFixed()}`;
	});

	const downloadData = () => downloadTripDataFile({ values: paramsState.values });

	let fileInput: HTMLInputElement;
	let files: FileList | null = $state(null);
	const loadData = () => {
		bluetoothState.stopPollingCommand = true;
		fileInput.click();
	};

	$effect(() => {
		if (!files) {
			return;
		}

		try {
			const jsonFile = files[0];

			const reader = new FileReader();
			reader.onload = function (event) {
				try {
					const fileContent = JSON.parse(event.target?.result as string);
					if ('values' in fileContent) {
						paramsState.values = fileContent.values;
						paramsState.recording = true;
					}
				} catch {}
			};
			reader.readAsText(jsonFile);
		} catch {}
	});
</script>

{#snippet valueCard(name: string, value: string, unit: string)}
	<div class="rounded-xs border border-neutral-800 p-2 py-4">
		<div class=" min-h-[3em] dark:text-neutral-300">{name}</div>
		<div class="text-end text-3xl">
			{value}
			<span class="text-sm">
				{unit}
			</span>
		</div>
	</div>
{/snippet}

<div class="h-full w-full p-2 dark:text-neutral-100">
	<div class="flex items-start gap-2 py-2">
		<ButtonLink href="/" aria-label="Назад" variant="tertiary" size="compact">
			<span class="icon-[mdi--arrow-back]"></span>
		</ButtonLink>
		<h2 class="flex-grow text-center text-lg font-bold dark:text-neutral-400">Поїздка</h2>
		<Button
			variant="tertiary"
			size="compact"
			aria-label="Завантажити дані про поїздку"
			onclick={downloadData}
		>
			<span class="icon-[mdi--file-download-outline]"></span>
		</Button>
		<Button
			variant="tertiary"
			size="compact"
			aria-label="Відкрити дані про поїздку"
			onclick={loadData}
		>
			<span class="icon-[mdi--file-upload-outline]"></span>
		</Button>
		<input type="file" bind:files bind:this={fileInput} accept=".json" hidden />
	</div>

	<div class="mx-auto mt-4 mb-4 grid max-w-2xl grid-cols-2 gap-4">
		{@render valueCard(
			'Середня потужність',
			(averagePowerByTime > 1000 ? averagePowerByTime / 1000 : averagePowerByTime).toFixed(1),
			averagePowerByTime > 1000 ? 'кВт' : 'Вт'
		)}
		{@render valueCard(
			'Спожито',
			(energyConsumed > 1000 ? energyConsumed / 1000 : energyConsumed).toFixed(),
			energyConsumed > 1000 ? 'кВт·год' : 'Вт·год'
		)}
		{@render valueCard('Середня швидкість', averageSpeedByTime.toFixed(), 'км/год')}
		{@render valueCard('Середня швидкість (GPS)', averageGpsSpeedByTime.toFixed(), 'км/год')}
		{@render valueCard('Пройдена відстань', distanceTraveled.toFixed(2), 'км')}
		{@render valueCard('Пройдена відстань (GPS)', distanceTraveledGps.toFixed(2), 'км')}
		{@render valueCard('Середня витрата', consumption.toFixed(1), 'кВт·год/100км')}
		{@render valueCard('Середня витрата (GPS)', consumptionGps.toFixed(1), 'кВт·год/100км')}
		{@render valueCard('Час поїздки', tripTime, '')}
		{@render valueCard('Зміна висот', altitudeChange, 'м')}
	</div>
</div>

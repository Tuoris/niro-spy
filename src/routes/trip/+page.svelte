<script lang="ts">
	import { PARAM_FIELDS } from '$lib/common/constants/common-params.constants';
	import ButtonLink from '$lib/components/button-link.svelte';
	import { paramsState, type ParamValue } from '$lib/params.svelte';

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
		if (energyConsumed === 0 && distanceTraveled === 0) {
			return 0;
		}
		const energyConsumedKwh = energyConsumed / 1000;
		return energyConsumedKwh / (distanceTraveled / 100);
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
		{@render valueCard('Середня швидкість (GPS)', '-', 'км/год')}
		{@render valueCard('Пройдена відстань', distanceTraveled.toFixed(2), 'км')}
		{@render valueCard('Пройдена відстань (GPS)', '-', 'км')}
		{@render valueCard('Середня витрата', consumption.toFixed(1), 'кВт·год/100км')}
		{@render valueCard('Середня витрата (GPS)', '-', 'кВт·год/100км')}
	</div>
</div>

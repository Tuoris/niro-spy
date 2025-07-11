<script lang="ts">
	import { PARAM_FIELDS, type FieldType } from '$lib/common/constants/common-params.constants';
	import { UNIT_LABELS } from '$lib/common/constants/unit-labels.constants';
	import ButtonLink from '$lib/components/button-link.svelte';
	import Button from '$lib/components/button.svelte';
	import { i18n } from '$lib/i18n/i18n';
	import { paramsState } from '$lib/params.svelte';

	const NUMBER_OF_BATTERY_CELLS = 98;
	const NUMBER_OF_ROWS = 7;
	const NUMBER_OF_COLUMNS = 14;

	let liveValues = $state(paramsState.values);

	const getLastLiveValue = (field: FieldType) => {
		const liveValuesForParam = liveValues[field];

		if (!liveValuesForParam?.length) {
			return 0;
		}

		const lastValue = liveValuesForParam[liveValuesForParam.length - 1].value;

		return lastValue;
	};

	const getMinLiveValue = (field: FieldType) => {
		const liveValuesForParam = liveValues[field];

		if (!liveValuesForParam?.length) {
			return 0;
		}

		const lastValue = Math.min(...liveValues[field].map((value) => value.value));

		return lastValue;
	};

	let socValue = $derived(getLastLiveValue(PARAM_FIELDS.SOC_BMS));
	let sohValue = $derived(getLastLiveValue(PARAM_FIELDS.SOH));
	let averageLifetimeConsumption = $derived(
		getLastLiveValue(PARAM_FIELDS.AVERAGE_LIFETIME_CONSUMPTION)
	);
	let maxPower = $derived(getLastLiveValue(PARAM_FIELDS.MAX_POWER));
	let maxRegenerationPower = $derived(getLastLiveValue(PARAM_FIELDS.MAX_REGENERATION_POWER));
	let batteryPower = $derived(getLastLiveValue(PARAM_FIELDS.BATTERY_POWER));
	let isBatteryCharging = $derived(getLastLiveValue(PARAM_FIELDS.IS_BATTERY_CHARGING));
	let averageTemperature = $derived.by(() => {
		const temperatures = [
			getLastLiveValue(PARAM_FIELDS.BATTERY_TEMP_1),
			getLastLiveValue(PARAM_FIELDS.BATTERY_TEMP_2),
			getLastLiveValue(PARAM_FIELDS.BATTERY_TEMP_3),
			getLastLiveValue(PARAM_FIELDS.BATTERY_TEMP_4)
		];

		const average = temperatures.reduce((a, b) => a + b, 0) / temperatures.length;

		return average;
	});

	let isPaused = $state(false);
	let trackMinCellVoltages = $state(false);

	let lastCellVoltages: number[] = $state([]);

	let cellVoltageValues = $derived(
		Array.from({ length: NUMBER_OF_BATTERY_CELLS }).map((_, index) => {
			return getLastLiveValue(
				`cellVoltage${(index + 1).toString().padStart(2, '0')}` as keyof typeof liveValues
			);
		})
	);

	const cellVoltagesToDisplay = $derived(
		isPaused
			? lastCellVoltages
			: trackMinCellVoltages
				? Array.from({ length: NUMBER_OF_BATTERY_CELLS }).map((_, index) => {
						return getMinLiveValue(
							`cellVoltage${(index + 1).toString().padStart(2, '0')}` as keyof typeof liveValues
						);
					})
				: cellVoltageValues
	);

	const mostCommonValue = $derived.by(() => {
		const valuesCount: Record<string, number> = {};

		for (let i = 0; i < cellVoltagesToDisplay.length; i++) {
			const value = (cellVoltagesToDisplay[i] * 100).toFixed();
			if (!valuesCount[value]) {
				valuesCount[value] = 0;
			}

			valuesCount[value] += 1;
		}

		const mostCommonValueAsString = Object.entries(valuesCount).sort((a, b) => b[1] - a[1])[0][0];
		const mostCommonValue = parseInt(mostCommonValueAsString) / 100;

		return mostCommonValue;
	});

	const goodCellThreshold = 0.035;
	const warningCellThreshold = 0.2;

	const getCellColorClass = (currentValue: number, mostCommonValue: number) => {
		if (
			currentValue > mostCommonValue - goodCellThreshold &&
			currentValue < mostCommonValue + goodCellThreshold
		) {
			return 'bg-green-400';
		}

		if (
			currentValue > mostCommonValue - warningCellThreshold &&
			currentValue < mostCommonValue + warningCellThreshold
		) {
			return 'bg-yellow-400';
		}

		return 'bg-red-400';
	};
</script>

{#snippet valueCard(name: string, value: string, unit: string, showWarning: boolean = false)}
	<div class="rounded-xs border border-neutral-800 p-2 py-4">
		<div class=" min-h-[3em] dark:text-neutral-300">{name}</div>
		<div class={['text-end text-3xl ', showWarning ? 'text-red-300' : '']}>
			{value}
			<span class="text-sm">
				{unit}
			</span>
		</div>
	</div>
{/snippet}

<div class="h-full w-full p-2 dark:text-neutral-100">
	<div class="flex gap-2 py-2">
		<ButtonLink href="/" aria-label="Назад" variant="tertiary" size="compact">
			<span class="icon-[mdi--arrow-back]"></span>
		</ButtonLink>
		<h2 class="flex-grow text-center text-lg font-bold dark:text-neutral-400">
			{i18n.t('batteryHeader')}
		</h2>
	</div>

	<div class="mx-auto mt-4 mb-4 grid max-w-2xl grid-cols-2 gap-4 pb-4 lg:max-w-4xl lg:grid-cols-4">
		{@render valueCard(
			i18n.t('socVerbose'),
			socValue.toFixed(1),
			i18n.t(UNIT_LABELS.PERCENT),
			socValue < 10
		)}
		{@render valueCard(
			i18n.t('averageLifetimeConsumption'),
			averageLifetimeConsumption.toFixed(1),
			i18n.t(UNIT_LABELS.KILOWATT_HOUR_PER_100_KILOMETERS),
			averageLifetimeConsumption > 22 || averageLifetimeConsumption < 16
		)}
		{@render valueCard(
			i18n.t('sohoVerbose'),
			sohValue.toFixed(1),
			i18n.t(UNIT_LABELS.PERCENT),
			sohValue < 100
		)}
		{@render valueCard(
			i18n.t('batteryTemperature'),
			averageTemperature.toFixed(1),
			i18n.t(UNIT_LABELS.CELSIUS),
			averageTemperature > 55 || averageTemperature < -10
		)}
		{@render valueCard(i18n.t('availablePower'), maxPower.toFixed(), i18n.t(UNIT_LABELS.KILOWATT))}
		{@render valueCard(
			i18n.t('availableRegenPower'),
			maxRegenerationPower.toFixed(),
			i18n.t(UNIT_LABELS.KILOWATT)
		)}

		{@render valueCard(
			i18n.t('batteryPower'),
			Math.abs(batteryPower) > 1000 ? (batteryPower / 1000).toFixed(2) : batteryPower.toFixed(),
			Math.abs(batteryPower) > 1000 ? i18n.t(UNIT_LABELS.KILOWATT) : i18n.t(UNIT_LABELS.WATT)
		)}
		{@render valueCard(
			i18n.t('chargingOrRegen'),
			isBatteryCharging ? i18n.t('yes') : i18n.t('no'),
			''
		)}
	</div>

	<h2 class="text-center text-lg font-bold dark:text-neutral-400">Елементи</h2>
	<div class="mx-auto max-w-2xl">
		<div>
			{i18n.t('mostCommonCellVoltage')} <strong>{mostCommonValue}</strong>
			{i18n.t(UNIT_LABELS.VOLT)}
		</div>
		<div>
			{i18n.t('cellVoltageDifference')}:
			<strong>
				{Math.abs(Math.max(...cellVoltageValues) - Math.min(...cellVoltageValues)).toFixed(2)}
			</strong>
			{i18n.t(UNIT_LABELS.VOLT)}
		</div>
		<div class="flex items-start justify-between gap-2 py-2">
			<Button
				aria-label="Показувати мінімальні/середні напруги"
				variant="tertiary"
				size="compact"
				onclick={() => (trackMinCellVoltages = !trackMinCellVoltages)}
				><span
					class={trackMinCellVoltages
						? 'icon-[mdi--align-vertical-center]'
						: 'icon-[mdi--align-vertical-bottom]'}
				></span></Button
			>
			<h3>{trackMinCellVoltages ? i18n.t('minCellVoltages') : i18n.t('liveCellVoltages')}</h3>
			<Button
				variant="tertiary"
				size="compact"
				aria-label="Пауза/Відновити"
				onclick={() => {
					lastCellVoltages = cellVoltageValues;
					isPaused = !isPaused;
				}}
			>
				<span class={[isPaused ? 'icon-[mdi--play]' : 'icon-[mdi--pause]']}></span>
			</Button>
		</div>
	</div>
	<div class="flex w-full justify-center py-4">
		<div class="grid grid-cols-7 gap-1">
			{#each { length: NUMBER_OF_ROWS } as _, rowIndex}
				{#each { length: NUMBER_OF_COLUMNS } as _, columnIndex}
					<div
						class={[
							'relative flex h-10 w-10 items-center justify-center rounded-sm font-bold text-neutral-800',
							getCellColorClass(
								cellVoltagesToDisplay[rowIndex * NUMBER_OF_COLUMNS + columnIndex],
								mostCommonValue
							)
						]}
					>
						<small class="absolute top-[-2px] right-1 text-[10px] font-normal">
							#{rowIndex * NUMBER_OF_COLUMNS + columnIndex + 1}
						</small>
						{cellVoltagesToDisplay[rowIndex * NUMBER_OF_COLUMNS + columnIndex].toFixed(2)}
					</div>
				{/each}
			{/each}
		</div>
	</div>
</div>

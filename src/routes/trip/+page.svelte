<script lang="ts">
	import { bluetoothState } from '$lib/bluetooth.store.svelte';
	import { PARAM_FIELDS } from '$lib/common/constants/common-params.constants';
	import { UNIT_LABELS } from '$lib/common/constants/unit-labels.constants';
	import { HKMC_GEARS } from '$lib/common/constants/vmcu.constants';
	import ButtonLink from '$lib/components/button-link.svelte';
	import Button from '$lib/components/button.svelte';
	import { i18n } from '$lib/i18n/i18n';
	import { paramsState, type ParamStateValues, type ParamValue } from '$lib/params.svelte';
	import { settingsStore } from '$lib/settings.store.svelte';
	import { downloadTripDataFile } from '$lib/trip-data';
	import { RangeSlider } from 'svelte-range-slider-pips';

	const NOMINAL_BATTER_VOLTAGE_64_KWH = 3.63 * 98;
	const NOMINAL_BATTER_VOLTAGE_39_KWH = 3.63 * 90;
	const NOMINAL_BATTER_CAPACITY_64_KWH = 64.8;
	const NOMINAL_BATTER_CAPACITY_39_KWH = 39.2;

	let recordingSliderValues = $state([0, 100]);
	let recordingSliderStart = $derived(recordingSliderValues[0]);
	let recordingSliderEnd = $derived(recordingSliderValues[1]);

	const tripFullTimeRange = $derived.by(() => {
		const currentTime = new Date().valueOf();
		const powerValues = paramsState.values[PARAM_FIELDS.BATTERY_POWER];
		const speedValues = paramsState.values[PARAM_FIELDS.ODOMETER_KM];
		const motorTemperatureValues = paramsState.values[PARAM_FIELDS.MOTOR_TEMPERATURE];

		let startTime = currentTime;
		let endTime = currentTime;

		if (powerValues.length && speedValues.length && motorTemperatureValues.length) {
			startTime = powerValues[0].timestamp;
		}

		if (
			powerValues.length > 1 &&
			speedValues.length > 1 &&
			motorTemperatureValues.length > 1 &&
			paramsState.recording
		) {
			endTime = Math.max(
				powerValues[powerValues.length - 1].timestamp,
				speedValues[speedValues.length - 1].timestamp,
				motorTemperatureValues[motorTemperatureValues.length - 1].timestamp
			);
		}

		return { startTime, endTime };
	});

	const recordingTimeRange = $derived.by(() => {
		const { startTime, endTime } = tripFullTimeRange;

		if (!paramsState.recording) {
			return tripFullTimeRange;
		}

		const recordingStartTime = startTime + (recordingSliderStart / 100) * (endTime - startTime);
		const recordingEndTime = startTime + (recordingSliderEnd / 100) * (endTime - startTime);

		return { startTime: recordingStartTime, endTime: recordingEndTime };
	});

	const filterValuesWithSlider = (values: ParamValue[]) => {
		if (!paramsState.recording) {
			return values;
		}

		if (recordingSliderStart === 0 && recordingSliderEnd === 100) {
			return values;
		}

		const { startTime, endTime } = recordingTimeRange;

		return values.filter(({ timestamp }) => timestamp >= startTime && timestamp <= endTime);
	};

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

		return averageByTime(filterValuesWithSlider(speedValues));
	});

	let averageGpsSpeedByTime = $derived.by(() => {
		const speedValues = paramsState.values[PARAM_FIELDS.SPEED_GPS];

		return averageByTime(filterValuesWithSlider(speedValues));
	});

	let distanceTraveled = $derived.by(() => {
		let speedValues = paramsState.values[PARAM_FIELDS.VEHICLE_SPEED];
		speedValues = filterValuesWithSlider(speedValues);

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
		let speedValues = paramsState.values[PARAM_FIELDS.SPEED_GPS];
		speedValues = filterValuesWithSlider(speedValues);

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

	let parkingIntervals = $derived.by(() => {
		const currentGearValues = paramsState.values[PARAM_FIELDS.GEAR];
		const intervalsWhenOnParking = [];
		let onParkingStartTimestamp = null;
		let onParkingEndTimestamp = null;
		for (const gearValue of currentGearValues) {
			if (gearValue.value === HKMC_GEARS.PARKING) {
				if (!onParkingStartTimestamp) {
					onParkingStartTimestamp = gearValue.timestamp;
				} else {
					onParkingEndTimestamp = gearValue.timestamp;
				}
			} else {
				if (onParkingStartTimestamp) {
					intervalsWhenOnParking.push([
						onParkingStartTimestamp,
						onParkingEndTimestamp ? onParkingEndTimestamp : onParkingStartTimestamp
					]);
				}
				onParkingStartTimestamp = null;
				onParkingEndTimestamp = null;
			}
		}

		if (onParkingStartTimestamp) {
			intervalsWhenOnParking.push([
				onParkingStartTimestamp,
				onParkingEndTimestamp ? onParkingEndTimestamp : onParkingStartTimestamp
			]);
		}

		return intervalsWhenOnParking;
	});

	const filterValuesWhenNotOnCharging = (values: ParamValue[]) => {
		const valuesWhenNotOnCharing = values.filter(({ timestamp, value }) => {
			if (value > 0) {
				return true;
			}

			for (const parkingInterval of parkingIntervals) {
				if (timestamp >= parkingInterval[0] && timestamp <= parkingInterval[1]) {
					return false;
				}
			}

			return true;
		});

		return valuesWhenNotOnCharing;
	};

	let averagePowerByTime = $derived.by(() => {
		const powerValues = paramsState.values[PARAM_FIELDS.BATTERY_POWER];
		const filteredPowerValues = filterValuesWithSlider(powerValues);
		const powerValuesWhenNotOnCharing = filterValuesWhenNotOnCharging(filteredPowerValues);

		return averageByTime(powerValuesWhenNotOnCharing);
	});

	let energyConsumed = $derived.by(() => {
		let powerValues = paramsState.values[PARAM_FIELDS.VEHICLE_SPEED];
		powerValues = filterValuesWithSlider(powerValues);

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
		if (energyConsumed <= 0 || distanceTraveledGps === 0) {
			return 0;
		}
		const energyConsumedKwh = energyConsumed / 1000;
		return energyConsumedKwh / (distanceTraveledGps / 100);
	});

	let tripTime = $derived.by(() => {
		const { startTime, endTime } = recordingTimeRange;

		const milliseconds = endTime - startTime;

		const seconds = Math.floor(milliseconds / 1000);
		const minutes = Math.floor(seconds / 60);
		const hours = Math.floor(minutes / 60);

		return `${(hours % 24).toFixed().padStart(2, '0')}:${(minutes % 60).toFixed().padStart(2, '0')}:${(seconds % 60).toFixed().padStart(2, '0')}`;
	});

	let altitudeChange = $derived.by(() => {
		let altitudeGpsValues = paramsState.values[PARAM_FIELDS.ALTITUDE_GPS];
		altitudeGpsValues = filterValuesWithSlider(altitudeGpsValues);

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

	let tripPrice = $derived.by(() => {
		const energyConsumedKwh = energyConsumed / 1000;
		if (energyConsumedKwh < 0) {
			return 0;
		}

		const tripPrice = energyConsumedKwh * settingsStore.priceOfKwh;
		return tripPrice;
	});

	let pricePerKm = $derived.by(() => {
		if (distanceTraveled === 0) {
			return 0;
		}

		const pricePerKm = tripPrice / distanceTraveled;
		return pricePerKm;
	});

	let energyDischargedPerTrip = $derived.by(() => {
		let cumulativeEnergyDischarged = paramsState.values[PARAM_FIELDS.CUMULATIVE_ENERGY_DISCHARGED];
		cumulativeEnergyDischarged = filterValuesWithSlider(cumulativeEnergyDischarged);
		cumulativeEnergyDischarged = filterValuesWhenNotOnCharging(cumulativeEnergyDischarged);

		if (cumulativeEnergyDischarged.length < 2) {
			return null;
		}

		const energyDischargedPerTrip =
			cumulativeEnergyDischarged[cumulativeEnergyDischarged.length - 1].value -
			cumulativeEnergyDischarged[0].value;

		return energyDischargedPerTrip;
	});

	let energyChargedPerTrip = $derived.by(() => {
		let cumulativeEnergyCharged = paramsState.values[PARAM_FIELDS.CUMULATIVE_ENERGY_CHARGED];
		cumulativeEnergyCharged = filterValuesWithSlider(cumulativeEnergyCharged);
		cumulativeEnergyCharged = filterValuesWhenNotOnCharging(cumulativeEnergyCharged);

		if (cumulativeEnergyCharged.length < 2) {
			return null;
		}

		const energyChargedPerTrip =
			cumulativeEnergyCharged[cumulativeEnergyCharged.length - 1].value -
			cumulativeEnergyCharged[0].value;

		return energyChargedPerTrip;
	});

	const is64kwhModel = $derived.by(() => {
		const cellVoltage98Values = paramsState.values[PARAM_FIELDS.CELL_VOLTAGE_98];

		if (!cellVoltage98Values.length) {
			// fallback to 64 kWh model
			return true;
		}

		return cellVoltage98Values[0].value !== 0;
	});

	const filterPowerValuesWhenNotOnCharging = (
		powerValues: ParamValue[],
		parkingIntervals: number[][]
	) =>
		powerValues.filter(({ timestamp, value }) => {
			if (value > 0) {
				return true;
			}
			for (const parkingInterval of parkingIntervals) {
				if (timestamp >= parkingInterval[0] && timestamp <= parkingInterval[1]) {
					return false;
				}
			}
			return true;
		});

	const filterValuesWhenExternallyCharged = (values: ParamValue[], parkingIntervals: number[][]) =>
		values.filter(({ timestamp, value }) => {
			for (const parkingInterval of parkingIntervals) {
				if (timestamp >= parkingInterval[0] && timestamp <= parkingInterval[1] && value < 0) {
					return true;
				}
			}
			return false;
		});

	const getDataForCapacityCalculation = (
		paramsStateValues: ParamStateValues,
		filterValueFunction: (values: ParamValue[]) => ParamValue[]
	) => {
		let socBms = paramsStateValues[PARAM_FIELDS.SOC_BMS];
		socBms = filterValueFunction ? filterValueFunction(socBms) : socBms;

		let dischargedAh = paramsStateValues[PARAM_FIELDS.CUMULATIVE_CAPACITY_DISCHARGED];
		dischargedAh = filterValueFunction ? filterValueFunction(dischargedAh) : dischargedAh;

		let chargedAh = paramsStateValues[PARAM_FIELDS.CUMULATIVE_CAPACITY_CHARGED];
		chargedAh = filterValueFunction ? filterValueFunction(chargedAh) : chargedAh;

		let power = paramsStateValues[PARAM_FIELDS.BATTERY_POWER];
		power = filterValueFunction ? filterValueFunction(power) : power;

		let currentGearValue = paramsStateValues[PARAM_FIELDS.GEAR];
		currentGearValue = filterValueFunction
			? filterValueFunction(currentGearValue)
			: currentGearValue;

		let isExternallyCharged = filterValuesWhenExternallyCharged(power, parkingIntervals).length;

		return {
			socBms: socBms,
			dischargedAh: dischargedAh,
			chargedAh: chargedAh,
			power: power,
			isExternallyCharged: isExternallyCharged
		};
	};

	const calculateBatteryCapacityForSamplingRange = (
		socBmsValues: ParamValue[],
		dischargedAhValues: ParamValue[],
		chargedAhValues: ParamValue[],
		is64kwhModel: boolean,
		startIndex = 0,
		endIndex = 1
	) => {
		const socChange =
			socBmsValues[startIndex].value - socBmsValues[socBmsValues.length - endIndex].value;
		const dischargedAhChange =
			dischargedAhValues[dischargedAhValues.length - endIndex].value -
			dischargedAhValues[startIndex].value;
		const chargedAhChange =
			chargedAhValues[chargedAhValues.length - endIndex].value - chargedAhValues[startIndex].value;

		const calculatedCapacityAh = (dischargedAhChange - chargedAhChange) / (socChange / 100);

		const packVoltage = is64kwhModel
			? NOMINAL_BATTER_VOLTAGE_64_KWH
			: NOMINAL_BATTER_VOLTAGE_39_KWH;

		return (calculatedCapacityAh * packVoltage) / 1000;
	};
	const roundToFraction = (value: number, numerator: number, denominator: number) =>
		Math.round((value * denominator) / numerator) / (denominator / numerator);

	const calculateBatteryCapacity = (
		paramsStateValues: ParamStateValues,
		is64kwhModel: boolean,
		filterValueFunction: (values: ParamValue[]) => ParamValue[]
	) => {
		const {
			socBms: socBmsValues,
			dischargedAh: dischargedAhValues,
			chargedAh: chargedAhValues,
			power: powerValues
		} = getDataForCapacityCalculation(paramsStateValues, filterValueFunction);

		if (powerValues.length < 2) {
			return null;
		}

		const averagePower = averageByTime(powerValues);
		const firstPowerValue = powerValues[0];
		const hoursPassed =
			(powerValues[powerValues.length - 1].timestamp - firstPowerValue.timestamp) / 1000 / 60 / 60;

		if ((averagePower * hoursPassed) / 1000 < 10) {
			return null;
		}

		const samplesCount = 16;
		const samplesCountThreshould = samplesCount * 1.5;
		if (socBmsValues.length < samplesCountThreshould) {
			return null;
		}
		const capacities = [];
		for (let step = 0; step < samplesCount; step++) {
			let startIndex = 0;
			let endIndex = step + 1;
			if (step >= Math.round(samplesCount / 2)) {
				startIndex = step - Math.round(samplesCount / 2) + 1;
				endIndex = 1;
			}
			const sampleCapacity = calculateBatteryCapacityForSamplingRange(
				socBmsValues,
				dischargedAhValues,
				chargedAhValues,
				is64kwhModel,
				startIndex,
				endIndex
			);
			capacities.push(sampleCapacity);
		}
		const uniqueRoundedCapacities = new Map();
		for (const capacity of capacities) {
			const roundedValue = roundToFraction(capacity, 1, 10);
			uniqueRoundedCapacities.set(
				roundedValue,
				(uniqueRoundedCapacities.get(roundedValue) || 0) + 1
			);
		}
		const numberOfCapacities = capacities.length;
		let sum = 0;
		for (const [value, count] of uniqueRoundedCapacities.entries()) {
			sum += (value * count) / numberOfCapacities;
		}
		return sum;
	};

	let calculatedBatteryCapacity = $derived.by(() =>
		calculateBatteryCapacity(paramsState.values, is64kwhModel, filterValuesWithSlider)
	);

	let calculatedSoh = $derived.by(() => {
		if (!calculatedBatteryCapacity) {
			return null;
		}
		const nominalCapacityKwh = is64kwhModel
			? NOMINAL_BATTER_CAPACITY_64_KWH
			: NOMINAL_BATTER_CAPACITY_39_KWH;

		return (calculatedBatteryCapacity / nominalCapacityKwh) * 100;
	});

	const currentSocFromBms = $derived.by(() => {
		let socValues = paramsState.values[PARAM_FIELDS.SOC_BMS];
		socValues = filterValuesWithSlider(socValues);
		if (socValues.length) {
			return socValues[socValues.length - 1].value;
		} else {
			return null;
		}
	});

	const calculatedCurrentBatteryEnergyContent = $derived.by(() =>
		!calculatedBatteryCapacity || !currentSocFromBms
			? null
			: (calculatedBatteryCapacity * currentSocFromBms) / 100
	);

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
		<div class="min-h-[3em] text-sm dark:text-neutral-300">{name}</div>
		<div class="text-end text-2xl">
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
		<h2 class="flex-grow text-center text-lg font-bold dark:text-neutral-400">{i18n.t('trip')}</h2>
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

	{#if paramsState.recording}
		<div>
			<RangeSlider
				bind:values={recordingSliderValues}
				pips
				rangeGapMin={1}
				range={true}
				pushy={true}
				draggy={true}
				spring={false}
			/>
		</div>
		<div class="text-center text-sm">
			{new Date(recordingTimeRange.startTime).toLocaleDateString()}
			{new Date(recordingTimeRange.startTime).toLocaleTimeString()} - {new Date(
				recordingTimeRange.endTime
			).toLocaleDateString()}
			{new Date(recordingTimeRange.endTime).toLocaleTimeString()}
		</div>
	{/if}

	<div class="mx-auto mt-4 grid max-w-2xl grid-cols-2 gap-4 pb-4 lg:max-w-4xl lg:grid-cols-4">
		{@render valueCard(
			i18n.t('averagePower'),
			(Math.abs(averagePowerByTime) > 1000
				? averagePowerByTime / 1000
				: averagePowerByTime
			).toFixed(1),
			Math.abs(averagePowerByTime) > 1000 ? i18n.t(UNIT_LABELS.KILOWATT) : i18n.t(UNIT_LABELS.WATT)
		)}
		{@render valueCard(
			i18n.t('energyConsumed'),
			Math.abs(energyConsumed) > 1000
				? (energyConsumed / 1000).toFixed(2)
				: energyConsumed.toFixed(),
			Math.abs(energyConsumed) > 1000
				? i18n.t(UNIT_LABELS.KILOWATT_HOUR)
				: i18n.t(UNIT_LABELS.WATT_HOUR)
		)}
		{@render valueCard(
			i18n.t('averageSpeed'),
			averageSpeedByTime.toFixed(),
			i18n.t(UNIT_LABELS.KILOMETERS_PER_HOUR)
		)}
		{@render valueCard(
			i18n.t('averageSpeedGps'),
			averageGpsSpeedByTime.toFixed(),
			i18n.t(UNIT_LABELS.KILOMETERS_PER_HOUR)
		)}
		{@render valueCard(
			i18n.t('distanceTraveled'),
			distanceTraveled.toFixed(2),
			i18n.t(UNIT_LABELS.KILOMETER)
		)}
		{@render valueCard(
			i18n.t('distanceTraveledGps'),
			distanceTraveledGps.toFixed(2),
			i18n.t(UNIT_LABELS.KILOMETER)
		)}
		{@render valueCard(
			i18n.t('averageConsumption'),
			consumption.toFixed(1),
			i18n.t(UNIT_LABELS.KILOWATT_HOUR_PER_100_KILOMETERS)
		)}
		{@render valueCard(
			i18n.t('averageConsumptionGps'),
			consumptionGps.toFixed(1),
			i18n.t(UNIT_LABELS.KILOWATT_HOUR_PER_100_KILOMETERS)
		)}
		{@render valueCard(i18n.t('tripTime'), tripTime, '')}
		{@render valueCard(i18n.t('altitudeChange'), altitudeChange, i18n.t(UNIT_LABELS.METER))}
		{@render valueCard(i18n.t('tripPrice'), tripPrice.toFixed(2), i18n.t('currency'))}
		{@render valueCard(i18n.t('pricePerKm'), pricePerKm.toFixed(2), i18n.t('currency'))}
		<div class="col-span-2 font-bold lg:col-span-4">
			<div class="text-center font-bold">{i18n.t('efficiency')}</div>
		</div>
		{@render valueCard(
			i18n.t('energyDischargedPerTrip'),
			energyDischargedPerTrip !== null && energyChargedPerTrip !== null
				? energyDischargedPerTrip.toFixed(1)
				: '-',
			i18n.t(UNIT_LABELS.KILOWATT_HOUR)
		)}
		{@render valueCard(
			i18n.t('returnedByRegen'),
			energyDischargedPerTrip !== null &&
				energyChargedPerTrip !== null &&
				energyDischargedPerTrip !== 0
				? ((energyChargedPerTrip / energyDischargedPerTrip) * 100).toFixed()
				: '-',
			i18n.t(UNIT_LABELS.PERCENT)
		)}
		<div class="col-span-2 lg:col-span-4" id="calculated-battery-params">
			<div class="text-center font-bold">{i18n.t('battery')}</div>
			<div
				class="flex items-center justify-center gap-2 px-2 text-sm dark:border-gray-800 dark:text-neutral-400"
			>
				<span class="icon-[mdi--information-outline]"></span>
				<span>{i18n.t('calculatedSohInstructions')}</span>
			</div>
		</div>
		{@render valueCard(
			i18n.t('calculatedSoh'),
			calculatedSoh !== null ? calculatedSoh.toFixed(1) : '-',
			i18n.t(UNIT_LABELS.PERCENT)
		)}
		{@render valueCard(
			i18n.t('calculatedBatteryCapacity'),
			calculatedBatteryCapacity !== null ? calculatedBatteryCapacity.toFixed(1) : '-',
			i18n.t(UNIT_LABELS.KILOWATT_HOUR)
		)}
		{@render valueCard(
			i18n.t('socBms'),
			currentSocFromBms !== null ? currentSocFromBms.toFixed(1) : '-',
			i18n.t(UNIT_LABELS.PERCENT)
		)}
		{@render valueCard(
			i18n.t('calculatedBatteryEnergyContent'),
			calculatedCurrentBatteryEnergyContent !== null
				? calculatedCurrentBatteryEnergyContent.toFixed(1)
				: '-',
			i18n.t(UNIT_LABELS.KILOWATT_HOUR)
		)}
	</div>
</div>

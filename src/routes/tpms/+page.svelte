<script lang="ts">
	import { PARAM_FIELDS, type FieldType } from '$lib/common/constants/common-params.constants';
	import { TPMS_FIELD_NAMES, TPMS_PARAMS_CONFIG } from '$lib/common/constants/tpms.constant';
	import ButtonLink from '$lib/components/button-link.svelte';
	import { TPMS_LIVE_DATA_FLAG } from '$lib/elm-device/parsers/hkmc.parsers';
	import { paramsState } from '$lib/params.svelte';

	let liveValues = $state(paramsState.values);

	const getLastLiveValue = (field: FieldType) => {
		const liveValuesForParam = liveValues[field];

		if (!liveValuesForParam?.length) {
			return 0;
		}

		const lastValue = liveValuesForParam[liveValuesForParam.length - 1].value;

		return lastValue;
	};

	let tpmsValues = $derived.by(() => {
		const tpmsEntries = Object.values(TPMS_FIELD_NAMES).map((value) => [
			value,
			getLastLiveValue(value)
		]);
		return Object.fromEntries(tpmsEntries);
	});
</script>

{#snippet tpmsValueCard(
	name: string,
	pressureField: FieldType,
	temperatureField: FieldType,
	liveDataField: FieldType
)}
	<div class={['relative rounded-xs border border-neutral-800 p-2 py-4']}>
		<div
			class={[
				'absolute top-2 right-2 h-2 w-2 rounded-xs',
				tpmsValues[liveDataField] === TPMS_LIVE_DATA_FLAG.YES
					? 'animate-pulse bg-green-500'
					: tpmsValues[liveDataField] === TPMS_LIVE_DATA_FLAG.NO
						? 'bg-neutral-500'
						: 'bg-red-500'
			]}
		></div>
		<div class=" min-h-[3em] dark:text-neutral-300">{name}</div>
		<div class="text-end text-2xl">
			{TPMS_PARAMS_CONFIG.find((config) => config.field == pressureField)?.format(
				tpmsValues[pressureField]
			)}
			<span class="text-sm">
				{TPMS_PARAMS_CONFIG.find((config) => config.field == pressureField)?.unit}
			</span>

			/

			{TPMS_PARAMS_CONFIG.find((config) => config.field == temperatureField)?.format(
				tpmsValues[temperatureField]
			)}
			<span class="text-sm">
				{TPMS_PARAMS_CONFIG.find((config) => config.field == temperatureField)?.unit}
			</span>
		</div>
	</div>
{/snippet}

<div class="h-full w-full p-2 dark:text-neutral-100">
	<div class="flex items-start gap-2 py-2">
		<ButtonLink href="/" aria-label="Назад" variant="tertiary" size="compact">
			<span class="icon-[mdi--arrow-back]"></span>
		</ButtonLink>
		<h2 class="flex-grow text-center text-lg font-bold dark:text-neutral-400">
			TPMS (Система контролю тиску в шинах)
		</h2>
	</div>

	<div class="mx-auto mt-4 mb-4 grid max-w-2xl grid-cols-2 gap-4">
		{@render tpmsValueCard(
			'Ліве переднє колесо',
			TPMS_FIELD_NAMES.FRONT_LEFT_TIRE_PRESSURE,
			TPMS_FIELD_NAMES.FRONT_LEFT_TIRE_TEMPERATURE,
			TPMS_FIELD_NAMES.FRONT_LEFT_TIRE_LIVE_DATA
		)}
		{@render tpmsValueCard(
			'Праве переднє колесо',
			TPMS_FIELD_NAMES.FRONT_RIGHT_TIRE_PRESSURE,
			TPMS_FIELD_NAMES.FRONT_RIGHT_TIRE_TEMPERATURE,
			TPMS_FIELD_NAMES.FRONT_RIGHT_TIRE_LIVE_DATA
		)}
		{@render tpmsValueCard(
			'Ліве заднє колесо',
			TPMS_FIELD_NAMES.REAR_LEFT_TIRE_PRESSURE,
			TPMS_FIELD_NAMES.REAR_LEFT_TIRE_TEMPERATURE,
			TPMS_FIELD_NAMES.REAR_LEFT_TIRE_LIVE_DATA
		)}
		{@render tpmsValueCard(
			'Праве заднє колесо',
			TPMS_FIELD_NAMES.REAR_RIGHT_TIRE_PRESSURE,
			TPMS_FIELD_NAMES.REAR_RIGHT_TIRE_TEMPERATURE,
			TPMS_FIELD_NAMES.REAR_RIGHT_TIRE_LIVE_DATA
		)}
	</div>
</div>

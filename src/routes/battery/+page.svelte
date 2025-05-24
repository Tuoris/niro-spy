<script lang="ts">
	import { PARAM_FIELDS, type FieldType } from '$lib/common/constants/common-params.constants';
	import ButtonLink from '$lib/components/button-link.svelte';
	import { paramsState } from '$lib/params.svelte';
	let chartsElement: HTMLDivElement;
	let chart: ECharts;
	import { init, graphic, type ECharts, type EChartsOption } from 'echarts';

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

	let socValue = $derived(getLastLiveValue(PARAM_FIELDS.SOC_BMS));
	let sohValue = $derived(getLastLiveValue(PARAM_FIELDS.SOH));
	let averageConsumption = $derived(getLastLiveValue(PARAM_FIELDS.AVERAGE_CONSUMPTION));
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

	let values = $derived(
		Array.from({ length: NUMBER_OF_BATTERY_CELLS }).map((_, index) => {
			return getLastLiveValue(
				`cellVoltage${(index + 1).toString().padStart(2, '0')}` as keyof typeof liveValues
			);
		})
	);

	const rows = Array.from({ length: NUMBER_OF_ROWS }).map((_, index) => index);
	const columns = Array.from({ length: NUMBER_OF_COLUMNS }).map((_, index) => index);
	const data = $derived(
		rows.map((row) => columns.map((column) => [row, column, values[row * 8 + column]])).flat()
	);

	const staticOptions: EChartsOption = {
		animationDurationUpdate: 100,
		animationDelayUpdate: 0,
		animationDuration: 0,
		backgroundColor: 'transparent',

		grid: {
			height: '90%',
			width: '90%',
			left: 'center',
			top: '1%'
		},
		xAxis: {
			type: 'category',
			data: rows,
			show: false,
			inverse: false
		},
		yAxis: {
			type: 'category',
			show: false,
			inverse: true,
			data: columns
		}
	};

	$effect(() => {
		chart = init(chartsElement, 'dark', { renderer: 'canvas' });
		window.addEventListener('resize', () => chart.resize());
		chart.setOption(staticOptions);
	});

	$effect(() => {
		const valuesCount: Record<string, number> = {};

		for (let i = 0; i < values.length; i++) {
			const value = (values[i] * 100).toFixed();
			if (!valuesCount[value]) {
				valuesCount[value] = 0;
			}

			valuesCount[value] += 1;
		}

		const mostCommonValueAsString = Object.entries(valuesCount).sort((a, b) => b[1] - a[1])[0][0];
		const mostCommonValue = parseInt(mostCommonValueAsString) / 100;

		const red = '#ba0000';
		const yellow = '#d69d00';
		const green = '#006611';

		chart.setOption({
			tooltip: {
				formatter: ({ seriesName, dataIndex, data }) =>
					`<strong>${seriesName} ${dataIndex + 1}</strong><br>${data[2].toFixed(2)} В`
			},
			visualMap: {
				show: false,
				type: 'piecewise',
				orient: 'horizontal',
				left: 'center',
				bottom: '0',
				pieces: [
					{
						min: mostCommonValue - 1,
						max: mostCommonValue - 0.2 - 0.001,
						color: red,
						label: '>  - 0.2 В'
					},
					{
						min: mostCommonValue - 0.2,
						max: mostCommonValue - 0.02 - 0.001,
						color: yellow,
						label: '> - 0.02 В'
					},
					{
						min: mostCommonValue - 0.02,
						max: mostCommonValue + 0.02,
						color: green,
						label: `${mostCommonValue}`
					},
					{
						min: mostCommonValue + 0.02,
						max: mostCommonValue + 0.2,
						color: yellow,
						label: '> + 0.02 В'
					},
					{
						min: mostCommonValue + 0.2,
						max: mostCommonValue + 1,
						color: red,
						label: '>  - 0.2 В'
					}
				],
				outOfRange: {
					color: red
				}
			},
			series: [
				{
					label: {
						show: true,
						formatter: ({ data }) => (data as number[])[2].toFixed(2)
					},
					data: data,
					name: 'Напруга модуля',
					type: 'heatmap',
					orient: 'vertical',

					itemStyle: {
						borderWidth: 2,
						borderType: 'solid',
						borderColor: 'rgb(23 23 23)'
					},
					emphasis: {
						itemStyle: {
							shadowBlur: 10,
							shadowColor: 'rgba(0, 0, 0, 0.5)'
						}
					}
				}
			]
		});
	});
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
		<h2 class="flex-grow text-center text-lg font-bold dark:text-neutral-400">Батарея</h2>
	</div>

	<div class="mt-4 mb-4 grid grid-cols-2 gap-4">
		{@render valueCard('Рівень заряду (SOC)', socValue.toFixed(1), '%', socValue < 10)}
		{@render valueCard(
			'Середня витрата (за весь пробіг)',
			averageConsumption.toFixed(1),
			'кВт·год/100км',
			averageConsumption > 22 || averageConsumption < 16
		)}
		{@render valueCard("Здоров'я батареї (SOH)", sohValue.toFixed(1), '%', sohValue < 100)}
		{@render valueCard(
			'Температура батареї',
			averageTemperature.toFixed(1),
			'°C',
			averageTemperature > 55 || averageTemperature < -10
		)}
		{@render valueCard('Доступна потужність', maxPower.toFixed(), 'кВт')}
		{@render valueCard('Доступна потужність рекуперації', maxRegenerationPower.toFixed(), 'кВт')}

		{@render valueCard(
			'Миттєва потужність',
			Math.abs(batteryPower) > 1000 ? (batteryPower / 1000).toFixed(2) : batteryPower.toFixed(),
			Math.abs(batteryPower) > 1000 ? 'кВт' : 'Вт'
		)}
		{@render valueCard('Йде заряджання/рекуперація', isBatteryCharging ? 'так' : 'ні', '')}
	</div>

	<h2 class="text-center text-lg font-bold dark:text-neutral-400">Елементи</h2>
	<div class="flex w-full justify-center py-4">
		<div bind:this={chartsElement} style={`height: 700px; width: 100%; max-width: 350px`}></div>
	</div>
</div>

<script lang="ts">
	import {
		PARAM_FIELDS,
		PARAMS_CONFIG,
		type FieldType
	} from '$lib/common/constants/common-params.constants';
	import ButtonLink from '$lib/components/button-link.svelte';
	import Button from '$lib/components/button.svelte';
	import { paramsState } from '$lib/params.svelte';
	import * as echarts from 'echarts/core';
	import {
		DataZoomComponent,
		GridComponent,
		TooltipComponent,
		type GridComponentOption
	} from 'echarts/components';
	import { LineChart, type LineSeriesOption } from 'echarts/charts';
	import { UniversalTransition } from 'echarts/features';
	import { CanvasRenderer } from 'echarts/renderers';
	import { downloadJsonFile } from '$lib/trip-data';

	echarts.use([
		GridComponent,
		LineChart,
		CanvasRenderer,
		UniversalTransition,
		DataZoomComponent,
		TooltipComponent
	]);

	type EChartsOption = echarts.ComposeOption<GridComponentOption | LineSeriesOption>;

	const CHART_GRID_HEIGHT = 220;
	const NUMBER_OF_DATA_POINTS_TO_DISPLAY = 40;
	const APPROXIMATE_UPDATE_INTERVAL = 500;

	let chartsElement: HTMLDivElement;
	let chart: echarts.ECharts;

	let isPaused = $state(false);
	let isTooltipEnabled = $state(false);

	let values = $state(paramsState.values);

	let selectedParams = $state(paramsState.selectedParams);
	let chartsToDisplay = Object.values(PARAM_FIELDS).filter((param) =>
		selectedParams.length ? selectedParams.includes(param) : true
	);
	const numberOfCharts = chartsToDisplay.length;

	const getConfigForField = (field: FieldType) =>
		PARAMS_CONFIG.find(({ field: configField }) => configField === field);

	const getCurrentParamValue = (field: FieldType) => {
		const values = paramsState.values[field];
		if (values && values.length) {
			return values[values.length - 1].value;
		}

		return NaN;
	};

	const getYAxisNameForField = (field: FieldType) => {
		const fieldConfig = getConfigForField(field);
		const fieldValue = getCurrentParamValue(field);

		const formattedValue = fieldConfig?.format ? fieldConfig.format(fieldValue) : fieldValue;

		return `${fieldConfig?.name}: ${formattedValue} ${fieldConfig?.unit}`;
	};

	// Static configuration
	const tooltipConfig: EChartsOption['tooltip'] = {
		trigger: 'axis',
		formatter: (formatterParams: { seriesName: any; data: any; axisValueLabel: any }[]) => {
			const { seriesName, data, axisValueLabel } = formatterParams[0];
			const fieldConfig = getConfigForField(seriesName);
			const name = fieldConfig?.name;
			const value = fieldConfig?.format(data[1]) ?? data[1];
			return `<strong>${name}</strong><br />${value} ${fieldConfig?.unit}<br />${axisValueLabel}`;
		},
		confine: true,
		textStyle: {
			fontSize: 10
		}
	};

	const gridConfig = Array.from({ length: numberOfCharts }).map((_, index) => ({
		top: `${index * CHART_GRID_HEIGHT + 35}px`,
		left: '14px',
		right: '14px',
		height: `${CHART_GRID_HEIGHT - 80}px`
	}));

	const staticOptions: EChartsOption = {
		animationDurationUpdate: 100,
		animationDelayUpdate: 0,
		animationDuration: 0,
		backgroundColor: 'transparent',
		dataZoom: {
			type: 'inside',
			realtime: true,
			xAxisIndex: Array.from({ length: numberOfCharts }).map((_, index) => index),
			filterMode: 'none'
		},
		grid: gridConfig,
		tooltip: tooltipConfig,

		xAxis: Array.from({ length: numberOfCharts }).map((_, index) => ({
			type: 'time',
			gridIndex: index,
			axisLabel: {
				hideOverlap: true,
				fontSize: 9
			}
		})),

		yAxis: chartsToDisplay.map((field, index) => ({
			gridIndex: index,
			name: getConfigForField(field)?.name,
			nameTextStyle: { fontWeight: 700, align: 'left' },
			axisLabel: {
				inside: true,
				textBorderColor: '#111',
				textBorderWidth: 3,
				align: 'right',
				margin: 20,
				fontSize: 9,
				showMinLabel: false,
				showMaxLabel: false
			}
		}))
	};

	$effect(() => {
		chart = echarts.init(chartsElement, 'dark', { renderer: 'canvas' });
		window.addEventListener('resize', () => chart.resize());
		chart.setOption(staticOptions);
	});

	$effect(() => {
		if (isPaused) {
			return;
		}

		const firstChartData = Object.values(values).filter((value) => value.length > 0)[0];
		const currentPointsCount = firstChartData.length;

		let xAxisStartValue = firstChartData[0].timestamp;
		let dataZoomExtra: EChartsOption['dataZoom'] = {};

		if (currentPointsCount < NUMBER_OF_DATA_POINTS_TO_DISPLAY) {
			xAxisStartValue -=
				APPROXIMATE_UPDATE_INTERVAL * (NUMBER_OF_DATA_POINTS_TO_DISPLAY - currentPointsCount);
		} else {
			if (!isPaused) {
				dataZoomExtra = {
					rangeMode: ['value', 'value'],
					startValue:
						firstChartData[firstChartData.length - NUMBER_OF_DATA_POINTS_TO_DISPLAY].timestamp,
					endValue: firstChartData[firstChartData.length - 1].timestamp
				};
			}
		}

		const seriesData: EChartsOption['series'] = chartsToDisplay.map((field, index) => {
			const paramValues = values[field].map(({ value }) => value);
			const minValue = Math.min(0, Math.min(...paramValues));
			let maxValue = Math.max(...paramValues);
			maxValue = maxValue < 0 ? 0 : maxValue;

			let middlePointOffset = paramValues.length <= 1 ? 0.5 : maxValue / (maxValue - minValue);

			if (isNaN(middlePointOffset)) {
				middlePointOffset = 1;
			}

			if (middlePointOffset > 1 || middlePointOffset < 0) {
				middlePointOffset = 1;
			}

			return {
				name: field,
				type: 'line',
				symbol: 'none',
				color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
					{
						offset: 0,
						color: 'rgba(0, 166, 244, 1)'
					},
					{
						offset: middlePointOffset * 0.99,
						color: 'rgba(0, 166, 244, 1)'
					},
					{
						offset: Math.min(1, middlePointOffset * 1.01),
						color: 'rgba(187, 244, 81, 1)'
					},
					{
						offset: 1,
						color: 'rgba(187, 244, 81, 1)'
					}
				]),
				areaStyle: {
					opacity: 0.7,
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
						{
							offset: 0,
							color: 'rgba(0, 166, 244, 0.5)'
						},
						{
							offset: Math.max(0, middlePointOffset - 0.005),
							color: 'rgba(0, 166, 244, 0.05)'
						},
						{
							offset: middlePointOffset,
							color: 'rgba(255, 255, 255, 0.05)'
						},
						{
							offset: Math.min(1, middlePointOffset + 0.005),
							color: 'rgba(187, 244, 81, 0.05)'
						},
						{
							offset: 1,
							color: 'rgba(187, 244, 81, 0.5)'
						}
					])
				},
				xAxisIndex: index,
				yAxisIndex: index,
				data: values[field].map(({ timestamp, value }) => [timestamp, value])
			};
		});

		const option: EChartsOption = {
			dataZoom: {
				...(dataZoomExtra as object)
			},
			yAxis: chartsToDisplay.map((field, index) => ({
				gridIndex: index,
				name: getYAxisNameForField(field),
				nameTextStyle: { fontWeight: 700, align: 'left', color: '#f5f5f5' },
				axisLabel: {
					inside: true,
					color: '#f5f5f5',
					textBorderColor: '#111',
					textBorderWidth: 3,
					align: 'right',
					margin: 20,
					fontSize: 9,
					showMinLabel: false,
					showMaxLabel: false
				}
			})),
			xAxis: Array.from({ length: numberOfCharts }).map((_, index) => ({
				startValue: xAxisStartValue,
				type: 'time',
				gridIndex: index,
				axisLabel: {
					hideOverlap: true,
					color: '#f5f5f5'
				}
			})),
			series: seriesData
		};

		chart.setOption(option);
	});

	$effect(() => {
		chart.setOption({
			tooltip: {
				trigger: isTooltipEnabled ? 'axis' : 'none'
			}
		});
	});

	const downloadData = () => downloadJsonFile({ values });
</script>

<div class="flex h-full w-full flex-col px-2">
	<div class="flex justify-between gap-2 py-2">
		<ButtonLink variant="tertiary" size="compact" href="/all-parameters" aria-label="Назад">
			<span class="icon-[mdi--arrow-back]"></span>
		</ButtonLink>
		<div class="flex gap-2">
			<Button
				variant="tertiary"
				size="compact"
				aria-label="Вибрати точку"
				onclick={() => (isTooltipEnabled = !isTooltipEnabled)}
			>
				<span class="icon-[mdi--gesture-touch-hold]"></span>
			</Button>
			<Button
				variant="tertiary"
				size="compact"
				aria-label="Масштабування графіка"
				onclick={() => {
					isPaused = !isPaused;
					isTooltipEnabled = false;
				}}
			>
				<span class="icon-[mdi--arrow-expand-horizontal]"></span>
			</Button>
			<div class="h-full border-l-1 border-neutral-900 dark:border-neutral-800"></div>
			<Button
				variant="tertiary"
				size="compact"
				aria-label="Завантажити дані"
				onclick={downloadData}
			>
				<span class="icon-[mdi--file-download-outline]"></span>
			</Button>
			<Button
				variant="tertiary"
				size="compact"
				aria-label="Пауза/Відновити"
				onclick={() => (isPaused = !isPaused)}
			>
				<span class={['', isPaused ? 'icon-[mdi--play]' : 'icon-[mdi--pause]']}></span>
			</Button>
		</div>
	</div>
	<div class="w-full flex-grow overflow-auto">
		<div bind:this={chartsElement} style={`height: ${CHART_GRID_HEIGHT * numberOfCharts}px`}></div>
	</div>
</div>

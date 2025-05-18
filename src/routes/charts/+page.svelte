<script lang="ts">
	import {
		PARAM_FIELDS,
		PARAMS_CONFIG,
		type FieldType
	} from '$lib/common/constants/common.constants';
	import { paramsState } from '$lib/params.svelte';
	import { init, graphic, type ECharts, type EChartsOption } from 'echarts';

	const CHART_GRID_HEIGHT = 220;
	const NUMBER_OF_DATA_POINTS_TO_DISPLAY = 40;
	const APPROXIMATE_UPDATE_INTERVAL = 500;

	let chartsElement: HTMLDivElement;
	let chart: ECharts;

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

	// Static configuration
	const tooltipConfig: EChartsOption['tooltip'] = {
		trigger: 'axis',
		formatter: (formatterParams) => {
			// TODO: Fix typing
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
		chart = init(chartsElement, 'dark', { renderer: 'canvas' });
		window.addEventListener('resize', () => chart.resize());
		chart.setOption(staticOptions);
	});

	$effect(() => {
		if (isPaused) {
			return;
		}

		const firstChartData = Object.values(values)[0];
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
			const maxValue = Math.max(...paramValues);
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
				color: new graphic.LinearGradient(0, 0, 0, 1, [
					{
						offset: 0,
						color: 'rgba(60, 50, 255, 1)'
					},
					{
						offset: middlePointOffset * 0.99,
						color: 'rgba(60, 50, 255, 1)'
					},
					{
						offset: Math.min(1, middlePointOffset * 1.01),
						color: 'rgba(90, 255, 80, 1)'
					},
					{
						offset: 1,
						color: 'rgba(90, 255, 80, 1)'
					}
				]),
				areaStyle: {
					opacity: 0.7,
					color: new graphic.LinearGradient(0, 0, 0, 1, [
						{
							offset: 0,
							color: 'rgba(60, 50, 255, 0.8)'
						},
						{
							offset: Math.max(0, middlePointOffset - 0.005),
							color: 'rgba(60, 50, 255, 0)'
						},
						{
							offset: middlePointOffset,
							color: 'rgba(255, 255, 255, 0)'
						},
						{
							offset: Math.min(1, middlePointOffset + 0.005),
							color: 'rgba(90, 255, 80, 0)'
						},
						{
							offset: 1,
							color: 'rgba(90, 255, 80, 0.8)'
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
				...dataZoomExtra
			},
			xAxis: Array.from({ length: numberOfCharts }).map((_, index) => ({
				startValue: xAxisStartValue,
				type: 'time',
				gridIndex: index,
				axisLabel: {
					hideOverlap: true
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

	function downloadData() {
		const text = JSON.stringify({ values }, null, 4);
		const now = new Date();
		const filename = `elm_js_scanner_${now.toISOString().replaceAll(':', '_').replace('Z', '')}.json`;
		var element = document.createElement('a');
		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
		element.setAttribute('download', filename);

		element.style.display = 'none';
		document.body.appendChild(element);

		element.click();

		document.body.removeChild(element);
	}
</script>

<div class="flex h-full w-full flex-col px-2">
	<div class="flex justify-between gap-2 py-1">
		<a
			href="/all-parameters"
			aria-label="Назад"
			class="flex rounded-sm border-2 border-r-4 border-b-4 border-slate-900 bg-neutral-200 px-2 py-1 text-center font-bold active:border-t-4 active:border-r-2 active:border-b-2 active:border-l-4 active:bg-neutral-300 dark:border-slate-800 dark:bg-slate-600 dark:active:bg-slate-700"
		>
			<span class="icon-[mdi--arrow-back] text-slate-800 dark:text-slate-100"></span>
		</a>
		<div class="flex gap-2">
			<button
				aria-label="Вибрати точку"
				class="flex rounded-sm border-2 border-r-4 border-b-4 border-slate-900 bg-neutral-200 px-2 py-1 text-center font-bold active:border-t-4 active:border-r-2 active:border-b-2 active:border-l-4 active:bg-neutral-300 dark:border-slate-800 dark:bg-slate-600 dark:active:bg-slate-700"
				onclick={() => (isTooltipEnabled = !isTooltipEnabled)}
			>
				<span class="icon-[mdi--gesture-touch-hold] text-slate-800 dark:text-slate-100"></span>
			</button>
			<button
				aria-label="Масштабування графіка"
				class="flex rounded-sm border-2 border-r-4 border-b-4 border-slate-900 bg-neutral-200 px-2 py-1 text-center font-bold active:border-t-4 active:border-r-2 active:border-b-2 active:border-l-4 active:bg-neutral-300 dark:border-slate-800 dark:bg-slate-600 dark:active:bg-slate-700"
				onclick={() => {
					isPaused = !isPaused;
					isTooltipEnabled = false;
				}}
			>
				<span class="icon-[mdi--arrow-expand-horizontal] text-slate-800 dark:text-slate-100"></span>
			</button>
			<button
				aria-label="Перейти до графіків"
				class="flex rounded-sm border-2 border-r-4 border-b-4 border-slate-900 bg-neutral-200 px-2 py-1 text-center font-bold active:border-t-4 active:border-r-2 active:border-b-2 active:border-l-4 active:bg-neutral-300 dark:border-slate-800 dark:bg-slate-600 dark:active:bg-slate-700"
				onclick={downloadData}
			>
				<span class="icon-[mdi--file-download-outline] text-slate-800 dark:text-slate-100"></span>
			</button>
			<button
				aria-label="Пауза/Відновити"
				class="flex rounded-sm border-2 border-r-4 border-b-4 border-slate-900 bg-neutral-200 px-2 py-1 text-center font-bold active:border-t-4 active:border-r-2 active:border-b-2 active:border-l-4 active:bg-neutral-300 dark:border-slate-800 dark:bg-slate-600 dark:active:bg-slate-700"
				onclick={() => (isPaused = !isPaused)}
			>
				<span
					class={[
						'text-slate-800 dark:text-slate-100',
						isPaused ? 'icon-[mdi--play]' : 'icon-[mdi--pause]'
					]}
				></span>
			</button>
		</div>
	</div>
	<div class="w-full flex-grow overflow-auto">
		<div bind:this={chartsElement} style={`height: ${CHART_GRID_HEIGHT * numberOfCharts}px`}></div>
	</div>
</div>

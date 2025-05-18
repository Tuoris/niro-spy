<script lang="ts">
	import {
		PARAM_FIELDS,
		PARAMS_CONFIG,
		type FieldType
	} from '$lib/common/constants/common.constants';
	import { paramsState } from '$lib/params.svelte';
	import { init, graphic, type ECharts, type EChartsOption } from 'echarts';
	let values = $state(paramsState.values);
	const numberOfCharts = Object.values(PARAM_FIELDS).length;
	let chartsElement: HTMLDivElement;
	let chart: ECharts;

	let isPaused = $state(false);

	const getConfigForField = (field: FieldType) =>
		PARAMS_CONFIG.find(({ field: configField }) => configField === field);

	$effect(() => {
		chart = init(chartsElement, null, { renderer: 'canvas' });

		window.addEventListener('resize', () => chart.resize());
	});

	$effect(() => {
		if (isPaused) {
			return;
		}

		const numberOfDataPointsToDisplay = 40;
		const updateInterval = 500;
		const firstChartData = Object.values(values)[0];
		const currentPointsCount = firstChartData.length;

		let xAxisStartValue = firstChartData[0].timestamp;
		let dataZoomExtra: EChartsOption['dataZoom'] = {};

		if (currentPointsCount < numberOfDataPointsToDisplay) {
			xAxisStartValue -= updateInterval * (numberOfDataPointsToDisplay - currentPointsCount);
		} else {
			if (!isPaused) {
				dataZoomExtra = {
					rangeMode: ['value', 'value'],
					startValue: firstChartData[firstChartData.length - numberOfDataPointsToDisplay].timestamp,
					endValue: firstChartData[firstChartData.length - 1].timestamp
				};
			}
		}

		const seriesData: EChartsOption['series'] = Object.values(PARAM_FIELDS).map((field, index) => {
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
						offset: middlePointOffset * 0.98,
						color: 'rgba(60, 50, 255, 1)'
					},
					{
						offset: middlePointOffset,
						color: 'rgba(255, 255, 255, 0)'
					},
					{
						offset: Math.min(1, middlePointOffset * 1.02),
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
							offset: Math.max(0, middlePointOffset - 0.01),
							color: 'rgba(60, 50, 255, 0.2)'
						},
						{
							offset: middlePointOffset,
							color: 'rgba(255, 255, 255, 0)'
						},
						{
							offset: Math.min(1, middlePointOffset + 0.01),
							color: 'rgba(90, 255, 80, 0.2)'
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

		const tooltipConfig: EChartsOption['tooltip'] = {
			trigger: 'axis',
			formatter: (formatterParams) => {
				// TODO: Fix typing
				const { seriesName, data, axisValueLabel } = formatterParams[0];
				const fieldConfig = getConfigForField(seriesName);
				const name = fieldConfig?.name;
				const value = fieldConfig?.format(data[1]) ?? data[1];
				return `<strong>${name}</strong><br />${value} ${fieldConfig?.unit}<br />${axisValueLabel}`;
			}
		};

		const spaceBetweenCharts = numberOfCharts > 5 ? 1.5 : 4;
		const topAndBottomPadding = 1;
		const cellHeight = (100 - topAndBottomPadding * 2) / numberOfCharts;
		const gridConfig = Array.from({ length: numberOfCharts }).map((_, index) => ({
			top: `${topAndBottomPadding + cellHeight * index + spaceBetweenCharts}%`,
			left: '60px',
			right: '30px',
			height: `${cellHeight - spaceBetweenCharts * 2}%`
		}));

		const option: EChartsOption = {
			animationDurationUpdate: 100,
			animationDelayUpdate: 0,
			dataZoom: {
				type: 'inside',
				realtime: true,
				xAxisIndex: Array.from({ length: numberOfCharts }).map((_, index) => index),
				filterMode: 'none',
				...dataZoomExtra
			},
			grid: gridConfig,
			tooltip: tooltipConfig,
			xAxis: Array.from({ length: numberOfCharts }).map((_, index) => ({
				type: 'time',
				gridIndex: index,
				startValue: xAxisStartValue
			})),
			yAxis: Object.values(PARAMS_CONFIG).map((config, index) => ({
				gridIndex: index,
				name: getConfigForField(config.field)?.name,
				nameTextStyle: { fontWeight: 700, align: 'left' }
			})),
			series: seriesData
		};

		console.log(option);
		chart.setOption(option);
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
			class="flex rounded-sm border-2 border-r-4 border-b-4 border-slate-900 bg-neutral-200 px-2 py-1 text-center font-bold text-white active:border-t-4 active:border-r-2 active:border-b-2 active:border-l-4 active:bg-neutral-300"
		>
			<span class="icon-[mdi--arrow-back] text-slate-800"></span>
		</a>
		<div class="flex gap-2">
			<button
				aria-label="Перейти до графіків"
				class="flex rounded-sm border-2 border-r-4 border-b-4 border-slate-900 bg-neutral-200 px-2 py-1 text-center font-bold text-white active:border-t-4 active:border-r-2 active:border-b-2 active:border-l-4 active:bg-neutral-300"
				onclick={downloadData}
			>
				<span class="icon-[mdi--file-download-outline] text-slate-800"></span>
			</button>
			<button
				aria-label="Завантажити дані"
				class="flex rounded-sm border-2 border-r-4 border-b-4 border-slate-900 bg-neutral-200 px-2 py-1 text-center font-bold text-white active:border-t-4 active:border-r-2 active:border-b-2 active:border-l-4 active:bg-neutral-300"
				onclick={() => (isPaused = !isPaused)}
			>
				<span class={['text-slate-800', isPaused ? 'icon-[mdi--play]' : 'icon-[mdi--pause]']}
				></span>
			</button>
		</div>
	</div>
	<div class="w-full flex-grow overflow-auto">
		<div bind:this={chartsElement} style={`height: ${200 * numberOfCharts}px`}></div>
	</div>
</div>

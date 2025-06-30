<script lang="ts">
	import * as echarts from 'echarts/core';
	import type { GridComponentOption, LineSeriesOption } from 'echarts';
	import { LineChart } from 'echarts/charts';
	import { GridComponent, DataZoomComponent, TooltipComponent } from 'echarts/components';
	import { UniversalTransition } from 'echarts/features';
	import { CanvasRenderer } from 'echarts/renderers';
	import { onMount } from 'svelte';
	import { i18n } from '$lib/i18n/i18n';

	const { selectedByteTimeline }: { selectedByteTimeline: [number, number | null][] } = $props();

	let chartsElement: HTMLDivElement;
	let chart: echarts.ECharts;

	echarts.use([
		GridComponent,
		LineChart,
		CanvasRenderer,
		UniversalTransition,
		DataZoomComponent,
		TooltipComponent
	]);

	type EChartsOption = echarts.ComposeOption<GridComponentOption | LineSeriesOption>;

	const VALUE_MULTIPLIER_FOR_CHART = 2;

	const staticOptions: EChartsOption = {
		animationDurationUpdate: 100,
		animationDelayUpdate: 0,
		animationDuration: 0,
		backgroundColor: 'transparent',

		dataZoom: {
			type: 'inside',
			filterMode: 'none'
		},

		grid: {
			left: '20px',
			right: '20px',
			top: '20px',
			bottom: '20px'
		},

		tooltip: {
			trigger: 'axis',
			confine: true,
			textStyle: {
				fontSize: 10
			},
			formatter: (params) => {
				const a = params.map((param) => {
					const value = param.value[1] - param.seriesIndex * VALUE_MULTIPLIER_FOR_CHART;

					return `${param.marker} ${i18n.t('bit')} ${param.seriesIndex}: <strong>${value}</strong>`;
				});
				return a.join('<br/>');
			}
		},

		xAxis: {
			type: 'time',
			axisLabel: {
				hideOverlap: true,
				fontSize: 9
			}
		},

		yAxis: {
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
		}
	};

	onMount(() => {
		chart = echarts.init(chartsElement, 'dark', { renderer: 'canvas' });
		window.addEventListener('resize', () => chart.resize());
		chart.setOption(staticOptions);
	});

	$effect(() => {
		const bitSeries = (index: number) =>
			selectedByteTimeline.map(([timestamp, byteValue]) => [
				timestamp,
				(((byteValue || 0) & (1 << index)) > 0 ? 1 : 0) + index * VALUE_MULTIPLIER_FOR_CHART
			]);

		const newSeries = {
			series: Array.from({ length: 8 }).map((_, index) => ({
				type: 'line',
				step: 'middle',
				symbol: 'none',
				data: bitSeries(index)
			}))
		};

		chart.setOption(newSeries);
	});
</script>

<div>
	<div class="w-full">
		<div bind:this={chartsElement} style={`height: 440px`}></div>
	</div>
</div>

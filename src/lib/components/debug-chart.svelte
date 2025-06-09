<script lang="ts">
	import * as echarts from 'echarts/core';
	import type { GridComponentOption, LineSeriesOption } from 'echarts';
	import { LineChart } from 'echarts/charts';
	import { GridComponent, DataZoomComponent, TooltipComponent } from 'echarts/components';
	import { UniversalTransition } from 'echarts/features';
	import { CanvasRenderer } from 'echarts/renderers';
	import { onMount } from 'svelte';

	const { selectedValueTimeline }: { selectedValueTimeline: [number, number | null][] } = $props();

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
		const byteValues = selectedValueTimeline.map(([_, value]) => value);

		chart.setOption({
			series: {
				type: 'line',
				step: 'middle',
				symbol: 'none',
				data: selectedValueTimeline
			},
			yAxis: {
				min: Math.max(0, Math.min(...(byteValues as number[])) - 3),
				max: Math.max(...(byteValues as number[])) + 3
			}
		});
	});
</script>

<div>
	<div class="w-full">
		<div bind:this={chartsElement} style={`height: 220px`}></div>
	</div>
</div>

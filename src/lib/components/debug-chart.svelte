<script lang="ts">
	import * as echarts from 'echarts/core';
	import type { GridComponentOption, LineSeriesOption } from 'echarts';
	import { LineChart } from 'echarts/charts';
	import { GridComponent, DataZoomComponent, TooltipComponent } from 'echarts/components';
	import { UniversalTransition } from 'echarts/features';
	import { CanvasRenderer } from 'echarts/renderers';
	import { onMount } from 'svelte';
	import Button from './button.svelte';
	import { signedIntFromBytes } from '$lib/elm-device/parsers/elm-parser.utils';
	import ByteDebugChart from './byte-debug-chart.svelte';

	const {
		selectedValueTimeline
	}: { selectedValueTimeline: [number, number | null, string[] | null][] } = $props();

	const byteValuesTimeline = $derived.by(() =>
		selectedValueTimeline.map(([timestamp, _, bytes]) => [timestamp, bytes] as const)
	);

	let selectedByteIndex = $state(0);

	const selectedByteTimeline = $derived.by(() =>
		byteValuesTimeline.map(([timestamp, bytes]) => [
			timestamp,
			bytes ? parseInt(bytes[selectedByteIndex], 16) : bytes
		])
	);

	const sampleBytes = $derived.by(() => {
		if (!byteValuesTimeline?.length) {
			return [];
		}

		const firstBytesValues = byteValuesTimeline[0][1];
		return firstBytesValues ? firstBytesValues : [];
	});

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
			},
			formatter: (params) => {
				const seriesParams = params[0];
				const [timestamp, value, bytes] = seriesParams.data;
				return `<strong>${new Date(timestamp).toLocaleString()}</strong><br/>Десяткове число: ${value}<br/>Десяткове число зі знаком: ${signedIntFromBytes(bytes)}<br/>Температура: ${value / 2 - 40}°C<br/>Шістнадцяткове число: ${bytes}`;
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

	<div class="m-4">
		<div class="flex gap-4">
			{#each sampleBytes as byte, byteIndex}
				<Button
					variant={byteIndex === selectedByteIndex ? 'secondary' : 'tertiary'}
					onclick={() => {
						selectedByteIndex = byteIndex;
					}}>Байт {byteIndex + 1}: {byte}</Button
				>
			{/each}
		</div>
		<ByteDebugChart {selectedByteTimeline} />
	</div>
</div>

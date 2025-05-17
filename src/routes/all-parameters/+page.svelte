<script lang="ts">
	const params = [
		{
			name: 'Рівень заряду',
			field: 'socBms',
			exampleValue: 78.0001,
			range: [0, 100],
			unit: '%',
			format: (value: number) => value.toFixed(2)
		},
		{
			name: 'Максимальна потужність',
			field: 'maxPower',
			exampleValue: 140,
			range: [0, 170],
			unit: 'кВт',
			format: (value: number) => value.toFixed(2)
		},
		{
			name: 'Пробіг',
			field: 'odometerKm',
			exampleValue: 50000,
			range: [0, Infinity],
			unit: 'км'
		}
	];
</script>

<div class="flex h-full w-full flex-col px-2">
	<div class="flex gap-2 border-b border-gray-200 py-1">
		<div class="relative flex grow">
			<input class="w-full px-2" type="text" />
			<span class="icon-[mdi--search] pointer-events-none absolute top-1.5 right-2 text-black"
			></span>
		</div>
		<button
			aria-label="Перейти до графіків"
			class="flex cursor-not-allowed rounded-sm border-2 border-r-4 border-b-4 border-slate-900 bg-neutral-400 px-2 py-1 text-center font-bold text-white active:border-t-4 active:border-r-2 active:border-b-2 active:border-l-4 active:bg-neutral-500"
		>
			<span class="icon-[mdi--chart-line] text-black"></span>
		</button>
	</div>
	<div class="w-full flex-grow overflow-auto">
		<table class="w-full table-auto">
			<tbody>
				{#each params as param}
					<tr class="border-b border-gray-200 nth-last-1:border-none">
						<td class="px-2">
							<input type="checkbox" class="h-4 w-4" />
						</td>
						<td class="py-1">{param.name}</td>
						<td class="px-2 py-1 text-end"
							>{param?.format ? param.format(param.exampleValue) : param.exampleValue}</td
						>
						<td class="py-1">{param.unit}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

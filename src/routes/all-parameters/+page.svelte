<script lang="ts">
	import { PARAMS_CONFIG, type FieldType } from '$lib/common/constants/common.constants';
	import { paramsState } from '$lib/params.svelte';

	let currentlySelectedParams = $state(paramsState.selectedParams);

	const toggleParam = (paramField: FieldType) => {
		if (currentlySelectedParams.includes(paramField)) {
			currentlySelectedParams = currentlySelectedParams.filter((field) => field !== paramField);
		} else {
			currentlySelectedParams = [paramField, ...currentlySelectedParams];
		}
	};

	const getCurrentParamValue = (field: FieldType) => {
		const values = paramsState.values[field];
		if (values && values.length) {
			return values[values.length - 1].value;
		}

		return NaN;
	};
</script>

{#snippet formattedValue(currentValue: number, formatter?: (value: number) => string)}
	{#if isNaN(currentValue)}
		--
	{:else if formatter}
		{formatter(currentValue)}
	{:else}
		{currentValue}
	{/if}
{/snippet}

<div class="flex h-full w-full flex-col px-2">
	<div class="flex gap-2 py-1">
		<a
			href="/"
			aria-label="Назад"
			class="flex rounded-sm border-2 border-r-4 border-b-4 border-slate-900 bg-neutral-200 px-2 py-1 text-center font-bold text-white active:border-t-4 active:border-r-2 active:border-b-2 active:border-l-4 active:bg-neutral-300"
		>
			<span class="icon-[mdi--arrow-back] text-slate-800"></span>
		</a>
		<div class="relative flex grow">
			<input class="w-full border-2 border-r-4 border-b-4 border-slate-900 px-2" type="text" />
			<span class="icon-[mdi--search] pointer-events-none absolute top-1.5 right-2 text-slate-800"
			></span>
		</div>
		<a
			href="charts"
			aria-label="Перейти до графіків"
			class="flex rounded-sm border-2 border-r-4 border-b-4 border-slate-900 bg-neutral-200 px-2 py-1 text-center font-bold text-white active:border-t-4 active:border-r-2 active:border-b-2 active:border-l-4 active:bg-neutral-300"
			onclick={() => (paramsState.selectedParams = currentlySelectedParams)}
		>
			<span class="icon-[mdi--chart-line] text-slate-800"></span>
		</a>
	</div>
	<div class="w-full flex-grow overflow-auto">
		<table class="w-full table-fixed">
			<tbody>
				{#each PARAMS_CONFIG as param}
					<tr class="border-b border-gray-200 nth-last-1:border-none">
						<td class="w-10 px-2">
							<input
								type="checkbox"
								class="h-4 w-4"
								onchange={() => toggleParam(param.field)}
								checked={currentlySelectedParams.includes(param.field)}
							/>
						</td>
						<td class="py-1">{param.name}</td>
						<td class="w-28 px-2 py-1 text-end font-bold">
							{@render formattedValue(getCurrentParamValue(param.field), param?.format)}
						</td>
						<td class="w-10 py-2 align-super text-xs break-words">{param.unit}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

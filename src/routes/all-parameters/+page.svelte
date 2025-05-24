<script lang="ts">
	import { PARAMS_CONFIG, type FieldType } from '$lib/common/constants/common-params.constants';
	import ButtonLink from '$lib/components/button-link.svelte';
	import Button from '$lib/components/button.svelte';
	import { paramsState } from '$lib/params.svelte';

	let search = $state('');
	let currentlySelectedParams = $state(paramsState.selectedParams);

	const filteredParams = $derived(
		PARAMS_CONFIG.filter((config) => {
			const searchValue = search.trim().toLowerCase();
			return (
				config.name.toLowerCase().includes(searchValue) ||
				config.unit.toLocaleLowerCase().includes(searchValue)
			);
		})
	);

	const toggleParam = (paramField: FieldType) => {
		if (currentlySelectedParams.includes(paramField)) {
			currentlySelectedParams = currentlySelectedParams.filter((field) => field !== paramField);
		} else {
			currentlySelectedParams = [paramField, ...currentlySelectedParams];
		}
	};

	const deselectVisibleParams = () => {
		const paramsToDeselect = filteredParams.map((config) => config.field);

		currentlySelectedParams = currentlySelectedParams.filter(
			(selectedParam) => !paramsToDeselect.includes(selectedParam)
		);
	};

	const selectVisibleParams = () => {
		const extraParamsToSelect = filteredParams
			.map((config) => config.field)
			.filter((param) => !currentlySelectedParams.includes(param));

		currentlySelectedParams = [...currentlySelectedParams, ...extraParamsToSelect];
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
	<div class="flex gap-2 py-2">
		<ButtonLink href="/" aria-label="Назад" variant="tertiary" size="compact">
			<span class="icon-[mdi--arrow-back]"></span>
		</ButtonLink>
		<div class="relative flex grow">
			<input
				bind:value={search}
				class="w-full border-2 border-r-4 border-b-4 border-neutral-900 px-2 dark:border-neutral-800 dark:bg-neutral-700 dark:text-neutral-100 dark:active:bg-neutral-700"
				type="text"
			/>
			<span
				class="icon-[mdi--search] pointer-events-none absolute top-1.5 right-2 text-neutral-800 dark:text-neutral-100"
			></span>
		</div>
		<div class="h-full border-l-1 border-neutral-900 dark:border-neutral-800"></div>
		<Button
			variant="tertiary"
			size="compact"
			aria-label="Вибрати всі видимі параметри"
			onclick={selectVisibleParams}
		>
			<span class="icon-[mdi--checkbox-outline]"></span>
		</Button>
		<Button
			variant="tertiary"
			size="compact"
			aria-label="Зняти вибір з видимих параметрів"
			onclick={deselectVisibleParams}
		>
			<span class="icon-[mdi--checkbox-blank-off-outline]"></span>
		</Button>
		<div class="h-full border-l-1 border-neutral-900 dark:border-neutral-800"></div>
		<ButtonLink
			href="charts"
			aria-label="Перейти до графіків"
			variant="tertiary"
			size="compact"
			onclick={() => (paramsState.selectedParams = currentlySelectedParams)}
		>
			<span class="icon-[mdi--chart-line]"></span>
		</ButtonLink>
	</div>
	<div class="flex items-center gap-2 px-2 text-sm dark:border-gray-800 dark:text-neutral-400">
		<span class="icon-[mdi--information-outline]"></span>
		<span> Виберіть один або декілька параметрів для відображення графіків </span>
	</div>
	<div class="w-full flex-grow overflow-auto">
		<table class="w-full table-fixed">
			<tbody>
				{#each filteredParams as param}
					<tr
						class="border-b border-gray-200 nth-last-1:border-none dark:border-gray-800 dark:text-neutral-200"
					>
						<td class="w-10 px-2">
							<input
								type="checkbox"
								class="h-4 w-4"
								onchange={() => toggleParam(param.field)}
								checked={currentlySelectedParams.includes(param.field)}
							/>
						</td>
						<td class="py-1" onclick={() => toggleParam(param.field)}>{param.name}</td>
						<td class="w-28 px-2 py-1 text-end font-bold">
							{@render formattedValue(getCurrentParamValue(param.field), param?.format)}
						</td>
						<td class="w-12 py-2 text-xs break-words">{param.unit}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

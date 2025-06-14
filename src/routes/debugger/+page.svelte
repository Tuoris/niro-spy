<script lang="ts">
	import { bluetoothState } from '$lib/bluetooth.store.svelte';
	import { getCommandDebugKey } from '$lib/common/helpers/command.helpers';
	import ButtonLink from '$lib/components/button-link.svelte';
	import Button from '$lib/components/button.svelte';
	import DebugChart from '$lib/components/debug-chart.svelte';
	import { COMMANDS } from '$lib/elm-device/elm-commands.constants';
	import { HEADER_TO_ECU_NAME } from '$lib/elm-device/elm-headers.constants';
	import {
		signedIntFromBytes,
		unsignedIntFromBytes
	} from '$lib/elm-device/parsers/elm-parser.utils';
	import { parseUdsInfoBuffer, PARSING_ERROR_RESPONSE } from '$lib/elm-device/parsers/hkmc.parsers';
	import { downloadJsonFile } from '$lib/utils/file.utils';

	const responses = $derived.by(() => bluetoothState.elmResponses);

	const allCommands = $derived.by(() =>
		Object.keys(responses)
			.filter((key) => !(key.startsWith('AT') || key === '0100'))
			.sort()
	);
	const getInitialCommand = () => allCommands[0];
	let selectedCommand = $state(getInitialCommand());

	const COMMAND_BY_COMMAND_KEY = Object.fromEntries(
		Object.values(COMMANDS).map((command) => [getCommandDebugKey(command), command])
	);

	let responsesForCommand = $derived.by(() => {
		const response = responses[selectedCommand];
		if (!response) {
			return {
				command: null,
				values: []
			};
		}

		const originalCommand = COMMAND_BY_COMMAND_KEY[selectedCommand];

		return {
			...response,
			values: response.values.filter(
				(responseItem) =>
					originalCommand.responseParser(responseItem.value) !== PARSING_ERROR_RESPONSE
			)
		};
	});

	$effect(() => {
		if (!selectedCommand) {
			selectedCommand = getInitialCommand();
		}
	});

	let page = $state(0);
	const goToFirstPage = () => (page = 0);
	const prevPage = () => (page = Math.max(0, page - 1));
	const nextPage = () => (page = Math.min(responsesForCommand.values.length - 1 - 1, page + 1));
	const goToLastPage = () => (page = responsesForCommand.values.length - 1 - 1);

	$effect(() => {
		if (selectedCommand) {
			page = 0;
		}
	});

	const pagesToCompare = $derived.by(() => {
		if (responsesForCommand.values.length === 0) {
			return null;
		}

		if (responsesForCommand.values.length === 1) {
			const firstPage = responsesForCommand.values[0];
			const firstPageBytesTable = parseUdsInfoBuffer(firstPage.value);
			const emptyBytesTable = firstPageBytesTable.map((row) => row.map(() => '00'));
			return [emptyBytesTable, firstPageBytesTable];
		}

		const currentPage = page > responsesForCommand.values.length - 1 - 1 ? 0 : page;

		const firstPageBytesTable = parseUdsInfoBuffer(responsesForCommand.values[currentPage].value);
		const secondPageBytesTable = parseUdsInfoBuffer(
			responsesForCommand.values[currentPage + 1].value
		);

		return [firstPageBytesTable, secondPageBytesTable];
	});

	let buttonRefs = $derived.by(() => {
		return [
			Array.from({ length: 32 }).map(() => Array.from({ length: 32 })),
			Array.from({ length: 32 }).map(() => Array.from({ length: 32 }))
		];
	});

	const downloadData = () => {
		const now = new Date();
		const filename = `niro_spy_commands_${now.toISOString().replaceAll(':', '_').replace('Z', '')}.json`;

		downloadJsonFile(responses, filename);
	};

	// Upload data
	let fileInput: HTMLInputElement;
	let files: FileList | null = $state(null);
	const loadData = () => {
		fileInput.click();
	};

	$effect(() => {
		if (!files) {
			return;
		}

		try {
			const jsonFile = files[0];

			const reader = new FileReader();
			reader.onload = function (event) {
				try {
					const fileContent = JSON.parse(event.target?.result as string);
					if (Object.keys(fileContent).length) {
						bluetoothState.elmResponses = fileContent;
					}
				} catch {}
			};
			reader.readAsText(jsonFile);
		} catch {}
	});

	const commandDisplay = (originalCommand: string) => {
		const [ecu, command] = originalCommand.split(' : ');
		if (!command) {
			return originalCommand;
		}

		const ecuName = HEADER_TO_ECU_NAME[ecu];

		if (!ecuName) {
			return originalCommand;
		}

		return `${ecuName} (${ecu}) : ${command}`;
	};

	type SelectedIndexes = [number, number, number][] | null;

	let selectedIndexes = $state<SelectedIndexes>(null);
	let selectedValue = $derived.by(() => {
		if (!selectedIndexes || !pagesToCompare) {
			return null;
		}

		try {
			return selectedIndexes.map(
				([displayPage, row, column]) => pagesToCompare[displayPage][row][column]
			);
		} catch {
			return null;
		}
	});

	$effect(() => {
		if (selectedCommand) {
			selectedIndexes = null;
		}
	});

	let selectedValueTimeline = $derived.by(() => {
		if (!selectedIndexes) {
			return [];
		}

		const checkValidResponse = (
			value: string,
			savedCommand: { header?: string; payload: string }
		) => {
			const actualCommand = COMMAND_BY_COMMAND_KEY[getCommandDebugKey(savedCommand)];

			if (!actualCommand) {
				return false;
			}

			return actualCommand.responseParser(value) !== PARSING_ERROR_RESPONSE;
		};

		const getValuesFromTable = (table: string[][], selectedIndexes: SelectedIndexes) => {
			if (!selectedIndexes) {
				return null;
			}

			const bytes = selectedIndexes.map(([displayPage, row, column]) =>
				row in table ? table[row][column] : null
			);

			if (bytes.includes(null)) {
				return null;
			}

			return unsignedIntFromBytes(bytes as string[]);
		};

		const getBytesFromTable = (table: string[][], selectedIndexes: SelectedIndexes) => {
			if (!selectedIndexes) {
				return null;
			}

			const bytes = selectedIndexes.map(([displayPage, row, column]) =>
				row in table ? table[row][column] : null
			);

			if (bytes.includes(null)) {
				return null;
			}

			return bytes as string[];
		};

		let values = responsesForCommand.values
			.map(({ timestamp, value }) => ({
				timestamp,
				table: parseUdsInfoBuffer(value),
				isValid: responsesForCommand?.command
					? checkValidResponse(value, responsesForCommand.command)
					: false
			}))
			.filter((v) => {
				return v.isValid;
			})
			.map(
				({ timestamp, table }) =>
					[
						timestamp,
						getValuesFromTable(table, selectedIndexes),
						getBytesFromTable(table, selectedIndexes)
					] as [number, number | null, string[] | null]
			);

		return values;
	});

	const getCellClass = (rowIndex: number, columnIndex: number) => {
		if (!selectedIndexes) {
			return 'border-transparent';
		}

		const isSelected = selectedIndexes.find(
			([_, row, column]) => rowIndex === row && columnIndex === column
		);

		return isSelected ? 'border-neutral-300' : 'border-transparent';
	};

	const getCompareClass = (byteA: string, byteB: string) => {
		const byteAValue = unsignedIntFromBytes(byteA);
		const byteBValue = unsignedIntFromBytes(byteB);

		if (byteAValue === byteBValue) {
			return '';
		}

		return byteAValue > byteBValue ? 'bg-green-700' : 'bg-red-700';
	};

	const clickOnNextButton = (nextButton: HTMLButtonElement) => {
		setTimeout(() => {
			nextButton.focus();
			nextButton.click();
		}, 32);
	};
</script>

{#snippet bytesTable(data: string[][], dataToCompare?: string[][])}
	<div>
		{#each data as row, rowIndex}
			<div class="flex gap-1 font-mono">
				<div class="flex h-8 w-8 items-center justify-center rounded text-neutral-500">
					{rowIndex === 0 ? '10' : `2${rowIndex}`}
				</div>
				{#each row as value, columnIndex}
					<button
						bind:this={buttonRefs[dataToCompare ? 1 : 0][rowIndex][columnIndex]}
						class={[
							'flex h-8 w-8 items-center justify-center rounded border',
							dataToCompare ? getCompareClass(value, dataToCompare[rowIndex][columnIndex]) : '',
							getCellClass(rowIndex, columnIndex)
						]}
						onkeydown={(event) => {
							const refs = buttonRefs[dataToCompare ? 1 : 0];
							if (event.code === 'ArrowRight') {
								if (columnIndex + 1 < row.length) {
									const next = refs[rowIndex][columnIndex + 1];
									clickOnNextButton(next as HTMLButtonElement);
								} else if (rowIndex + 1 < data.length) {
									const next = refs[rowIndex + 1][0];
									clickOnNextButton(next as HTMLButtonElement);
								}
								event.preventDefault();
							}
							if (event.code === 'ArrowLeft') {
								if (columnIndex > 0) {
									const next = refs[rowIndex][columnIndex - 1];
									clickOnNextButton(next as HTMLButtonElement);
								} else if (rowIndex > 0) {
									const next = refs[rowIndex - 1][data[rowIndex - 1].length - 1];
									clickOnNextButton(next as HTMLButtonElement);
								}
								event.preventDefault();
							}
							if (event.code === 'ArrowUp') {
								if (rowIndex > 0) {
									const next = refs[rowIndex - 1][columnIndex];
									clickOnNextButton(next as HTMLButtonElement);
								}
								event.preventDefault();
							}
							if (event.code === 'ArrowDown') {
								if (rowIndex + 1 < data.length) {
									const next = refs[rowIndex + 1][columnIndex];
									clickOnNextButton(next as HTMLButtonElement);
								}
								event.preventDefault();
							}
						}}
						onclick={(event) => {
							if (event.shiftKey && selectedIndexes) {
								selectedIndexes = [
									...selectedIndexes,
									[dataToCompare ? 1 : 0, rowIndex, columnIndex]
								];
							} else {
								selectedIndexes = [[dataToCompare ? 1 : 0, rowIndex, columnIndex]];
							}
						}}
					>
						{value}
					</button>
				{/each}
			</div>
		{/each}
	</div>
{/snippet}

<div class="h-full w-full p-2 dark:text-neutral-100">
	<div class="flex items-start gap-2 py-2">
		<ButtonLink href="/" aria-label="Назад" variant="tertiary" size="compact">
			<span class="icon-[mdi--arrow-back]"></span>
		</ButtonLink>
		<h2 class="flex-grow text-center text-lg font-bold dark:text-neutral-400">Налагоджувач</h2>
		<Button
			variant="tertiary"
			size="compact"
			aria-label="Завантажити відповіді команд"
			onclick={downloadData}
		>
			<span class="icon-[mdi--file-download-outline]"></span>
		</Button>
		<Button
			variant="tertiary"
			size="compact"
			aria-label="Відкрити відповіді команд"
			onclick={loadData}
		>
			<span class="icon-[mdi--file-upload-outline]"></span>
		</Button>
		<input type="file" bind:files bind:this={fileInput} accept=".json" hidden />
	</div>
	<div class="flex items-center justify-around px-12">
		<div class="flex gap-2">
			<Button variant="tertiary" size="compact" aria-label="Перша сторінка" onclick={goToFirstPage}>
				<span class="icon-[mdi--skip-backward-outline]"></span>
			</Button>
			<Button variant="tertiary" size="compact" aria-label="Попередня сторінка" onclick={prevPage}>
				<span class="icon-[mdi--navigate-before]"></span>
			</Button>
		</div>
		{#if allCommands.length}
			<select bind:value={selectedCommand} class="p-2">
				{#each allCommands as command}
					<option value={command} class="bg-neutral-500">
						{commandDisplay(command)}
					</option>
				{/each}
			</select>
		{:else}
			<div class="p-2">Немає даних</div>
		{/if}
		<div class="flex gap-2">
			<Button variant="tertiary" size="compact" aria-label="Наступна сторінка" onclick={nextPage}>
				<span class="icon-[mdi--navigate-next]"></span>
			</Button>
			<Button
				variant="tertiary"
				size="compact"
				aria-label="Остання сторінка"
				onclick={goToLastPage}
			>
				<span class="icon-[mdi--skip-forward-outline]"></span>
			</Button>
		</div>
	</div>
	<div>
		{#if pagesToCompare}
			<div class="text-center text-sm text-neutral-300">
				Виберіть байт за допомогою лівої кнопки миші або Shift+Ліва кнопка миші для вибору кількох
				байтів
			</div>

			<div class="grid grid-cols-2 justify-items-center">
				<div>
					<div class="text-center text-xs">Пакет #{page + 1}</div>
					{@render bytesTable(pagesToCompare[0])}
				</div>
				<div>
					<div class="text-center text-xs">Пакет #{page + 2}</div>
					{@render bytesTable(pagesToCompare[1], pagesToCompare[0])}
				</div>
			</div>
		{:else}
			Немає даних
		{/if}
		{#if selectedValue}
			<div class="px-4">
				Вибрано:
				<div class="grid grid-cols-2">
					<div>Шістнадцяткове число</div>
					<div class="text-right font-mono font-bold">{selectedValue}</div>

					<div>Десяткове число</div>
					<div class="text-right font-mono font-bold">{unsignedIntFromBytes(selectedValue)}</div>

					<div>Десяткове число зі знаком</div>
					<div class="text-right font-mono font-bold">{signedIntFromBytes(selectedValue)}</div>

					<div>Символ</div>
					<div class="text-right font-mono font-bold">
						{String.fromCharCode(unsignedIntFromBytes(selectedValue))}
					</div>

					<div>Біти</div>
					<div class="text-right font-mono font-bold">
						{#each selectedValue as byte}
							{unsignedIntFromBytes(byte).toString(2).padStart(8, '0')}
						{/each}
					</div>
				</div>
			</div>
		{/if}
		<DebugChart {selectedValueTimeline} />
	</div>

	{#if selectedIndexes}
		<div class="mt-8 text-center text-sm text-neutral-300">Код для копіювання</div>
		<code>
			<pre>
				[ {selectedIndexes.map((index) => `bytes[${index[1]}][${index[2]}]}`).join(', ')} ]
			</pre>
		</code>
	{/if}
</div>

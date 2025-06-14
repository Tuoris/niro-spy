<script lang="ts">
	import { elmDevice, enterCommandMode, exitCommandMode } from '$lib/bluetooth.store.svelte';
	import ButtonLink from '$lib/components/button-link.svelte';
	import Button from '$lib/components/button.svelte';
	import { COMMANDS } from '$lib/elm-device/elm-commands.constants';
	import { vinParse } from '$lib/vin-parse';

	const fakeVin =
		'K' +
		Array.from({ length: 16 })
			.map(() => 'X')
			.join('');

	let vinCode = $state(fakeVin);
	let vinError = $state(false);
	let vinCodePending = $state(false);

	const checkVinCode = async () => {
		if (vinCodePending) {
			return;
		}

		vinCodePending = true;
		vinError = false;

		await enterCommandMode();
		const response = await elmDevice.sendCommand(COMMANDS.HKMC_EV_VMCU_VIN_INFO);

		if ('vin' in response) {
			vinCode = response.vin as string;
		} else {
			vinError = true;
		}
		await exitCommandMode();
		vinCodePending = false;
	};

	let parsedVinInfo = $derived.by(() => vinParse(vinCode));
</script>

<div class="h-full w-full p-2 dark:text-neutral-100">
	<div class="flex items-start gap-2 py-2">
		<ButtonLink href="/" aria-label="Назад" variant="tertiary" size="compact">
			<span class="icon-[mdi--arrow-back]"></span>
		</ButtonLink>
		<h2 class="flex-grow text-center text-lg font-bold dark:text-neutral-400">VIN</h2>
	</div>

	<div class="m-4 flex flex-col gap-4">
		<input
			bind:value={vinCode}
			class={[
				'rounded border p-4 text-center font-mono text-xl tracking-wide',
				vinError ? 'border-red-500 text-red-500' : '',
				vinCodePending ? 'animate-pulse' : ''
			]}
		/>
		<div class="h-6 text-center text-sm text-red-500">
			{#if vinError}
				Не вдалось отримати VIN код
			{/if}
		</div>
		<Button onclick={checkVinCode}>Отримати VIN</Button>
	</div>
	{#if vinCode !== fakeVin}
		<div class="mx-4 grid grid-cols-4">
			<h2 class="col-span-4 py-2 text-xl">Інформація</h2>
			{#if parsedVinInfo.manufacturer}
				<div class="col-span-4 text-sm md:col-span-1">Виробник</div>
				<div class="col-span-4 px-2 font-bold md:col-span-3">{parsedVinInfo.manufacturer}</div>
			{/if}
			{#if parsedVinInfo.model}
				<div class="col-span-4 text-sm md:col-span-1">Модель</div>
				<div class="col-span-4 px-2 font-bold md:col-span-3">{parsedVinInfo.model}</div>
			{/if}
			{#if parsedVinInfo.year}
				<div class="col-span-4 text-sm md:col-span-1">Рік випуску</div>
				<div class="col-span-4 px-2 font-bold md:col-span-3">{parsedVinInfo.year}</div>
			{/if}
			{#if parsedVinInfo.type}
				<div class="col-span-4 text-sm md:col-span-1">Батарея і двигун</div>
				<div class="col-span-4 px-2 font-bold md:col-span-3">{parsedVinInfo.type}</div>
			{/if}
			{#if parsedVinInfo.productionPlant}
				<div class="col-span-4 text-sm md:col-span-1">Завод</div>
				<div class="col-span-4 px-2 font-bold md:col-span-3">{parsedVinInfo.productionPlant}</div>
			{/if}
			{#if parsedVinInfo.sequenceNumber}
				<div class="col-span-4 text-sm md:col-span-1">Порядковий номер</div>
				<div class="col-span-4 px-2 font-bold md:col-span-3">{parsedVinInfo.sequenceNumber}</div>
			{/if}
		</div>
	{/if}
</div>

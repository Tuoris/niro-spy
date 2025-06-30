<script lang="ts">
	import { elmDevice, enterCommandMode, exitCommandMode } from '$lib/bluetooth.store.svelte';
	import ButtonLink from '$lib/components/button-link.svelte';
	import Button from '$lib/components/button.svelte';
	import { COMMANDS } from '$lib/elm-device/elm-commands.constants';
	import { i18n } from '$lib/i18n/i18n';
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
		<h2 class="flex-grow text-center text-lg font-bold dark:text-neutral-400">{i18n.t('vin')}</h2>
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
				{i18n.t('unableToRetrieveVinCode')}
			{/if}
		</div>
		<Button onclick={checkVinCode}>{i18n.t('retrieveVinCode')}</Button>
	</div>
	{#if vinCode !== fakeVin}
		<div class="mx-4 grid grid-cols-4">
			<h2 class="col-span-4 py-2 text-xl">{i18n.t('info')}</h2>
			{#if parsedVinInfo.manufacturer}
				<div class="col-span-4 text-sm md:col-span-1">{i18n.t('manufacturer')}</div>
				<div class="col-span-4 px-2 font-bold md:col-span-3">
					{i18n.t(parsedVinInfo.manufacturer)}
				</div>
			{/if}
			{#if parsedVinInfo.model}
				<div class="col-span-4 text-sm md:col-span-1">{i18n.t('model')}</div>
				<div class="col-span-4 px-2 font-bold md:col-span-3">
					{i18n.t(parsedVinInfo.model)}
					{parsedVinInfo.market ? i18n.t(parsedVinInfo.market) : ''}
				</div>
			{/if}
			{#if parsedVinInfo.year}
				<div class="col-span-4 text-sm md:col-span-1">{i18n.t('manufacturingYear')}</div>
				<div class="col-span-4 px-2 font-bold md:col-span-3">{parsedVinInfo.year}</div>
			{/if}
			{#if parsedVinInfo.type}
				<div class="col-span-4 text-sm md:col-span-1">{i18n.t('batteryAndMotor')}</div>
				<div class="col-span-4 px-2 font-bold md:col-span-3">{i18n.t(parsedVinInfo.type)}</div>
			{/if}
			{#if parsedVinInfo.productionPlant}
				<div class="col-span-4 text-sm md:col-span-1">{i18n.t('factory')}</div>
				<div class="col-span-4 px-2 font-bold md:col-span-3">
					{i18n.t(parsedVinInfo.productionPlant)}
				</div>
			{/if}
			{#if parsedVinInfo.sequenceNumber}
				<div class="col-span-4 text-sm md:col-span-1">{i18n.t('sequenceNumber')}</div>
				<div class="col-span-4 px-2 font-bold md:col-span-3">
					{i18n.t(parsedVinInfo.sequenceNumber)}
				</div>
			{/if}
		</div>
	{/if}
</div>

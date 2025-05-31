<script lang="ts">
	import { enterDemoMode, exitDemoMode, isInDemoMode } from '$lib/demo-mode.svelte';
	import {
		connect as realConnect,
		mockConnect,
		startDataReading as realStartDataReading,
		mockStartDataReading,
		bluetoothState
	} from '$lib/bluetooth.store.svelte';
	import '/node_modules/flag-icons/css/flag-icons.min.css';

	import ButtonLink from '$lib/components/button-link.svelte';
	import Button from '$lib/components/button.svelte';
	import { i18n, LOCALES } from '$lib/i18n/i18n';

	const connect = isInDemoMode ? mockConnect : realConnect;
	const startDataReading = isInDemoMode ? mockStartDataReading : realStartDataReading;
	const connectAndStartDataReading = async () => {
		const isConnectedSuccessfully = await connect();
		if (isConnectedSuccessfully) {
			startDataReading();
		}
	};

	let elmDeviceStatus = $derived(bluetoothState.elmDeviceStatus);

	const localesConfig = [
		{
			language: LOCALES.UK,
			icon: 'fi-ua'
		},
		{
			language: LOCALES.EN,
			icon: 'fi-gb'
		},
		{
			language: LOCALES.KO,
			icon: 'fi-kr'
		}
	];
</script>

<div class="flex shrink justify-between font-bold text-neutral-400">
	<div class="w-30"></div>
	<div class="py-1">Niro Spy <span class="fi fi-ua"></span></div>
	<div class="flex w-30 items-center gap-2">
		{#each localesConfig as localeConfig}
			<button
				aria-label={localeConfig.language}
				class={[
					'flex items-center rounded-xs border p-1',
					localeConfig.language === i18n.resolvedLanguage
						? 'border-neutral-400'
						: 'border-transparent'
				]}
				onclick={() => i18n.changeLanguage(localeConfig.language)}
			>
				<span class={['fi', localeConfig.icon]}></span>
			</button>
		{/each}
	</div>
</div>
<div class="flex grow items-center justify-center">
	<div class="flex flex-col gap-2">
		<Button variant="primary" onclick={connectAndStartDataReading}
			>{i18n.t('connectToScanner')}</Button
		>
		<hr />
		<ButtonLink href="all-parameters" variant="secondary" disabled={elmDeviceStatus !== 'ready'}
			>{i18n.t('allParameters')}</ButtonLink
		>
		<ButtonLink href="/battery" variant="secondary" disabled={elmDeviceStatus !== 'ready'}>
			{i18n.t('battery')}</ButtonLink
		>
		<ButtonLink href="/tpms" variant="secondary" disabled={elmDeviceStatus !== 'ready'}>
			{i18n.t('tpms')}</ButtonLink
		>
		<hr />
		<ButtonLink href="/" variant="tertiary" onclick={isInDemoMode ? exitDemoMode : enterDemoMode}>
			{#if isInDemoMode}
				{i18n.t('exitDemoMode')}
			{:else}
				{i18n.t('demoMode')}
			{/if}</ButtonLink
		>
	</div>
</div>

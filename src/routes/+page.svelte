<script lang="ts">
	import { enterDemoMode, exitDemoMode, isInDemoMode } from '$lib/demo-mode.svelte';
	import {
		connect as realConnect,
		mockConnect,
		startDataReading as realStartDataReading,
		mockStartDataReading,
		bluetoothState
	} from '$lib/bluetooth.store.svelte';
	import { t } from 'i18next';
	import '/node_modules/flag-icons/css/flag-icons.min.css';

	import ButtonLink from '$lib/components/button-link.svelte';
	import Button from '$lib/components/button.svelte';
	import { currentLocale, LOCALES } from '$lib/i18n/i18n';

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
			locale: LOCALES.UK,
			icon: 'fi-ua'
		},
		{
			locale: LOCALES.EN,
			icon: 'fi-gb'
		}
	];
</script>

<div class="flex shrink justify-between font-bold text-neutral-400">
	<div class="w-18"></div>
	<div class="py-1">Niro Spy <span class="fi fi-ua"></span></div>
	<div class="flex w-18 items-center gap-2">
		{#each localesConfig as localeConfig}
			<button
				aria-label={localeConfig.locale}
				class={[
					'flex items-center rounded-xs border p-1',
					localeConfig.locale === currentLocale ? 'border-neutral-400' : 'border-transparent'
				]}
				onclick={() => {
					window.localStorage.setItem('lang', localeConfig.locale);
					window.location.reload();
				}}
			>
				<span class={['fi', localeConfig.icon]}></span>
			</button>
		{/each}
	</div>
</div>
<div class="flex grow items-center justify-center">
	<div class="flex flex-col gap-2">
		<Button variant="primary" onclick={connectAndStartDataReading}>{t('connectToScanner')}</Button>
		<hr />
		<ButtonLink href="all-parameters" variant="secondary" disabled={elmDeviceStatus !== 'ready'}
			>{t('allParameters')}</ButtonLink
		>
		<ButtonLink href="/battery" variant="secondary" disabled={elmDeviceStatus !== 'ready'}>
			{t('battery')}</ButtonLink
		>
		<ButtonLink href="/tpms" variant="secondary" disabled={elmDeviceStatus !== 'ready'}>
			{t('tpms')}</ButtonLink
		>
		<hr />
		<ButtonLink href="/" variant="tertiary" onclick={isInDemoMode ? exitDemoMode : enterDemoMode}>
			{#if isInDemoMode}
				{t('exitDemoMode')}
			{:else}
				{t('demoMode')}
			{/if}</ButtonLink
		>
	</div>
</div>

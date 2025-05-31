<script lang="ts">
	import '../app.css';
	import '$lib/i18n/i18n';

	import { bluetoothState } from '$lib/bluetooth.store.svelte';
	import { isInDemoMode } from '$lib/demo-mode.svelte';
	import { i18n } from '$lib/i18n/i18n';

	let serialConnectionStatus = $derived(bluetoothState.serialConnectionStatus);
	let elmDeviceStatus = $derived(bluetoothState.elmDeviceStatus);
	let bluetoothError = $derived(bluetoothState.bluetoothError);
	let lastCommandTime = $derived(bluetoothState.lastCommandTime);
	let heartbeat = $derived.by(() => (bluetoothState.heartbeat % 3) + 1);

	let { children } = $props();

	let notifications: string[] = $derived.by(() => (bluetoothError ? [bluetoothError] : []));
</script>

{#if i18n.isInitialized}
	<div
		class={[
			'pointer-events-none absolute inset-0 flex flex-col justify-end gap-2 pb-12',
			notifications.length ? 'px-2 py-2' : ''
		]}
	>
		{#each notifications as notification, index}
			<div class="red pointer-events-auto flex rounded-sm border-2 bg-red-400 px-2 py-2">
				<div></div>
				<div class="grow">
					{notification}
				</div>
			</div>
		{/each}
	</div>
	<section class="flex h-full flex-col">
		<main class="flex grow flex-col flex-wrap overflow-auto">
			{@render children()}
		</main>
		<footer
			class={[
				'flex flex-nowrap justify-center gap-4 border-t-1 border-neutral-900 bg-neutral-100 py-1 text-sm text-neutral-800 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
				isInDemoMode
					? "after:width-[80%] after:absolute after:scale-125 after:overflow-hidden after:font-bold after:opacity-20 after:content-['Demo-Demo-Demo-Demo-Demo-Demo']"
					: ''
			]}
		>
			<div class="flex flex-wrap items-center gap-2">
				<span class="icon-[mdi--bluetooth-transfer]"></span>
				<div>
					<div class="leading-none font-bold">{i18n.t('bluetooth')}</div>
					<div>
						{serialConnectionStatus === 'idle' || serialConnectionStatus === 'disconnected'
							? i18n.t('notConnected')
							: serialConnectionStatus === 'connecting'
								? i18n.t('connecting')
								: serialConnectionStatus === 'error'
									? i18n.t('error')
									: i18n.t('connected')}
					</div>
				</div>
			</div>
			<div class="flex flex-wrap items-center gap-2">
				<span class="icon-[mdi--car-info]"></span>
				<div>
					<div class="leading-none font-bold">ELM 327</div>
					<div>
						{elmDeviceStatus === 'idle'
							? i18n.t('notInitialized')
							: elmDeviceStatus === 'initializing'
								? i18n.t('initializing')
								: elmDeviceStatus === 'error'
									? i18n.t('initError')
									: i18n.t('ready')}
					</div>
				</div>
			</div>
			<div class="flex items-center gap-2">
				{#if heartbeat === 1}
					<span class="icon-[mdi--signal-cellular-1]"></span>
				{:else if heartbeat === 2}
					<span class="icon-[mdi--signal-cellular-2]"></span>
				{:else}
					<span class="icon-[mdi--signal-cellular-3]"></span>
				{/if}
				<span class="block min-w-[6ch] text-end text-sm">
					{i18n.t('lastCommandTimeMs', { lastCommandTime })}
				</span>
			</div>
		</footer>
	</section>
{/if}

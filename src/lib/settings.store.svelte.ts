import { getGeolocationPermission } from './geolocation.svelte';

type Settings = {
	geoLocationPermission: string;
	geolocationEnabled: boolean;
	priceOfKwh: number;
	defaultScannerName: string;
	askAboutSavingDefaultScanner: boolean;
}

const DEFAULT_PRICE_PER_KWH = 17;
const DEFAULT_ASK_ABOUT_SAVING_DEFAULT_SCANNER = true;
const savedPriceOfKwh = window.localStorage.getItem('priceOfKwh') ?? "";
const saved_defaultScannerName = window.localStorage.getItem('defaultScannerName') ?? ""
const savedAskAboutSavingDefaultScanner = window.localStorage.getItem('askAboutSavingDefaultScanner') ?? ""

export const settingsStore = $state<Settings>({
	geoLocationPermission: 'not available',
	geolocationEnabled: false,
	priceOfKwh: !Number.isNaN(parseFloat(savedPriceOfKwh)) ? parseFloat(savedPriceOfKwh) : DEFAULT_PRICE_PER_KWH,
	defaultScannerName: saved_defaultScannerName,
	askAboutSavingDefaultScanner: savedAskAboutSavingDefaultScanner ? savedAskAboutSavingDefaultScanner === 'true' : DEFAULT_ASK_ABOUT_SAVING_DEFAULT_SCANNER,
});

setTimeout(() => {
	getGeolocationPermission().then((status) => {
		settingsStore.geoLocationPermission = status;
		settingsStore.geolocationEnabled =
			status === 'granted' && `${window.localStorage.getItem('geolocationEnabled')}` === 'true';
	});
});

export const changeGeolocationEnabled = async (newValue: boolean) => {
	settingsStore.geolocationEnabled = newValue;
	window.localStorage.setItem('geolocationEnabled', `${newValue}`);
};

export const getGeolocationSettingEnabled = () => settingsStore.geolocationEnabled;

export const getDefaultScannerName = () => settingsStore.defaultScannerName;

export const settingsSaveToLocalStorage = () => {
	for (const key of [
		'priceOfKwh',
		'defaultScannerName',
		'askAboutSavingDefaultScanner'
	] satisfies (keyof typeof settingsStore)[]) {
		window.localStorage.setItem(key, `${settingsStore[key]}`)
	}
}

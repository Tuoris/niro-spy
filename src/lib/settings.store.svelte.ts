import { getGeolocationPermission } from './geolocation.svelte';

export const settingsStore = $state({
	geoLocationPermission: 'not available',
	geolocationEnabled: false,
	priceOfKwh: 17.0
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

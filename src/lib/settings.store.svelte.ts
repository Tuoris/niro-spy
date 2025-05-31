import { getGeolocationPermission } from './geolocation.svelte';

export const settingsStore = $state({
	geoLocationPermission: 'not available',
	geolocationEnabled: false
});

setTimeout(() => {
	getGeolocationPermission().then((status) => {
		settingsStore.geoLocationPermission = status;
		settingsStore.geolocationEnabled =
			status === 'granted' && `${window.localStorage.getItem('geolocationEnabled')}` === 'true';
	});
});

export const changeGeolocationEnabled = async (newValue: boolean) => {
	console.log({ newValue });
	settingsStore.geolocationEnabled = newValue;
	window.localStorage.setItem('geolocationEnabled', `${newValue}`);
};

export const getGeolocationSettingEnabled = () => settingsStore.geolocationEnabled;

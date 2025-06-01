import { getGeolocationPermission } from './geolocation.svelte';

const storedAcc = window.localStorage.getItem('geolocationAccuracyThreshold');

export const settingsStore = $state({
	geoLocationPermission: 'not available',
	geolocationEnabled: false,
	geolocationAccuracyThreshold: storedAcc ? parseInt(storedAcc) : 12
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

export const changeGeolocationAccuracyThreshold = async (newValue: number) => {
	settingsStore.geolocationAccuracyThreshold = newValue;
	window.localStorage.setItem('geolocationAccuracyThreshold', `${newValue}`);
};

export const getGeolocationSettingEnabled = () => settingsStore.geolocationEnabled;

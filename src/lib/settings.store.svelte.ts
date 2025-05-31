export const settingsStore = $state({
	geolocationAllowed: false
});

navigator.permissions &&
	navigator.permissions
		.query({ name: 'geolocation' })
		.then((permission) => (settingsStore.geolocationAllowed = permission.state === 'granted'));

export const isGeolocationAllowed = () => settingsStore.geolocationAllowed;

import { PARAM_FIELDS, type FieldType } from './common/constants/common-params.constants';
import { paramsState } from './params.svelte';
import { settingsStore } from './settings.store.svelte';

export const getGeolocationPermission = async () => {
	if (!navigator.permissions) {
		return 'not available';
	}

	const geolocationPermission = await navigator.permissions.query({ name: 'geolocation' });

	return geolocationPermission.state;
};

const options = {
	enableHighAccuracy: true,
	timeout: 10000,
	maximumAge: 0
};

let geolocationWatchId: any;

const positionCallback: PositionCallback = (pos) => {
	const coords = pos.coords;

	const { altitude, speed: speedMetersPerSecond, accuracy } = coords;

	const now = new Date().valueOf();
	if (altitude) {
		const field = PARAM_FIELDS.ALTITUDE_GPS;
		if (!paramsState.values[field as FieldType]) {
			paramsState.values[field as FieldType] = [];
		}

		paramsState.values[field as FieldType].push({
			timestamp: now,
			value: altitude
		});
	}

	if (speedMetersPerSecond) {
		if (accuracy && accuracy > 5) {
			return;
		}

		const speedKmPerHour = (speedMetersPerSecond * 3600) / 1000;

		if (speedKmPerHour < 0 || speedKmPerHour > 200) {
		}

		const field = PARAM_FIELDS.SPEED_GPS;
		if (!paramsState.values[field as FieldType]) {
			paramsState.values[field as FieldType] = [];
		}

		paramsState.values[field as FieldType].push({
			timestamp: now,
			value: speedKmPerHour
		});
	}
};

const positionErrorCallback: PositionErrorCallback = (err) => {
	console.error(`Geolocation error (${err.code}): ${err.message}`);
};

export const pollGeolocation = () => {
	if (!settingsStore.geolocationEnabled) {
		return;
	}

	geolocationWatchId = navigator.geolocation.watchPosition(
		positionCallback,
		positionErrorCallback,
		options
	);
};

export const stopPollingGeolocation = () => {
	if (geolocationWatchId) {
		navigator.geolocation.clearWatch(geolocationWatchId);
	}
	geolocationWatchId = null;
};

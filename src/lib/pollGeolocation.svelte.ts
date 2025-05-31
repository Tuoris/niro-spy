import { PARAM_FIELDS, type FieldType } from './common/constants/common-params.constants';
import { paramsState } from './params.svelte';
import { settingsStore } from './settings.store.svelte';

const options = {
	enableHighAccuracy: true,
	timeout: 10000,
	maximumAge: 0
};

let geolocationWatchId: any;

const positionCallback: PositionCallback = (pos) => {
	const coords = pos.coords;

	const { altitude, speed: speedMs } = coords;

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

	if (speedMs) {
		const speed = (speedMs * 3600) / 1000;

		const field = PARAM_FIELDS.SPEED_GPS;
		if (!paramsState.values[field as FieldType]) {
			paramsState.values[field as FieldType] = [];
		}

		paramsState.values[field as FieldType].push({
			timestamp: now,
			value: speed
		});
	}
};

const positionErrorCallback: PositionErrorCallback = (err) => {
	console.error(`Geolocation error (${err.code}): ${err.message}`);
};

export const pollGeolocation = () => {
	if (!settingsStore.geolocationAllowed) {
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

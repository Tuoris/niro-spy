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

const CALIBRATION_TIME = 7500;
let isCalibrating = false;
let calibrationTimeout: number;

const startGpsCalibration = () => {
	isCalibrating = true;

	calibrationTimeout = setTimeout(() => {
		isCalibrating = false;
	}, CALIBRATION_TIME);
};

const stopGpsCalibration = () => {
	isCalibrating = false;
	if (calibrationTimeout) {
		clearTimeout(calibrationTimeout);
	}
};

let geolocationWatchId: any;

const positionCallback: PositionCallback = (pos) => {
	const coords = pos.coords;

	const { altitude, speed: speedMetersPerSecond, accuracy } = coords;

	// accuracy in meters
	if ((accuracy ?? +Infinity) < 10) {
		stopGpsCalibration();
	}

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
		let speedKmPerHour = (speedMetersPerSecond * 3600) / 1000;

		if (speedKmPerHour < 0 || speedKmPerHour > 200) {
			speedKmPerHour = 0;
		}

		if (isCalibrating) {
			speedKmPerHour = 0;
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

	startGpsCalibration();

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

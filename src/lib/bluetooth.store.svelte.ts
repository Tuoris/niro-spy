import { ElmDevice } from '$lib/elm-device/elm-device';
import { COMMANDS } from '$lib/elm-device/elm-commands.constants';
import { WebBluetoothSerial } from '$lib/web-bluetooth-serial';
import {
	PARAM_FIELDS,
	PARAMS_CONFIG,
	type FieldType
} from './common/constants/common-params.constants';
import { INITIAL_PARAM_VALUES, paramsState } from './params.svelte';
import { pollGeolocation, stopPollingGeolocation } from './geolocation.svelte';
import { getGeolocationSettingEnabled } from './settings.store.svelte';
import type { ElmResponseLoggerArgs } from './elm-device/elm-device.types';
import { PARSING_ERROR_RESPONSE } from './elm-device/parsers/hkmc.parsers';
import { MOCK_ELM_RESPONSES } from './common/constants/mock-elm-responses.constants';
import { getCommandDebugKey } from './common/helpers/command.helpers';

let initialElmResponses: typeof MOCK_ELM_RESPONSES = MOCK_ELM_RESPONSES;
initialElmResponses = {};

export const bluetoothState = $state({
	serialConnectionStatus: 'idle',
	bluetoothError: '',
	elmDeviceStatus: 'idle',
	heartbeat: 0,
	lastCommandTime: 0,
	stopPollingCommand: false,
	elmResponses: initialElmResponses,
	isElmDebuggerEnabled: false,

	isCommandModeEnabled: false,
	isCommandModeReady: false
});

const checkCommandModeReady = () => bluetoothState.isCommandModeEnabled;

const appendElmResponse: ElmResponseLoggerArgs = (command, response) => {
	if (!bluetoothState.isElmDebuggerEnabled) {
		return;
	}

	const key = getCommandDebugKey(command);

	if (!bluetoothState.elmResponses[`${key}`]) {
		bluetoothState.elmResponses[`${key}`] = {
			values: [],
			command
		};
	}

	const existingResponses = bluetoothState.elmResponses[`${key}`];

	bluetoothState.elmResponses[`${key}`].values = existingResponses.values.concat([
		{
			timestamp: new Date().valueOf(),
			value: response
		}
	]);
};

const webBluetoothSerialDevice = new WebBluetoothSerial();
export const elmDevice = new ElmDevice(webBluetoothSerialDevice, appendElmResponse);

export async function connect() {
	bluetoothState.bluetoothError = '';

	if (!webBluetoothSerialDevice.checkWebBluetoothApiAvailable()) {
		bluetoothState.serialConnectionStatus = 'error';
		bluetoothState.bluetoothError = 'Web Bluetooth API не підтримується браузером.';
		return;
	}

	bluetoothState.serialConnectionStatus = 'connecting';
	const { isConnected, error } = await webBluetoothSerialDevice.connect();
	if (!isConnected) {
		bluetoothState.serialConnectionStatus = 'error';
		bluetoothState.bluetoothError = error;
		return;
	}

	bluetoothState.serialConnectionStatus = 'connected';

	bluetoothState.elmDeviceStatus = 'initializing';
	try {
		await elmDevice.sendCommand(COMMANDS.WARM_START);
		await elmDevice.sendCommand(COMMANDS.ECHO_OFF);
		await elmDevice.sendCommand(COMMANDS.EXTEND_WAIT_TIMEOUT);
		await elmDevice.sendCommand(COMMANDS.ALLOW_LONG_OBD2_RESPONSES);
		await elmDevice.sendCommand(COMMANDS.PIDS_SUPPORTED);
		bluetoothState.elmDeviceStatus = 'ready';
	} catch {
		bluetoothState.elmDeviceStatus = 'error';
	}

	return true;
}

export async function mockConnect() {
	bluetoothState.serialConnectionStatus = 'connected';
	bluetoothState.elmDeviceStatus = 'ready';

	return true;
}

export async function startDataReading() {
	bluetoothState.stopPollingCommand = false;
	paramsState.values = INITIAL_PARAM_VALUES;
	paramsState.recording = false;

	let start = new Date().valueOf();

	pollGeolocation();

	while (!bluetoothState.stopPollingCommand) {
		for (const command of [
			COMMANDS.HKMC_BMS_INFO01,
			COMMANDS.HKMC_EV_ECU_7D4_INFO01,
			COMMANDS.HKMC_BMS_INFO02,
			COMMANDS.HKMC_BMS_INFO03,
			COMMANDS.HKMC_BMS_INFO04,
			COMMANDS.HKMC_BMS_INFO05,
			COMMANDS.HKMC_BMS_INFO06,
			COMMANDS.HKMC_EV_CLUSTER_INFO02,
			COMMANDS.HKMC_EV_ABS_INFO01,
			COMMANDS.HKMC_EV_VMCU_INFO01,
			COMMANDS.HKMC_EV_VMCU_INFO02,
			COMMANDS.HKMC_EV_TPMS_ECU_INFO02,
			COMMANDS.HKMC_EV_AIRCON_ECU_INFO00,
			COMMANDS.HKMC_EV_OBC_INFO01,
			COMMANDS.HKMC_EV_OBC_INFO03,
			...(bluetoothState?.isElmDebuggerEnabled
				? [
						COMMANDS.HKMC_EV_AIRCON_ECU_INFO02,
						COMMANDS.HKMC_EC_BCM_INFO0C,
						COMMANDS.HKMC_EC_BCM_INFO0E,
						COMMANDS.HKMC_EC_BCM_INFO01,
						COMMANDS.HKMC_EC_BCM_INFO02,
						COMMANDS.HKMC_EC_BCM_INFO03,
						COMMANDS.HKMC_EC_BCM_INFO08,
						COMMANDS.HKMC_EV_IGMP_INFO03,
						COMMANDS.HKMC_EV_IGMP_INFO04,
						COMMANDS.HKMC_EV_IGMP_INFO05,
						COMMANDS.HKMC_EV_IGMP_INFO06,
						COMMANDS.HKMC_EV_IGMP_INFO07
					]
				: []),
			COMMANDS.HKMC_EV_MCU_INFO02
		]) {
			if (bluetoothState.stopPollingCommand) {
				break;
			}

			if (bluetoothState.isCommandModeEnabled) {
				// busy loop
				await new Promise((resolve) => setTimeout(() => resolve(true), 60));
				bluetoothState.isCommandModeReady = true;
				break;
			}

			try {
				const response = await elmDevice.sendCommand(command);

				if (response === PARSING_ERROR_RESPONSE) {
					continue;
				}

				const now = new Date().valueOf();
				for (const [field, value] of Object.entries(response)) {
					if (!paramsState.values[field as FieldType]) {
						paramsState.values[field as FieldType] = [];
					}
					paramsState.values[field as FieldType].push({
						timestamp: now,
						value: value as number
					});
				}

				bluetoothState.heartbeat += 1;

				const end = new Date().valueOf();
				bluetoothState.lastCommandTime = end - start;
				start = end;
			} catch {}
		}

		const cumulativeEnergyDischargedValues =
			paramsState.values[PARAM_FIELDS.CUMULATIVE_ENERGY_DISCHARGED];
		const odometerValues = paramsState.values[PARAM_FIELDS.ODOMETER_KM];
		if (cumulativeEnergyDischargedValues?.length && odometerValues?.length) {
			const lifetimeEfficiency =
				(cumulativeEnergyDischargedValues[cumulativeEnergyDischargedValues.length - 1].value /
					odometerValues[odometerValues.length - 1].value) *
				100;
			if (!paramsState.values[PARAM_FIELDS.AVERAGE_CONSUMPTION]) {
				paramsState.values[PARAM_FIELDS.AVERAGE_CONSUMPTION] = [];
			}
			paramsState.values[PARAM_FIELDS.AVERAGE_CONSUMPTION].push({
				timestamp:
					cumulativeEnergyDischargedValues[cumulativeEnergyDischargedValues.length - 1].timestamp,
				value: lifetimeEfficiency
			});
		}
	}

	if (bluetoothState.stopPollingCommand) {
		stopPollingGeolocation();
	}
}

export async function mockStartDataReading() {
	bluetoothState.stopPollingCommand = false;
	paramsState.values = INITIAL_PARAM_VALUES;
	paramsState.recording = false;

	let start = new Date().valueOf();

	pollGeolocation();

	const pollingIntervalId = setInterval(() => {
		for (const field of Object.values(PARAM_FIELDS)) {
			if (bluetoothState.stopPollingCommand) {
				clearInterval(pollingIntervalId);
				return;
			}

			if (
				([PARAM_FIELDS.SPEED_GPS, PARAM_FIELDS.ALTITUDE_GPS] as string[]).includes(field) &&
				getGeolocationSettingEnabled()
			) {
				continue;
			}

			if (field === PARAM_FIELDS.IS_BATTERY_CHARGING) {
				const batteryPowerValue = paramsState.values[PARAM_FIELDS.BATTERY_POWER];
				let previousBatteryPowerValue = batteryPowerValue[batteryPowerValue.length - 1]?.value || 0;

				paramsState.values[field].push({
					timestamp: new Date().valueOf(),
					value: previousBatteryPowerValue < 0 ? 1 : 0
				});
				continue;
			}

			if (field === PARAM_FIELDS.IS_AUX_BATTERY_CHARGING) {
				const batteryPowerValue = paramsState.values[PARAM_FIELDS.AUX_BATTERY_POWER];
				let previousBatteryPowerValue = batteryPowerValue[batteryPowerValue.length - 1]?.value || 0;

				paramsState.values[field].push({
					timestamp: new Date().valueOf(),
					value: previousBatteryPowerValue < 0 ? 1 : 0
				});
				continue;
			}

			if (field.endsWith('TireLiveData')) {
				paramsState.values[field].push({
					timestamp: new Date().valueOf(),
					value: 1
				});

				continue;
			}

			const fieldValues = paramsState.values[field];
			let previousValue = fieldValues[fieldValues.length - 1]?.value;
			if (previousValue === undefined) {
				previousValue =
					PARAMS_CONFIG.find(({ field: configField }) => configField === field)?.exampleValue ?? 0;
			}

			const jitterByField = {
				[PARAM_FIELDS.BATTERY_POWER]: 8000,
				[PARAM_FIELDS.SOH]: 1,
				[PARAM_FIELDS.AVERAGE_CONSUMPTION]: 1,
				[PARAM_FIELDS.MAX_POWER]: 0,
				[PARAM_FIELDS.MAX_REGENERATION_POWER]: 0,
				[PARAM_FIELDS.BATTERY_MAX_CELL_VOLTAGE]: 0.02,
				[PARAM_FIELDS.BATTERY_MAX_CELL_VOLTAGE_NO]: 2,
				[PARAM_FIELDS.BATTERY_MIN_CELL_VOLTAGE]: 0.02,
				[PARAM_FIELDS.BATTERY_MIN_CELL_VOLTAGE_NO]: 2,
				[PARAM_FIELDS.AUX_BATTERY_VOLTAGE_BMS]: 0.3,
				[PARAM_FIELDS.FRONT_LEFT_TIRE_PRESSURE]: 0.1,
				[PARAM_FIELDS.FRONT_RIGHT_TIRE_PRESSURE]: 0.1,
				[PARAM_FIELDS.REAR_RIGHT_TIRE_PRESSURE]: 0.1,
				[PARAM_FIELDS.REAR_LEFT_TIRE_PRESSURE]: 0.1,
				[PARAM_FIELDS.FRONT_LEFT_TIRE_TEMPERATURE]: 2,
				[PARAM_FIELDS.FRONT_RIGHT_TIRE_TEMPERATURE]: 2,
				[PARAM_FIELDS.REAR_RIGHT_TIRE_TEMPERATURE]: 2,
				[PARAM_FIELDS.REAR_LEFT_TIRE_TEMPERATURE]: 2,
				[PARAM_FIELDS.GEAR]: 0
			};

			let jitterValue = jitterByField[field as keyof typeof jitterByField] ?? 10;

			if (field.startsWith('cellVoltage')) {
				jitterValue = 0.008;
			}

			paramsState.values[field].push({
				timestamp: new Date().valueOf(),
				value: previousValue + Math.random() * jitterValue - jitterValue / 2
			});
		}
		bluetoothState.heartbeat += 1;

		const end = new Date().valueOf();
		bluetoothState.lastCommandTime = end - start;
		start = end;
	}, 700);
}

export async function enterCommandMode() {
	bluetoothState.isCommandModeEnabled = true;

	const promise = new Promise((resolve) => {
		const interval = setInterval(() => {
			if (checkCommandModeReady()) {
				clearInterval(interval);
				resolve(true);
			}
		}, 60);
	});

	return promise;
}

export async function exitCommandMode() {
	bluetoothState.isCommandModeReady = false;
	bluetoothState.isCommandModeEnabled = false;
}

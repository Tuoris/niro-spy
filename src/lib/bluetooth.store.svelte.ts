import { ElmDevice } from '$lib/elm-device/elm-device';
import { COMMANDS } from '$lib/elm-device/elm-commands.constants';
import { WebBluetoothSerial } from '$lib/web-bluetooth-serial';
import { PARAM_FIELDS, PARAMS_CONFIG, type FieldType } from './common/constants/common.constants';
import { paramsState } from './params.svelte';

export const bluetoothState = $state({
	serialConnectionStatus: 'idle',
	elmDeviceStatus: 'idle',
	heartbeat: 0
});

const webBluetoothSerialDevice = new WebBluetoothSerial();
const elmDevice = new ElmDevice(webBluetoothSerialDevice);

export async function connect() {
	if (!webBluetoothSerialDevice.checkWebBluetoothApiAvailable()) {
		bluetoothState.serialConnectionStatus = 'error';
		return;
	}

	bluetoothState.serialConnectionStatus = 'connecting';
	const isConnected = await webBluetoothSerialDevice.connect();
	if (!isConnected) {
		bluetoothState.serialConnectionStatus = 'error';
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
	let stop = false;

	while (!stop) {
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
			COMMANDS.HKMC_EV_VMCU_INFO01
		]) {
			try {
				const response = await elmDevice.sendCommand(command);
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
			} catch {}
		}

		const cumulativeEnergyChargedValues =
			paramsState.values[PARAM_FIELDS.CUMULATIVE_ENERGY_CHARGED];
		const odometerValues = paramsState.values[PARAM_FIELDS.ODOMETER_KM];
		if (cumulativeEnergyChargedValues?.length && odometerValues?.length) {
			const lifetimeEfficiency =
				(cumulativeEnergyChargedValues[cumulativeEnergyChargedValues.length - 1].value /
					odometerValues[odometerValues.length - 1].value) *
				100;
			if (!paramsState.values[PARAM_FIELDS.AVERAGE_CONSUMPTION]) {
				paramsState.values[PARAM_FIELDS.AVERAGE_CONSUMPTION] = [];
			}
			paramsState.values[PARAM_FIELDS.AVERAGE_CONSUMPTION].push({
				timestamp:
					cumulativeEnergyChargedValues[cumulativeEnergyChargedValues.length - 1].timestamp,
				value: lifetimeEfficiency
			});
		}
	}
}

export async function mockStartDataReading() {
	setInterval(() => {
		for (const field of Object.values(PARAM_FIELDS)) {
			const fieldValues = paramsState.values[field];
			let previousValue = fieldValues[fieldValues.length - 1]?.value;
			if (previousValue === undefined) {
				previousValue =
					PARAMS_CONFIG.find(({ field: configField }) => configField === field)?.exampleValue ?? 0;
			}

			const jitterValue = field === 'batteryPower' ? 8000 : 10;

			paramsState.values[field].push({
				timestamp: new Date().valueOf(),
				value: previousValue + Math.random() * jitterValue - jitterValue / 2
			});
		}
		bluetoothState.heartbeat += 1;
	}, 500);
}

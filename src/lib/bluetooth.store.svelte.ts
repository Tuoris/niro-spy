import { ElmDevice } from '$lib/elm-device/elm-device';
import { COMMANDS } from '$lib/elm-device/elm-commands.constants';
import { WebBluetoothSerial } from '$lib/web-bluetooth-serial';
import {
	PARAM_FIELDS,
	PARAMS_CONFIG,
	type FieldType
} from './common/constants/common-params.constants';
import { paramsState } from './params.svelte';

export const bluetoothState = $state({
	serialConnectionStatus: 'idle',
	bluetoothError: '',
	elmDeviceStatus: 'idle',
	heartbeat: 0,
	lastCommandTime: 0
});

const webBluetoothSerialDevice = new WebBluetoothSerial();
const elmDevice = new ElmDevice(webBluetoothSerialDevice);

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
	let stop = false;
	let start = new Date().valueOf();

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
			COMMANDS.HKMC_EV_VMCU_INFO01,
			COMMANDS.HKMC_EV_TPMS_ECU_INFO02,
			COMMANDS.HKMC_EV_AIRCON_ECU_INFO00
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

				const end = new Date().valueOf();
				bluetoothState.lastCommandTime = end - start;
				start = end;
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
	let start = new Date().valueOf();
	setInterval(() => {
		for (const field of Object.values(PARAM_FIELDS)) {
			if (field === PARAM_FIELDS.IS_BATTERY_CHARGING) {
				const batteryPowerValue = paramsState.values[PARAM_FIELDS.BATTERY_POWER];
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
				[PARAM_FIELDS.AUX_BATTERY_VOLTAGE]: 0.3,
				[PARAM_FIELDS.FRONT_LEFT_TIRE_PRESSURE]: 0.1,
				[PARAM_FIELDS.FRONT_RIGHT_TIRE_PRESSURE]: 0.1,
				[PARAM_FIELDS.REAR_RIGHT_TIRE_PRESSURE]: 0.1,
				[PARAM_FIELDS.REAR_LEFT_TIRE_PRESSURE]: 0.1,
				[PARAM_FIELDS.FRONT_LEFT_TIRE_TEMPERATURE]: 2,
				[PARAM_FIELDS.FRONT_RIGHT_TIRE_TEMPERATURE]: 2,
				[PARAM_FIELDS.REAR_RIGHT_TIRE_TEMPERATURE]: 2,
				[PARAM_FIELDS.REAR_LEFT_TIRE_TEMPERATURE]: 2
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

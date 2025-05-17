import { ElmDevice } from '$lib/elm-device/elm-device';
import { COMMANDS } from '$lib/elm-device/elm-device.constants';
import { WebBluetoothSerial } from '$lib/web-bluetooth-serial';

const webBluetoothSerialDevice = new WebBluetoothSerial();
let bluetoothState = $state('idle');
export const getBluetoothState = () => bluetoothState;

const elmDevice = new ElmDevice(webBluetoothSerialDevice);
let elmDeviceState = $state('idle');
export const getElmDeviceState = () => elmDeviceState;

export async function connect() {
	if (!webBluetoothSerialDevice.checkWebBluetoothApiAvailable()) {
		bluetoothState = 'error';
		return;
	}

	bluetoothState = 'connecting';
	const isConnected = await webBluetoothSerialDevice.connect();
	if (!isConnected) {
		bluetoothState = 'error';
		return;
	}

	bluetoothState = 'connected';

	elmDeviceState = 'initializing';
	try {
		await elmDevice.sendCommand(COMMANDS.WARM_START);
		await elmDevice.sendCommand(COMMANDS.ECHO_OFF);
		await elmDevice.sendCommand(COMMANDS.EXTEND_WAIT_TIMEOUT);
		await elmDevice.sendCommand(COMMANDS.ALLOW_LONG_OBD2_RESPONSES);
		await elmDevice.sendCommand(COMMANDS.PIDS_SUPPORTED);
		elmDeviceState = 'ready';
	} catch {
		elmDeviceState = 'error';
	}
}

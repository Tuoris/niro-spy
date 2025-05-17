import type { WebBluetoothSerial } from '$lib/web-bluetooth-serial';
import type { Command } from './elm-device.types';
import { adaptValueFromObd2CommandResponse } from './parsers/obd2.parsers';

export class ElmDevice {
	bluetoothDevice: WebBluetoothSerial;
	constructor(bluetoothDevice: WebBluetoothSerial) {
		this.bluetoothDevice = bluetoothDevice;
	}

	async sendCommand(command: Command) {
		if (command.header) {
			await this.bluetoothDevice.sendData(command.header);
		}

		let response = await this.bluetoothDevice.sendData(command.payload);

		if (command.payload.startsWith('01') || command.payload.startsWith('09')) {
			response = adaptValueFromObd2CommandResponse(response || '', command.payload);
		}

		const result = command.responseParser(response || '');

		return result;
	}
}

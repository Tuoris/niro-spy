import type { WebBluetoothSerial } from '$lib/web-bluetooth-serial';
import type { Command } from './elm-device.types';
import { adaptValueFromObd2CommandResponse } from './parsers/obd2.parsers';

export class ElmDevice {
	bluetoothDevice: WebBluetoothSerial;
	currentHeader: string;
	constructor(bluetoothDevice: WebBluetoothSerial) {
		this.bluetoothDevice = bluetoothDevice;
		this.currentHeader = '';
	}

	async sendCommand(command: Command) {
		if (command.header && command.header !== this.currentHeader) {
			await this.bluetoothDevice.sendData(`AT SH ${command.header}`);
			await this.waitBetweenCommands();
			this.currentHeader = command.header;
		}

		let response = await this.bluetoothDevice.sendData(command.payload);
		await this.waitBetweenCommands();

		if (command.payload.startsWith('01') || command.payload.startsWith('09')) {
			response = adaptValueFromObd2CommandResponse(response || '', command.payload);
		}

		try {
			const result = command.responseParser(response || '');
			return result;
		} catch (error) {
			console.error(error);
			return {};
		}
	}

	async waitBetweenCommands() {
		await new Promise((resolve) => setTimeout(() => resolve(true), 60));
	}
}

import type { WebBluetoothSerial } from '$lib/web-bluetooth-serial';
import type { Command, ElmResponseLoggerArgs } from './elm-device.types';
import { adaptValueFromObd2CommandResponse } from './parsers/obd2.parsers';

export class ElmDevice {
	bluetoothDevice: WebBluetoothSerial;
	currentHeader: string;
	responseLogger?: ElmResponseLoggerArgs;

	constructor(bluetoothDevice: WebBluetoothSerial, responseLogger?: ElmResponseLoggerArgs) {
		this.bluetoothDevice = bluetoothDevice;
		this.currentHeader = '';
		this.responseLogger = responseLogger;
	}

	async sendCommand(command: Command) {
		if (command.header && command.header !== this.currentHeader) {
			await this.bluetoothDevice.sendData(`AT SH ${command.header}`);
			await this.waitBetweenCommands();
			this.currentHeader = command.header;
		}

		let response = await this.bluetoothDevice.sendData(command.payload);
		await this.waitBetweenCommands(command?.waitAfterCommand);

		if (command.payload.startsWith('01') || command.payload.startsWith('09')) {
			response = adaptValueFromObd2CommandResponse(response || '', command.payload);
		}

		if (this.responseLogger) {
			this.responseLogger(command, response || '');
		}

		try {
			const result = command.responseParser(response || '');
			return result;
		} catch (error) {
			console.error(error);
			return {};
		}
	}

	async waitBetweenCommands(milliseconds = 70) {
		await new Promise((resolve) => setTimeout(() => resolve(true), milliseconds));
	}
}

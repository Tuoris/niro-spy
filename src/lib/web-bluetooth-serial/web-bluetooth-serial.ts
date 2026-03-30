/// <reference types="web-bluetooth" />

import { CONFIGS, EMPTY_DATA_VIEW } from './web-bluetooth-serial.constants';

function consoleLoggerHandler(string: string, level: string = 'info') {
	// console.log(`${new Date().toISOString()}: ${string}`);
}

export class WebBluetoothSerial {
	isConnected = false;
	bluetoothDevice: BluetoothDevice | null = null;
	readCharacteristic: BluetoothRemoteGATTCharacteristic | null = null;
	writeCharacteristic: BluetoothRemoteGATTCharacteristic | null = null;
	currentCommand = '';

	logHandlers = [consoleLoggerHandler];
	log(message: string, level: string = 'debug') {
		for (const logHandler of this.logHandlers) {
			logHandler(message, level);
		}
	}

	addLogHandler(logHandler: (string: string, level?: string) => void) {
		this.logHandlers.push(logHandler);
	}

	checkWebBluetoothApiAvailable() {
		return Boolean(navigator?.bluetooth) && navigator.bluetooth.requestDevice;
	}

	async connect() {
		this.log('Request any Bluetooth device that supports ELM327 service...');

		if (!this.checkWebBluetoothApiAvailable()) {
			this.log('Web Bluetooth API is not supported by the browser.', 'error');
			return {
				isConnected: this.isConnected,
				error: `Web Bluetooth API не підтримується браузером.`
			};
		}

		try {
			const device = await navigator.bluetooth.requestDevice({
				acceptAllDevices: true,
				optionalServices: CONFIGS.map((config) => config.serviceUuid)
			});

			this.log(`Requesting device: ${device.name} (${device.id})`);
			this.bluetoothDevice = device;
			const isConnected = await this.connectAndSetupBluetoothSerialDevice();
			this.bluetoothDevice.addEventListener('gattserverdisconnected', () => this.cleanUp())
			return { isConnected, error: '' };
		} catch (error) {
			const errorMessage = `${error}`.includes('NotFoundError')
				? "З'єднання з пристроєм скасовано."
				: `Помилка: ${error}`;
			this.log(errorMessage, 'error');
			return { isConnected: this.isConnected, error: errorMessage };
		}
	}

	addDisconnectHandler(handler: (event: Event) => void) {
		if (this.bluetoothDevice) {
			this.bluetoothDevice.addEventListener('gattserverdisconnected', handler)
		}
	}

	async connectAndSetupBluetoothSerialDevice() {
		if (!this.bluetoothDevice || !this.bluetoothDevice.gatt) {
			return this.isConnected;
		}

		const server = await this.bluetoothDevice.gatt.connect();
		this.log('GATT server connected.');
		this.log('Getting device service...');

		let service;
		let validConfig;
		for (const config of CONFIGS.values()) {
			try {
				service = await server.getPrimaryService(config.serviceUuid);
				validConfig = config;
				this.log('Service found, getting characteristics (data sources)...');
			} catch {
				this.log(`Service ${config.serviceUuid} is not supported...`);
			}
		}

		if (!service || !validConfig) {
			this.log('The device does not support any of the communication profiles.', 'error');
			return this.isConnected;
		}

		this.readCharacteristic = await service.getCharacteristic(validConfig.characteristicUuid);
		if (validConfig.writeCharacteristicUuid) {
			this.writeCharacteristic = await service.getCharacteristic(
				validConfig.writeCharacteristicUuid
			);
		} else {
			this.writeCharacteristic = this.readCharacteristic;
		}

		this.log(`Found Read Characteristic: ${this.readCharacteristic.uuid}`);
		this.log(`Found Write Characteristic: ${this.writeCharacteristic.uuid}`);

		this.log('Creating a subscription to receive data...');
		this.readCharacteristic.addEventListener('characteristicvaluechanged', () => {
			const rawValue = this.readCharacteristic?.value || EMPTY_DATA_VIEW;
			this.receiveValue(rawValue);
		});
		await this.readCharacteristic.startNotifications();

		this.log('Subscribed - ready to received data.');

		this.isConnected = true;
		return this.isConnected;
	}

	receiveBuffer = '';
	responseResolve: ((value: string) => void) | null = null;
	commandTimeStart: number | null = null;

	receiveValue(rawValue: DataView) {
		const value = new TextDecoder().decode(rawValue).trim();
		this.log(`Received: ${value}`);

		this.receiveBuffer += value;

		if (value.includes('>')) {
			this.resolveReceivedValue(this.receiveBuffer);
		}
	}

	resolveReceivedValue(value: string) {
		if (this.commandTimeStart) {
			const commandTime = new Date().valueOf() - this.commandTimeStart;
			this.log(`Execution time: ${commandTime} milliseconds.`);
		} else {
			console.warn('Data received without the initial time.');
		}

		if (this.responseResolve) {
			this.responseResolve(value);
			this.pendingCommandPromise = null;
		}

		this.receiveBuffer = '';
	}

	pendingCommandPromise: Promise<string> | null = null;

	async sendData(data: string) {
		if (!this.writeCharacteristic || !this.isConnected) {
			this.log(`Attempting to send command: ${data} - no connection.`, 'error');
			return;
		}

		if (this.pendingCommandPromise) {
			this.log('Waiting for a response to the previous command...');
			const timeout = setTimeout(() => {
				this.log(
					'The response from the previous command was not received within 1 second - it will be canceled!',
					'error'
				);
				this.resolveReceivedValue('');
			}, 1000);
			await this.pendingCommandPromise;
			clearTimeout(timeout);
		}

		if (data) {
			this.log(`Sending: ${data}`);
			this.commandTimeStart = new Date().valueOf();
			await this.writeCharacteristic.writeValueWithoutResponse(new TextEncoder().encode(data + '\r'));
			this.currentCommand = data.trim();
			this.log('Sent, waiting for response...')
		}

		this.pendingCommandPromise = new Promise((resolve) => {
			this.responseResolve = resolve;
		});

		return this.pendingCommandPromise;
	}

	cleanUp() {
		try {
			this.resolveReceivedValue('>');
			this.isConnected = false;
		} catch (error) {
			console.warn('Error during cleanUp', error);
		}
	}
}

/// <reference types="web-bluetooth" />

import { CONFIGS, EMPTY_DATA_VIEW } from './web-bluetooth-serial.constants';

function consoleLoggerHandler(string: string, level: string = 'info') {
	console.log(`${new Date().toISOString()}: ${string}`);
}

export class WebBluetoothSerial {
	isConnected = false;
	bluetoothDevice: BluetoothDevice | null = null;
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
		this.log('Запит будь-якого пристрою Bluetooth, який підтримує сервіс ELM327...');

		if (!this.checkWebBluetoothApiAvailable()) {
			this.log(`Web Bluetooth API не підтримується браузером.`, 'error');
			return this.isConnected;
		}

		try {
			const device = await navigator.bluetooth.requestDevice({
				acceptAllDevices: true,
				optionalServices: CONFIGS.map((config) => config.serviceUuid)
			});

			this.log(`Запит пристрою: ${device.name} (${device.id})`);
			this.bluetoothDevice = device;
			return await this.connectAndSetupBluetoothSerialDevice();
		} catch (error) {
			this.log(`Помилка: ${error}`, 'error');
			return this.isConnected;
		}
	}

	async connectAndSetupBluetoothSerialDevice() {
		if (!this.bluetoothDevice || !this.bluetoothDevice.gatt) {
			return this.isConnected;
		}

		const server = await this.bluetoothDevice.gatt.connect();
		this.log('Сервер GATT підключено.');
		this.log('Отримання сервісу пристрою...');

		let service;
		let serviceIndex;
		for (const [index, config] of CONFIGS.entries()) {
			try {
				service = await server.getPrimaryService(config.serviceUuid);
				serviceIndex = index;
				this.log('Сервіс знайдено, отримання характеристики (джерела даних)...');
			} catch {
				this.log(`Сервіс ${config.serviceUuid} не підтримується...`);
			}
		}

		if (!service || !serviceIndex) {
			this.log('Пристрій не підтримує жодного з профілів комунікації.', 'error');
			return this.isConnected;
		}

		const characteristicUUID = CONFIGS[serviceIndex].characteristicUuid;
		const characteristic = await service.getCharacteristic(characteristicUUID);

		this.log(`Знайдено характеристику: ${characteristicUUID}`);
		this.writeCharacteristic = characteristic;

		await this.writeCharacteristic.startNotifications();
		this.log('Створення підписки на отримання відповідей.');
		this.writeCharacteristic.addEventListener('characteristicvaluechanged', (event) => {
			const eventTarget = event?.currentTarget as BluetoothRemoteGATTCharacteristic;
			const rawValue = eventTarget?.value || EMPTY_DATA_VIEW;
			this.receiveValue(rawValue);
		});

		this.log('Підписку створено - готовий до роботи.');

		this.isConnected = true;
		return this.isConnected;
	}

	receiveBuffer = '';
	responseResolve: ((value: string) => void) | null = null;
	commandTimeStart: number | null = null;

	receiveValue(rawValue: DataView) {
		const value = new TextDecoder().decode(rawValue).trim();
		this.log(`Отримано: ${value}`);

		this.receiveBuffer += value;

		if (value.includes('>')) {
			this.resolveReceivedValue(this.receiveBuffer);
		}
	}

	resolveReceivedValue(value: string) {
		if (this.commandTimeStart) {
			const commandTime = new Date().valueOf() - this.commandTimeStart;
			this.log(`Час виконання: ${commandTime} мілісекунд.`);
		} else {
			console.warn('Отримано результат без початкового часу виконання.');
		}

		if (this.responseResolve) {
			this.responseResolve(value);
			this.pendingCommandPromise = null;
		}

		this.receiveBuffer = '';
	}

	pendingCommandPromise: Promise<string> | null = null;

	async sendData(data: string) {
		if (!this.writeCharacteristic) {
			this.log(`Спроба надіслати команду: ${data} - відсутнє підключення.`, 'error');
			return;
		}

		if (this.pendingCommandPromise) {
			this.log('Очікую на відповідь на попередню команду...');
			const timeout = setTimeout(() => {
				this.log(
					'Відповідь від попередньої команди не отримано протягом 1 секунди - її буде скасовано!',
					'error'
				);
				this.resolveReceivedValue('');
			}, 1000);
			await this.pendingCommandPromise;
			clearTimeout(timeout);
		}

		if (data) {
			this.log(`Надсилання: ${data}`);
			this.commandTimeStart = new Date().valueOf();
			this.writeCharacteristic.writeValue(new TextEncoder().encode(data + '\r'));
			this.currentCommand = data.trim();
		}

		this.pendingCommandPromise = new Promise((resolve) => {
			this.responseResolve = resolve;
		});

		return this.pendingCommandPromise;
	}
}

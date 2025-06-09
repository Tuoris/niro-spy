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
		this.log('Запит будь-якого пристрою Bluetooth, який підтримує сервіс ELM327...');

		if (!this.checkWebBluetoothApiAvailable()) {
			this.log('Web Bluetooth API не підтримується браузером.', 'error');
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

			this.log(`Запит пристрою: ${device.name} (${device.id})`);
			this.bluetoothDevice = device;
			const isConnected = await this.connectAndSetupBluetoothSerialDevice();
			return { isConnected, error: '' };
		} catch (error) {
			const errorMessage = `${error}`.includes('NotFoundError')
				? "З'єднання з пристроєм скасовано."
				: `Помилка: ${error}`;
			this.log(errorMessage, 'error');
			return { isConnected: this.isConnected, error: errorMessage };
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
		let validConfig;
		for (const config of CONFIGS.values()) {
			try {
				service = await server.getPrimaryService(config.serviceUuid);
				validConfig = config;
				this.log('Сервіс знайдено, отримання характеристики (джерела даних)...');
			} catch {
				this.log(`Сервіс ${config.serviceUuid} не підтримується...`);
			}
		}

		if (!service || !validConfig) {
			this.log('Пристрій не підтримує жодного з профілів комунікації.', 'error');
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

		this.log(`Знайдено Read Характеристику: ${this.readCharacteristic.uuid}`);
		this.log(`Знайдено Write Характеристику: ${this.writeCharacteristic.uuid}`);

		this.log('Створення підписки на отримання відповідей.');
		this.readCharacteristic.addEventListener('characteristicvaluechanged', () => {
			const rawValue = this.readCharacteristic?.value || EMPTY_DATA_VIEW;
			this.receiveValue(rawValue);
		});
		await this.readCharacteristic.startNotifications();

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

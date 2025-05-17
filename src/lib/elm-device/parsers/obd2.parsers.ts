import { unsignedIntFromBytes } from './elm-parser.utils';

export function adaptValueFromObd2CommandResponse(value: string, currentCommand: string) {
	let adaptedValue = value;

	if (!(currentCommand.startsWith('01') || currentCommand.startsWith('09'))) {
		return adaptedValue;
	}

	adaptedValue = value.replaceAll(/\s/g, '').replaceAll('>', '');

	const commandResponseSuccessHeader = currentCommand
		.replaceAll(/\s/g, '')
		.replace(/^01/, '41')
		.replace(/^09/, '49');

	if (!adaptedValue.includes(commandResponseSuccessHeader)) {
		return `<Invalid response> ${value}`;
	}

	const startDataIndex = adaptedValue.indexOf(commandResponseSuccessHeader);
	const dataSlice = adaptedValue.slice(startDataIndex);
	const chunks = [];
	for (let index = 0; index < Math.ceil(dataSlice.length / 2); index++) {
		const currentSlice = dataSlice.slice(index * 2, (index + 1) * 2);
		chunks.push(currentSlice);
	}

	return chunks.join(' ');
}

export function defaultParser(value: string) {
	return { value };
}

export function parseMonitorStatusSinceDtcsCleared(value: string) {
	const separateBytes = value.split(' ');
	const byteA = separateBytes[2];
	const byteABits = unsignedIntFromBytes(byteA).toString(2);
	const isCheckEngineLightOn = byteABits[0] === '1';
	const numberOfConfirmedEmissionsRelatedDtcs = parseInt(byteABits.slice(1), 2);

	// TODO: Parse rest oof the data

	return { isCheckEngineLightOn, numberOfConfirmedEmissionsRelatedDtcs };
}

export function parseEngineCoolantTemperature(value: string) {
	const separateBytes = value.split(' ');
	const temperatureByte = separateBytes[2];
	const temperatureValue = unsignedIntFromBytes(temperatureByte) - 40;

	return { temperatureValue };
}

export function parseVINResponse(value: string) {
	const dataBytesWithoutPrefix = value.split(' ').map((bytes) => bytes.slice(3));
	const dataBytesWithLeftPadding = dataBytesWithoutPrefix.flat();
	const indexOfFirstMeaningfulByte = dataBytesWithLeftPadding.findIndex((byte) => byte !== '00');
	const dataBytes = dataBytesWithLeftPadding.slice(indexOfFirstMeaningfulByte);

	const vinString = dataBytes.map((byte) => String.fromCharCode(parseInt(byte, 16))).join('');

	return { vinString };
}

export function parseCalculatedEngineLoad(value: string) {
	const separateBytes = value.split(' ');
	const engineLoadByte = separateBytes[2];
	const engineLoadValue = unsignedIntFromBytes(engineLoadByte) / 2.55;

	return { engineLoadValue };
}

export function parseEngineOilTemperature(value: string) {
	const separateBytes = value.split(' ');
	const temperatureByte = separateBytes[2];
	const temperatureValue = unsignedIntFromBytes(temperatureByte) - 40;

	return { temperatureValue };
}

export function parseEngineSpeed(value: string) {
	const separateBytes = value.split(' ');
	const rpmByteA = separateBytes[2];
	const rpmByteB = separateBytes[3];
	const rpmValue = unsignedIntFromBytes([rpmByteA, rpmByteB]) / 4;

	return { rpmValue };
}

export function parseVehicleSpeed(value: string) {
	const separateBytes = value.split(' ');
	const speedByte = separateBytes[2];
	const speedValue = unsignedIntFromBytes(speedByte);

	return { speedValue };
}

export function parseIntakeAirTemperature(value: string) {
	const separateBytes = value.split(' ');
	const temperatureByte = separateBytes[2];
	const temperatureValue = unsignedIntFromBytes(temperatureByte) - 40;

	return { temperatureValue };
}

export function parseMassAirFlowSensor(value: string) {
	const separateBytes = value.split(' ');
	const massAirFlowA = separateBytes[2];
	const massAirFlowB = separateBytes[3];
	const massAirFlowValue = unsignedIntFromBytes([massAirFlowA, massAirFlowB]) / 100;

	return { massAirFlowValue };
}

export function parseThrottlePosition(value: string) {
	const separateBytes = value.split(' ');
	const throttlePositionValue = (unsignedIntFromBytes(separateBytes[2]) * 100) / 255;

	return { throttlePositionValue };
}

export function parseFuelTankLevel(value: string) {
	const separateBytes = value.split(' ');
	const fuelTankLevelByte = separateBytes[2];
	const fuelTankLevelValue = (100 / 255) * unsignedIntFromBytes(fuelTankLevelByte);

	return { fuelTankLevelValue };
}

export function parseControlModuleVoltage(value: string) {
	const separateBytes = value.split(' ');
	const voltageByteA = separateBytes[2];
	const voltageByteB = separateBytes[3];
	const voltageValue = unsignedIntFromBytes([voltageByteA, voltageByteB]) / 1000;

	return { voltageValue };
}

export function parseEngineFuelRate(value: string) {
	const separateBytes = value.split(' ');
	const rateByteA = separateBytes[2];
	const rateByteB = separateBytes[3];
	const rateValue = unsignedIntFromBytes([rateByteA, rateByteB]) / 20;

	return { rateValue };
}

import { signedIntFromBytes, unsignedIntFromBytes } from './elm-parser.utils';

export function parseUdsInfoBuffer(buffer: string) {
	const joinedBuffer = buffer.replaceAll('\n', '').replaceAll('\r', '');

	const numberedPackets = Array.from(
		joinedBuffer.matchAll(/\d\:(\s[0-9A-F][0-9A-F]){6,7}/gm).map((match) => match[0])
	);

	const packets = numberedPackets.map((packet) => packet.split(':')[1].trim().split(' '));

	return packets;
}

export const sampleBmsInfo01 =
	'7F 22 12 \r7F 22 12 \r03E \r0: 62 01 01 FF F7 E7 \r7F 22 121: FF 88 35 93 3E 1C 83 \r2: 00 28 0E D4 05 04 043: 04 04 04 00 00 03 C14: 03 C1 36 00 00 92 005: 06 C0 E4 00 06 A2 CE6: 00 02 8E 5C 00 02 717: 1F 01 35 B3 3E 0D 018: 7C 00 00 00 00 03 E8>';

export function parseHkmcEvBmsInfo01(value: string) {
	const separatePacketBytes = parseUdsInfoBuffer(value);

	const socBms = unsignedIntFromBytes(separatePacketBytes[1][1]) / 2;
	const maxRegenerationPower = unsignedIntFromBytes(separatePacketBytes[1].slice(2, 4)) / 100;
	const maxPower = unsignedIntFromBytes(separatePacketBytes[1].slice(4, 6)) / 100;
	const batteryCurrent = signedIntFromBytes(separatePacketBytes[2].slice(0, 2)) / 10;
	const batteryVoltage = unsignedIntFromBytes(separatePacketBytes[2].slice(2, 4)) / 10;

	const batteryMaxTemp = signedIntFromBytes(separatePacketBytes[2][4]);
	const batteryMinTemp = signedIntFromBytes(separatePacketBytes[2][5]);
	const batteryTemp1 = signedIntFromBytes(separatePacketBytes[2][6]);
	const batteryTemp2 = signedIntFromBytes(separatePacketBytes[3][0]);
	const batteryTemp3 = signedIntFromBytes(separatePacketBytes[3][1]);
	const batteryTemp4 = signedIntFromBytes(separatePacketBytes[3][2]);

	const batteryInletTemp = signedIntFromBytes(separatePacketBytes[3][5]);
	const batteryMaxCellVoltage = unsignedIntFromBytes(separatePacketBytes[3][6]) / 50;
	const batteryMaxCellVoltageNo = unsignedIntFromBytes(separatePacketBytes[4][0]);
	const batteryMinCellVoltage = unsignedIntFromBytes(separatePacketBytes[4][1]) / 50;
	const batteryMinCellVoltageNo = unsignedIntFromBytes(separatePacketBytes[4][2]);

	const batteryFanMode = unsignedIntFromBytes(separatePacketBytes[4][3]);
	const batteryFanSpeed = unsignedIntFromBytes(separatePacketBytes[4][4]);

	const auxBatteryVoltage = unsignedIntFromBytes(separatePacketBytes[4][5]) / 10;

	const cumulativeCapacityCharged =
		unsignedIntFromBytes([separatePacketBytes[4][6], ...separatePacketBytes[5].slice(0, 3)]) / 100;

	const cumulativeCapacityDischarged =
		unsignedIntFromBytes(separatePacketBytes[5].slice(3, 7)) / 100;

	const cumulativeEnergyCharged = unsignedIntFromBytes(separatePacketBytes[6].slice(0, 4)) / 10;
	const cumulativeEnergyDischarged =
		unsignedIntFromBytes([...separatePacketBytes[6].slice(4, 7), separatePacketBytes[7][0]]) / 10;

	const averageCellVoltageWhileCharge = cumulativeEnergyCharged / cumulativeCapacityCharged;
	const averageCellVoltageWhileDischarge =
		cumulativeEnergyDischarged / cumulativeCapacityDischarged;

	const operationalTimeSeconds = unsignedIntFromBytes(separatePacketBytes[7].slice(1, 5));
	const operationalTimeHours = operationalTimeSeconds / 60;

	// DC Charging: 00001001
	const bmsIgnition = unsignedIntFromBytes(separatePacketBytes[7][5]);
	const bmsCapacitorVoltage = unsignedIntFromBytes([
		separatePacketBytes[7][6],
		separatePacketBytes[8][0]
	]);

	const motorRpm1 = signedIntFromBytes(separatePacketBytes[8].slice(1, 3));
	const motorRpm2 = signedIntFromBytes(separatePacketBytes[8].slice(3, 5));

	const surgeResistorKOhm = unsignedIntFromBytes(separatePacketBytes[8].slice(5, 7));

	const batteryPower = batteryCurrent * batteryVoltage;

	const isBatteryCharging = batteryPower < 0;

	return {
		socBms,
		maxRegenerationPower,
		maxPower,
		batteryCurrent,
		batteryVoltage,
		batteryPower,
		batteryMaxTemp,
		batteryMinTemp,
		batteryTemp1,
		batteryTemp2,
		batteryTemp3,
		batteryTemp4,
		batteryInletTemp,
		batteryMaxCellVoltage,
		batteryMaxCellVoltageNo,
		batteryMinCellVoltage,
		batteryMinCellVoltageNo,
		batteryFanMode,
		batteryFanSpeed,
		auxBatteryVoltage,
		cumulativeCapacityCharged,
		cumulativeCapacityDischarged,
		cumulativeEnergyCharged,
		cumulativeEnergyDischarged,
		averageCellVoltageWhileCharge,
		averageCellVoltageWhileDischarge,
		operationalTimeSeconds,
		operationalTimeHours,
		bmsIgnition,
		bmsCapacitorVoltage,
		motorRpm1,
		motorRpm2,
		surgeResistorKOhm,
		isBatteryCharging
	};
}

export const sampleParseHkmcEvBmsInfo02 = `7F 22 12 
7F 22 12 
7F 22 12 
027 
0: 62 01 02 FF FF FF 
1: FF C7 C7 C7 C7 C7 C7
2: C7 C7 C7 C7 C7 C7 C7
3: C7 C7 C7 C7 C7 C7 C7
4: C7 C7 C7 C7 C7 C7 C7
5: C7 C7 C7 C7 C7 AA AA
>`;

export function parseHkmcEvBmsInfo02(value: string) {
	const separatePacketBytes = parseUdsInfoBuffer(value);

	const cellVoltages = [];

	for (let rowIndex = 1; rowIndex <= 5; rowIndex++) {
		const minColumnIndex = rowIndex === 1 ? 1 : 0;
		const maxColumnIndex = rowIndex === 5 ? 4 : 6;

		for (let columnIndex = minColumnIndex; columnIndex <= maxColumnIndex; columnIndex++) {
			const cellVoltage = unsignedIntFromBytes(separatePacketBytes[rowIndex][columnIndex]) / 50;
			cellVoltages.push(cellVoltage);
		}
	}

	const [
		cellVoltage01,
		cellVoltage02,
		cellVoltage03,
		cellVoltage04,
		cellVoltage05,
		cellVoltage06,
		cellVoltage07,
		cellVoltage08,
		cellVoltage09,
		cellVoltage10,
		cellVoltage11,
		cellVoltage12,
		cellVoltage13,
		cellVoltage14,
		cellVoltage15,
		cellVoltage16,
		cellVoltage17,
		cellVoltage18,
		cellVoltage19,
		cellVoltage20,
		cellVoltage21,
		cellVoltage22,
		cellVoltage23,
		cellVoltage24,
		cellVoltage25,
		cellVoltage26,
		cellVoltage27,
		cellVoltage28,
		cellVoltage29,
		cellVoltage30,
		cellVoltage31,
		cellVoltage32
	] = cellVoltages;

	return {
		cellVoltage01,
		cellVoltage02,
		cellVoltage03,
		cellVoltage04,
		cellVoltage05,
		cellVoltage06,
		cellVoltage07,
		cellVoltage08,
		cellVoltage09,
		cellVoltage10,
		cellVoltage11,
		cellVoltage12,
		cellVoltage13,
		cellVoltage14,
		cellVoltage15,
		cellVoltage16,
		cellVoltage17,
		cellVoltage18,
		cellVoltage19,
		cellVoltage20,
		cellVoltage21,
		cellVoltage22,
		cellVoltage23,
		cellVoltage24,
		cellVoltage25,
		cellVoltage26,
		cellVoltage27,
		cellVoltage28,
		cellVoltage29,
		cellVoltage30,
		cellVoltage31,
		cellVoltage32
	};
}

export const sampleParseHkmcEvBmsInfo03 = `7F 22 12 
7F 22 12 
7F 22 12 
027 
0: 62 01 03 FF FF FF 
1: FF C7 C7 C7 C7 C7 C7
2: C7 C7 C7 C7 C7 C7 C7
3: C7 C7 C7 C7 C7 C7 C7
4: C7 C7 C7 C7 C7 C7 C7
5: C7 C7 C7 C7 C7 AA AA
>`;

export function parseHkmcEvBmsInfo03(value: string) {
	const separatePacketBytes = parseUdsInfoBuffer(value);

	const cellVoltages = [];

	for (let rowIndex = 1; rowIndex <= 5; rowIndex++) {
		const minColumnIndex = rowIndex === 1 ? 1 : 0;
		const maxColumnIndex = rowIndex === 5 ? 4 : 6;

		for (let columnIndex = minColumnIndex; columnIndex <= maxColumnIndex; columnIndex++) {
			const cellVoltage = unsignedIntFromBytes(separatePacketBytes[rowIndex][columnIndex]) / 50;
			cellVoltages.push(cellVoltage);
		}
	}

	const [
		cellVoltage33,
		cellVoltage34,
		cellVoltage35,
		cellVoltage36,
		cellVoltage37,
		cellVoltage38,
		cellVoltage39,
		cellVoltage40,
		cellVoltage41,
		cellVoltage42,
		cellVoltage43,
		cellVoltage44,
		cellVoltage45,
		cellVoltage46,
		cellVoltage47,
		cellVoltage48,
		cellVoltage49,
		cellVoltage50,
		cellVoltage51,
		cellVoltage52,
		cellVoltage53,
		cellVoltage54,
		cellVoltage55,
		cellVoltage56,
		cellVoltage57,
		cellVoltage58,
		cellVoltage59,
		cellVoltage60,
		cellVoltage61,
		cellVoltage62,
		cellVoltage63,
		cellVoltage64
	] = cellVoltages;

	return {
		cellVoltage33,
		cellVoltage34,
		cellVoltage35,
		cellVoltage36,
		cellVoltage37,
		cellVoltage38,
		cellVoltage39,
		cellVoltage40,
		cellVoltage41,
		cellVoltage42,
		cellVoltage43,
		cellVoltage44,
		cellVoltage45,
		cellVoltage46,
		cellVoltage47,
		cellVoltage48,
		cellVoltage49,
		cellVoltage50,
		cellVoltage51,
		cellVoltage52,
		cellVoltage53,
		cellVoltage54,
		cellVoltage55,
		cellVoltage56,
		cellVoltage57,
		cellVoltage58,
		cellVoltage59,
		cellVoltage60,
		cellVoltage61,
		cellVoltage62,
		cellVoltage63,
		cellVoltage64
	};
}

export const sampleParseHkmcEvBmsInfo04 = `7F 22 12 
7F 22 12 
7F 22 12 
027 
0: 62 01 04 FF FF FF
1: FF C7 C7 C7 C7 C7 C7
2: C7 C7 C7 C7 C7 C7 C7
3: C7 C7 C7 C7 C7 C7 C7
4: C7 C7 C7 C7 C7 C7 C7
5: C7 C7 C7 C7 C7 AA AA
>`;

export function parseHkmcEvBmsInfo04(value: string) {
	const separatePacketBytes = parseUdsInfoBuffer(value);

	const cellVoltages = [];

	for (let rowIndex = 1; rowIndex <= 5; rowIndex++) {
		const minColumnIndex = rowIndex === 1 ? 1 : 0;
		const maxColumnIndex = rowIndex === 5 ? 4 : 6;

		for (let columnIndex = minColumnIndex; columnIndex <= maxColumnIndex; columnIndex++) {
			const cellVoltage = unsignedIntFromBytes(separatePacketBytes[rowIndex][columnIndex]) / 50;
			cellVoltages.push(cellVoltage);
		}
	}

	const [
		cellVoltage65,
		cellVoltage66,
		cellVoltage67,
		cellVoltage68,
		cellVoltage69,
		cellVoltage70,
		cellVoltage71,
		cellVoltage72,
		cellVoltage73,
		cellVoltage74,
		cellVoltage75,
		cellVoltage76,
		cellVoltage77,
		cellVoltage78,
		cellVoltage79,
		cellVoltage80,
		cellVoltage81,
		cellVoltage82,
		cellVoltage83,
		cellVoltage84,
		cellVoltage85,
		cellVoltage86,
		cellVoltage87,
		cellVoltage88,
		cellVoltage89,
		cellVoltage90,
		cellVoltage91,
		cellVoltage92,
		cellVoltage93,
		cellVoltage94,
		cellVoltage95,
		cellVoltage96
	] = cellVoltages;

	return {
		cellVoltage65,
		cellVoltage66,
		cellVoltage67,
		cellVoltage68,
		cellVoltage69,
		cellVoltage70,
		cellVoltage71,
		cellVoltage72,
		cellVoltage73,
		cellVoltage74,
		cellVoltage75,
		cellVoltage76,
		cellVoltage77,
		cellVoltage78,
		cellVoltage79,
		cellVoltage80,
		cellVoltage81,
		cellVoltage82,
		cellVoltage83,
		cellVoltage84,
		cellVoltage85,
		cellVoltage86,
		cellVoltage87,
		cellVoltage88,
		cellVoltage89,
		cellVoltage90,
		cellVoltage91,
		cellVoltage92,
		cellVoltage93,
		cellVoltage94,
		cellVoltage95,
		cellVoltage96
	};
}

export const sampleBmsInfo05 =
	'7F 22 12 \r7F 22 12 \r02E \r0: 62 01 05 00 3F FF \r7F 22 12 \r1: 90 00 00 00 00 00 002: 00 00 00 00 00 00 35 \r3: A5 3E 1C 00 01 50 034: 00 03 E8 47 03 E8 365: 8C 00 00 C1 C1 00 006: 05 00 00 00 00 AA AA>';

export function parseHkmcEvBmsInfo05(value: string) {
	const separatePacketBytes = parseUdsInfoBuffer(value);

	const unknownTempA = signedIntFromBytes(separatePacketBytes[2][2]);
	const cellVoltageDifference = unsignedIntFromBytes(separatePacketBytes[3][3]) / 50;

	const airbagValue = unsignedIntFromBytes(separatePacketBytes[3][5]).toString(2);

	const heaterTemp = signedIntFromBytes(separatePacketBytes[3][6]);

	const soh = unsignedIntFromBytes(separatePacketBytes[4].slice(1, 3)) / 10;

	const maxDeterioratedCellNo = unsignedIntFromBytes(separatePacketBytes[4][3]);

	const minDeteriorationPercentage = unsignedIntFromBytes(separatePacketBytes[4][4]) / 10;

	const minDeterioratedCellNo = unsignedIntFromBytes(separatePacketBytes[4][3]);

	const socDisplay = unsignedIntFromBytes(separatePacketBytes[5][0]) / 2;

	const cellVoltage97 = unsignedIntFromBytes(separatePacketBytes[5][3]) / 50;
	const cellVoltage98 = unsignedIntFromBytes(separatePacketBytes[5][4]) / 50;

	const unknownTempB = signedIntFromBytes(separatePacketBytes[6][0]);

	return {
		unknownTempA,
		cellVoltageDifference,
		airbagValue,
		heaterTemp,
		soh,
		maxDeterioratedCellNo,
		minDeteriorationPercentage,
		minDeterioratedCellNo,
		socDisplay,
		cellVoltage97,
		cellVoltage98,
		unknownTempB
	};
}

export function parseHkmcEvBmsInfo06(value: string) {
	const separatePacketBytes = parseUdsInfoBuffer(value);

	const coolingWaterTemp = signedIntFromBytes(separatePacketBytes[1][1]);
	const unknownTempC = signedIntFromBytes(separatePacketBytes[1][3]);
	const bmsMode = unsignedIntFromBytes(separatePacketBytes[2][4]).toString(2);
	const unknownTempD = signedIntFromBytes(separatePacketBytes[3][3]);

	return {
		coolingWaterTemp,
		unknownTempC,
		bmsMode,
		unknownTempD
	};
}

export const sampleParseHkmcEvClusterInfo02 = `00F 
0: 62 B0 02 E0 00 00
1: 00 FF B5 01 48 D9 00
2: 00 00 00 00 00 00 00
>`;

export function parseHkmcEvClusterInfo02(value: string) {
	const separatePacketBytes = parseUdsInfoBuffer(value);

	const odometerKm = unsignedIntFromBytes(separatePacketBytes[1].slice(3, 6));

	return {
		odometerKm
	};
}

export const sampleHkmcEvAbsInfo01 = `02A 
0: 62 C1 01 5F D7 E7
1: D0 FF FF 68 FF 04 E7 
2: D4 68 68 68 67 FF 7F 
3: FF 00 30 F4 00 00 00 
4: FF FF 7F F5 08 0E 07 
5: F6 00 FF 00 FF 3F FF 
6: FF AA AA AA AA AA AA
>`;

export function parseHkmcEvAbsInfo01(value: string) {
	const separatePacketBytes = parseUdsInfoBuffer(value);

	const steeringWheelAngle =
		(unsignedIntFromBytes(separatePacketBytes[4].slice(2, 4)) - 2 ** 15) / 10;

	const brakePedalPositionRelative = unsignedIntFromBytes(separatePacketBytes[5][1]);

	const vehicleSpeedAbs = unsignedIntFromBytes(separatePacketBytes[1][3]);

	return {
		steeringWheelAngle,
		brakePedalPositionRelative,
		vehicleSpeedAbs
	};
}

export const sampleHkmcEvVmcuInfo01 = `018 
0: 61 01 FF F8 00 00
1: 09 21 5A FC 0A 89 05
2: 32 1D 00 00 99 72 34
3: 04 20 20 05 00 00 00
>`;

export function parseHkmcEvVmcuInfo01(value: string) {
	const separatePacketBytes = parseUdsInfoBuffer(value);

	const acceleratorPedalPositionRelative = unsignedIntFromBytes(separatePacketBytes[2][1]) / 2;

	return {
		acceleratorPedalPositionRelative
	};
}

export const sampleHkmcEcu7D4Info01 = `012 
0: 62 01 01 95 9A 05
1: 00 10 FF FF 00 2C 01 
2: B3 10 10 17 21 AA AA
>`;

export function parseHkmcEcu7D4Info01(value: string) {
	const separatePacketBytes = parseUdsInfoBuffer(value);

	const vehicleSpeed =
		unsignedIntFromBytes([separatePacketBytes[1][6], separatePacketBytes[2][0]]) / 10;

	const vehicleSpeedDisplay = unsignedIntFromBytes(separatePacketBytes[1][5]);

	return {
		vehicleSpeed,
		vehicleSpeedDisplay
	};
}

// TPMS
// AT SH 7A0
// First part IDs
// 22C002
// Seconds part (with temps and pressures)
// 22C00B

export const sampleHkmcEvTpmsInfo02 = `017 
0: 62 C0 0B FF FF 00
1: 00 AD 3E 01 00 AB 3E
2: 01 00 A2 3E 01 00 A6
3: 3D 01 00 AA AA AA AA
>`;

// Drive to display
export const sampleHkmcEvTpmsInfo02_01 = `017 
0: 62 C0 0B FF FF 00
1: 00 AB 3E 02 00 A9 3E
2: 02 00 A1 3E 02 00 A5
3: 3D 02 00 AA AA AA AA
>`;

// Real-time data
export const sampleHkmcEvTpmsInfo02_02 = `017 
0: 62 C0 0B FF FF 00
1: 00 AC 3E 01 00 A9 3E
2: 01 00 A1 3D 01 00 A4
3: 3C 01 00 AA AA AA AA
>`;

export const TPMS_LIVE_DATA_FLAG = {
	YES: 0x01,
	NO: 0x02
};

export function parseHkmcEvTpmsInfo02(value: string) {
	const separatePacketBytes = parseUdsInfoBuffer(value);

	const barToPsi = 14.5;

	const frontLeftTireLiveData = unsignedIntFromBytes(separatePacketBytes[1][3]);
	const frontLeftTirePressure = unsignedIntFromBytes(separatePacketBytes[1][1]) / 5 / barToPsi;
	const frontLeftTireTemperature = unsignedIntFromBytes(separatePacketBytes[1][2]) - 50;

	const frontRightTireLiveData = unsignedIntFromBytes(separatePacketBytes[2][0]);
	const frontRightTirePressure = unsignedIntFromBytes(separatePacketBytes[1][5]) / 5 / barToPsi;
	const frontRightTireTemperature = unsignedIntFromBytes(separatePacketBytes[1][6]) - 50;

	const rearRightTireLiveData = unsignedIntFromBytes(separatePacketBytes[2][4]);
	const rearRightTirePressure = unsignedIntFromBytes(separatePacketBytes[2][2]) / 5 / barToPsi;
	const rearRightTireTemperature = unsignedIntFromBytes(separatePacketBytes[2][3]) - 50;

	const rearLeftTireLiveData = unsignedIntFromBytes(separatePacketBytes[3][1]);
	const rearLeftTirePressure = unsignedIntFromBytes(separatePacketBytes[2][6]) / 5 / barToPsi;
	const rearLeftTireTemperature = unsignedIntFromBytes(separatePacketBytes[3][0]) - 50;

	return {
		frontLeftTireLiveData,
		frontLeftTirePressure,
		frontLeftTireTemperature,
		frontRightTireLiveData,
		frontRightTirePressure,
		frontRightTireTemperature,
		rearRightTireLiveData,
		rearRightTirePressure,
		rearRightTireTemperature,
		rearLeftTireLiveData,
		rearLeftTirePressure,
		rearLeftTireTemperature
	};
}

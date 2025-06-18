import { HKMC_GEARS } from '$lib/common/constants/vmcu.constants';
import { signedIntFromBytes, unsignedIntFromBytes } from './elm-parser.utils';

export const PARSING_ERROR_RESPONSE = { error: true } as const;

export function parseUdsInfoBuffer(buffer: string) {
	const joinedBuffer = buffer.replaceAll('\n', '').replaceAll('\r', '');

	const numberedPackets = Array.from(
		joinedBuffer.matchAll(/[0-9A-F]\:(\s[0-9A-F][0-9A-F]){6,7}/gm).map((match) => match[0])
	);

	const packets = numberedPackets.map((packet) => packet.split(':')[1].trim().split(' '));

	return packets;
}

export const sampleBmsInfo01 = `03E \r
	0: 62 01 01 FF F7 E7
	1: FF 68 42 68 42 68 03
	2: 00 1A 0E 26 1B 18 1A
	3: 19 18 1A 00 00 1C B8
	4: 07 B8 36 00 00 92 00
	5: 07 36 B0 00 07 19 1C
	6: 00 02 BA 2A 00 02 9B \r
	7: 78 01 46 59 12 0D 01
	8: 6A 00 00 00 00 03 E8>`;

export function parseHkmcEvBmsInfo01(value: string) {
	const separatePacketBytes = parseUdsInfoBuffer(value);

	const expectedResponseLines = 9;
	if (separatePacketBytes.length !== expectedResponseLines) {
		return PARSING_ERROR_RESPONSE;
	}

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

	const auxBatteryVoltageBms = unsignedIntFromBytes(separatePacketBytes[4][5]) / 10;

	const cumulativeCapacityCharged =
		unsignedIntFromBytes([separatePacketBytes[4][6], ...separatePacketBytes[5].slice(0, 3)]) / 10;

	const cumulativeCapacityDischarged =
		unsignedIntFromBytes(separatePacketBytes[5].slice(3, 7)) / 10;

	const cumulativeEnergyCharged = unsignedIntFromBytes(separatePacketBytes[6].slice(0, 4)) / 10;
	const cumulativeEnergyDischarged =
		unsignedIntFromBytes([...separatePacketBytes[6].slice(4, 7), separatePacketBytes[7][0]]) / 10;

	const averageBatteryVoltageWhileCharge =
		(cumulativeEnergyCharged / cumulativeCapacityCharged) * 1000;
	const averageBatteryVoltageWhileDischarge =
		(cumulativeEnergyDischarged / cumulativeCapacityDischarged) * 1000;

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
		auxBatteryVoltageBms,
		cumulativeCapacityCharged,
		cumulativeCapacityDischarged,
		cumulativeEnergyCharged,
		cumulativeEnergyDischarged,
		averageCellVoltageWhileCharge: averageBatteryVoltageWhileCharge,
		averageCellVoltageWhileDischarge: averageBatteryVoltageWhileDischarge,
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

console.log(parseHkmcEvBmsInfo01(sampleBmsInfo01));

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

	const expectedResponseLines = 6;
	if (separatePacketBytes.length !== expectedResponseLines) {
		return PARSING_ERROR_RESPONSE;
	}

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

	const expectedResponseLines = 6;
	if (separatePacketBytes.length !== expectedResponseLines) {
		return PARSING_ERROR_RESPONSE;
	}

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

	const expectedResponseLines = 6;
	if (separatePacketBytes.length !== expectedResponseLines) {
		return PARSING_ERROR_RESPONSE;
	}

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

	const expectedResponseLines = 7;
	if (separatePacketBytes.length !== expectedResponseLines) {
		return PARSING_ERROR_RESPONSE;
	}

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

	const expectedResponseLines = 6;
	if (separatePacketBytes.length !== expectedResponseLines) {
		return PARSING_ERROR_RESPONSE;
	}

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

	const expectedResponseLines = 3;
	if (separatePacketBytes.length !== expectedResponseLines) {
		return PARSING_ERROR_RESPONSE;
	}

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

	const expectedResponseLines = 7;
	if (separatePacketBytes.length !== expectedResponseLines) {
		return PARSING_ERROR_RESPONSE;
	}

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

	const expectedResponseLines = 4;
	if (separatePacketBytes.length !== expectedResponseLines) {
		return PARSING_ERROR_RESPONSE;
	}

	const acceleratorPedalPositionRelative = unsignedIntFromBytes(separatePacketBytes[2][1]) / 2;

	const gearByteValue = unsignedIntFromBytes(separatePacketBytes[1][1]);

	let gear;
	if (gearByteValue & (1 << 0)) {
		gear = HKMC_GEARS.PARKING;
	} else if (gearByteValue & (1 << 1)) {
		gear = HKMC_GEARS.REVERSE;
	} else if (gearByteValue & (1 << 2)) {
		gear = HKMC_GEARS.NEUTRAL;
	} else if (gearByteValue & (1 << 3)) {
		gear = HKMC_GEARS.DRIVE;
	}

	return {
		acceleratorPedalPositionRelative,
		gear
	};
}

export const sampleHkmcEvVmcuInfo02 = `027 
0: 61 02 F8 FF FC 00
1: 01 01 00 00 00 94 1F
2: BC 6E F0 39 D7 0B 02
3: 93 F1 38 20 80 46 1B
4: 22 5F 00 00 01 01 01
5: 00 00 01 07 04 00 00
>`;

export function parseHkmcEvVmcuInfo02(value: string) {
	const separatePacketBytes = parseUdsInfoBuffer(value);

	const expectedResponseLines = 6;
	if (separatePacketBytes.length !== expectedResponseLines) {
		return PARSING_ERROR_RESPONSE;
	}

	const auxBatteryVoltage =
		unsignedIntFromBytes(separatePacketBytes[3].slice(1, 3).reverse()) / 1000;
	let auxBatteryCurrent =
		(unsignedIntFromBytes(separatePacketBytes[3].slice(3, 5).reverse()) - Math.pow(2, 15)) / 100;
	auxBatteryCurrent = -1 * auxBatteryCurrent; // to be inline with high voltage battery current value

	const auxBatterySoc = unsignedIntFromBytes(separatePacketBytes[3][5]);

	const auxBatteryPower = auxBatteryCurrent * auxBatteryVoltage;
	const isAuxBatteryCharging = auxBatteryPower < 0;

	// Not valid
	const ewpSpeed = unsignedIntFromBytes(separatePacketBytes[1][2]);
	const ewpTargetSpeed = unsignedIntFromBytes(separatePacketBytes[1][3]);

	return {
		auxBatteryVoltage,
		auxBatteryCurrent,
		auxBatterySoc,
		auxBatteryPower,
		isAuxBatteryCharging,
		ewpSpeed,
		ewpTargetSpeed
	};
}

export const sampleHkmcEvVmcuVinInfo = `
0: 63 5A 80 20 20 20 20
1: 20 20 20 20 20 20 1E
2: 09 0D 14 4B 4E 41 43
3: 43 38 31 47 46 4D 35
4: 30 39 38 30 30 31 33
5: 36 36 30 31 2D 30 45
6: 32 39 30 20 20 20 20
7: 20 20 20 20 20 20 20
8: 1E 09 0D 14 44 45 56
9: 4C 44 43 35 30 45 44
A: 45 45 4A 35 4D 2D 4E
B: 52 30 2D 44 30 30 30
C: 44 45 35 38 30 38 31
D: 30 00 00 00 00 00 00
E: 00 00 00 00 00 00 00
`;

export function parseHkmcEvVmcuVinInfo(value: string) {
	const separatePacketBytes = parseUdsInfoBuffer(value);

	console.table(separatePacketBytes);

	const expectedResponseLines = 15;
	if (separatePacketBytes.length !== expectedResponseLines) {
		return PARSING_ERROR_RESPONSE;
	}

	const vinBytes = [
		...separatePacketBytes[2].slice(3, 7),
		...separatePacketBytes[3],
		...separatePacketBytes[4].slice(0, 6)
	];

	return {
		vin: vinBytes
			.map(unsignedIntFromBytes)
			.map((i) => String.fromCharCode(i))
			.join('')
	};
}

export const sampleHkmcEcu7D4Info01 = `012 
0: 62 01 01 95 9A 05
1: 00 10 FF FF 00 2C 01 
2: B3 10 10 17 21 AA AA
>`;

export function parseHkmcEcu7D4Info01(value: string) {
	const separatePacketBytes = parseUdsInfoBuffer(value);

	const expectedResponseLines = 3;
	if (separatePacketBytes.length !== expectedResponseLines) {
		return PARSING_ERROR_RESPONSE;
	}

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

	const expectedResponseLines = 4;
	if (separatePacketBytes.length !== expectedResponseLines) {
		return PARSING_ERROR_RESPONSE;
	}

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

export const sampleAirconInfo00 = `026 \r
0: 62 01 00 7E 50 27
1: C8 FF 81 86 62 04 10
2: 10 FF FF 10 FF 10 FF
3: FF FF FF FF FF 0F FF
4: FF 2F F4 68 75 00 FF
5: FF 01 FF FF 00 00 00>`;

export const invalidAirconInfo00 = `
026 \r0: 62 01 00 7E 50 273: FF FF FF FF FF 69 FF4: FF 22 EF 67 68 00 FF5: FF 01 FF FF 00 00 00>
`;

export function parseHkmcEvAirconInfo00(value: string) {
	const separatePacketBytes = parseUdsInfoBuffer(value);

	const expectedResponseLines = 6;
	if (separatePacketBytes.length !== expectedResponseLines) {
		return PARSING_ERROR_RESPONSE;
	}

	const interiorTemperature = unsignedIntFromBytes(separatePacketBytes[4][4]) / 2 - 40;
	const airVentTemperature = unsignedIntFromBytes(separatePacketBytes[4][3]) / 2 - 40;
	const ambientTemperature = unsignedIntFromBytes(separatePacketBytes[1][3]) / 2 - 40;
	const evaporatorTemperature = unsignedIntFromBytes(separatePacketBytes[1][4]) / 2 - 40;

	return {
		interiorTemperature,
		airVentTemperature,
		ambientTemperature,
		evaporatorTemperature
	};
}

export const sampleAirconInfo02 = `22 01 02
014 
0: 62 01 02 FF F8 00
1: 00 A5 63 01 01 00 01
2: 01 00 35 00 00 67 0F
>					
`;

export function parseHkmcEvAirconInfo02(value: string) {
	// Values does not look valid
	const separatePacketBytes = parseUdsInfoBuffer(value);

	const expectedResponseLines = 3;
	if (separatePacketBytes.length !== expectedResponseLines) {
		return PARSING_ERROR_RESPONSE;
	}

	const coolantTemperature01 = unsignedIntFromBytes(separatePacketBytes[1][1]) / 2 - 40;
	const coolantTemperature02 = unsignedIntFromBytes(separatePacketBytes[1][2]) / 2 - 40;
	const absoluteAirPressure = unsignedIntFromBytes(separatePacketBytes[2][2]) * 20;

	return {
		coolantTemperature01,
		coolantTemperature02,
		absoluteAirPressure
	};
}

export const sampleHkmcEvMcuInfo02 = `0: 3A 61 02 07 FF FF FF
1: 00 00 00 00 00 00 1D
2: 00 08 0B 0D 0D 02 00
3: 03 00 F6 13 CD AB C2
4: CD 5C 01 F7 35 8E 00
5: 63 DD 5E 27 1A EA C1
6: CD 00 00 60 34 00 00
7: 00 00 00 00 00 00 00
8: 00 00 00 00 00 00 00`;

export function parseHkmcEvMcuInfo02(value: string) {
	const separatePacketBytes = parseUdsInfoBuffer(value);

	const expectedResponseLines = 9;
	if (separatePacketBytes.length !== expectedResponseLines) {
		return PARSING_ERROR_RESPONSE;
	}

	const motorTemperature = signedIntFromBytes(separatePacketBytes[2][1]) * 2;
	const inverterTemperature = signedIntFromBytes(separatePacketBytes[2][2]) * 2;

	return {
		motorTemperature,
		inverterTemperature
	};
}

export const sampleHkmcEcBcmInfo0C = `00B 
0: 62 B0 0C 3F 00 00
1: 00 30 00 00 00 AA AA
>`;

export function parseHkmcEcBcmInfo0C(value: string) {
	const separatePacketBytes = parseUdsInfoBuffer(value);

	const expectedResponseLines = 2;
	if (separatePacketBytes.length !== expectedResponseLines) {
		return PARSING_ERROR_RESPONSE;
	}

	const heatedWheelByteValue = unsignedIntFromBytes(separatePacketBytes[1][1]);

	const heatedWheelIndicator = heatedWheelByteValue & (1 << 4) ? 1 : 0;

	return {
		heatedWheelIndicator
		// TODO: Seems like b6 - corresponds to heated seats
	};
}

export const sampleHkmcEcBcmInfo0E = `00B 
0: 62 B0 0E 08 00 00
1: 00 10 00 00 00 AA AA`;

export function parseHkmcEcBcmInfo0E(value: string) {
	const separatePacketBytes = parseUdsInfoBuffer(value);

	const expectedResponseLines = 2;
	if (separatePacketBytes.length !== expectedResponseLines) {
		return PARSING_ERROR_RESPONSE;
	}

	const charingLidByteValue = unsignedIntFromBytes(separatePacketBytes[1][1]);

	const charingLidOpen = charingLidByteValue & (1 << 4) ? 1 : 0;

	return {
		charingLidOpen
	};
}

export const sampleHkmcEvObcInfo01 = `03A 
0: 61 01 FF FE 57 FC
1: 00 00 00 00 00 00 00
2: 00 00 84 00 37 01 BD
3: 05 9C 41 00 00 00 00
4: 00 00 00 00 60 00 00
5: 00 00 01 F3 00 00 00
6: 00 00 00 84 00 00 00
7: 05 90 0C 0E 54 00 00
8: 00 00 00 00 00 00 00>
`;

export function parseHkmcEvObcInfo01(value: string) {
	const separatePacketBytes = parseUdsInfoBuffer(value);

	const expectedResponseLines = 9;
	if (separatePacketBytes.length !== expectedResponseLines) {
		return PARSING_ERROR_RESPONSE;
	}

	const obcTemperature = unsignedIntFromBytes(separatePacketBytes[6][3]) / 2 - 40;

	return { obcTemperature };
}

export const sampleHkmcEvObcInfo02 = `022 \r
0: 61 02 00 00 00 00 \r
1: 75 4D 79 2B 75 AC 79
2: 2C 6D A9 79 21 70 5E
3: 79 25 74 0E 79 14 71
4: A4 79 1C 74 85 79 0F>
`;

export function parseHkmcEvObcInfo02(value: string) {
	const separatePacketBytes = parseUdsInfoBuffer(value);

	const expectedResponseLines = 5;
	if (separatePacketBytes.length !== expectedResponseLines) {
		return PARSING_ERROR_RESPONSE;
	}

	return {};
}

export const sampleHkmcEvObcInfo03 = `031 \r
0: 61 03 FF FF FF C0 \r
1: 00 00 28 03 97 03 7E
2: 00 00 0D 19 01 00 22
3: 00 00 01 00 00 70 0F
4: 00 02 00 02 00 03 00
5: 02 00 02 00 02 01 23
6: 01 23 00 00 00 00 00
7: 00 00 00 00 00 00 00>`;

export function parseHkmcEvObcInfo03(value: string) {
	const separatePacketBytes = parseUdsInfoBuffer(value);

	const expectedResponseLines = 8;
	if (separatePacketBytes.length !== expectedResponseLines) {
		return PARSING_ERROR_RESPONSE;
	}

	const acChargingCurrent = unsignedIntFromBytes(separatePacketBytes[1].slice(0, 2)) / 100;

	return { acChargingCurrent };
}

export const validateResponseLines = (expectedResponseLines: number) => (value: string) => {
	const separatePacketBytes = parseUdsInfoBuffer(value);

	if (separatePacketBytes.length !== expectedResponseLines) {
		return PARSING_ERROR_RESPONSE;
	}

	return {};
};

export function defaultParser(value: string) {
	return {};
}

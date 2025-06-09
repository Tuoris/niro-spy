export const HKMC_HEADERS = {
	BMS: '7E4',
	CLUSTER: '7C6',
	ABS: '7D1',
	VMCU: '7E2',
	ECU_7D4: '7D4',
	TPMS: '7A0',
	AIRCON: '7B3',
	MCU: '7E3'
} as const;

export const HEADER_TO_ECU_NAME = Object.fromEntries(
	Object.entries(HKMC_HEADERS).map(([key, value]) => [value, key])
);

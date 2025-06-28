export const BMS_MODES = {
	LTR: 0x3,
	COOL: 0x4,
	OFF: 0x6,
	PTC: 0xe
} as const;

export const BMS_MODES_TO_DISPLAY = {
	[BMS_MODES.LTR]: 'LTR',
	[BMS_MODES.COOL]: 'COOL',
	[BMS_MODES.OFF]: 'OFF',
	[BMS_MODES.PTC]: 'PTC'
};

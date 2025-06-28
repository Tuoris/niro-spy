export const OBC_FIELD_NAMES = {
	AUX_BATTERY_VOLTAGE_OBC: 'auxBatteryVoltageObc',
	OBC_TEMPERATURE_A: 'obcTemperatureA',
	OBC_TEMPERATURE_B: 'obcTemperatureB',
	AC_VOLTAGE: 'acVoltage',
	DC_OUTPUT_VOLTAGE_OBC: 'dcOutputVoltageObc',
	DC_OUTPUT_CURRENT_OBC: 'dcOutputCurrentObc',
	BATTERY_VOLTAGE_OBC: 'batteryVoltageObc',
	NUMBER_OF_AC_CHARGING_SESSIONS: 'numberOfAcChargingSessions',
	NUMBER_OF_SUCCESSFUL_AC_CHARGING_SESSIONS: 'numberOfSuccessfulAcChargingSessions',
	AC_CHARGING_CURRENT: 'acChargingCurrent'
} as const;

export const OBC_PARAMS_CONFIG = [
	{
		name: 'Напруга 12 В батареї (OBC)',
		field: OBC_FIELD_NAMES.AUX_BATTERY_VOLTAGE_OBC,
		exampleValue: 14.78,
		range: [0, 100],
		unit: 'В',
		format: (value: number) => value.toFixed(2)
	},
	{
		name: 'Температура зарядного пристрою 1',
		field: OBC_FIELD_NAMES.OBC_TEMPERATURE_A,
		exampleValue: 78.0001,
		range: [-40, 87.5],
		unit: '°C',
		format: (value: number) => value.toFixed(1)
	},
	{
		name: 'Температура зарядного пристрою 2',
		field: OBC_FIELD_NAMES.OBC_TEMPERATURE_B,
		exampleValue: 78.0001,
		range: [-40, 87.5],
		unit: '°C',
		format: (value: number) => value.toFixed(1)
	},
	{
		name: 'Напруга змінного струму зарядного пристрою',
		field: OBC_FIELD_NAMES.AC_VOLTAGE,
		exampleValue: 230,
		range: [0, 255],
		unit: 'В',
		format: (value: number) => value.toFixed()
	},
	{
		name: 'Вихідна напруга зарядного пристрою',
		field: OBC_FIELD_NAMES.DC_OUTPUT_VOLTAGE_OBC,
		exampleValue: 372,
		range: [0, 400],
		unit: 'В',
		format: (value: number) => value.toFixed(2)
	},
	{
		name: 'Вихідний струм зарядного пристрою',
		field: OBC_FIELD_NAMES.DC_OUTPUT_CURRENT_OBC,
		exampleValue: 78.0001,
		range: [0, 300],
		unit: 'А',
		format: (value: number) => value.toFixed(2)
	},
	{
		name: 'Напруга батареї (OBC)',
		field: OBC_FIELD_NAMES.BATTERY_VOLTAGE_OBC,
		exampleValue: 372,
		range: [0, 400],
		unit: 'В',
		format: (value: number) => value.toFixed(1)
	},
	{
		name: '[TEST] Кількість зарядних сесій змінного струму',
		field: OBC_FIELD_NAMES.NUMBER_OF_AC_CHARGING_SESSIONS,
		exampleValue: 78.0001,
		range: [0, 100],
		unit: '',
		format: (value: number) => value.toFixed()
	},
	{
		name: '[TEST] Кількість успішних зарядних сесій змінного струму',
		field: OBC_FIELD_NAMES.NUMBER_OF_SUCCESSFUL_AC_CHARGING_SESSIONS,
		exampleValue: 78.0001,
		range: [0, 100],
		unit: '',
		format: (value: number) => value.toFixed()
	},
	{
		name: 'Споживаний струм зарядного пристрою',
		field: OBC_FIELD_NAMES.AC_CHARGING_CURRENT,
		exampleValue: 12,
		range: [0, 100],
		unit: 'А',
		format: (value: number) => value.toFixed(2)
	}
];

import { BMS_MODES_TO_DISPLAY } from './bms.constants';

export const BMS_FIELD_NAMES = {
	SOC_BMS: 'socBms',
	SOH: 'soh',
	BATTERY_POWER: 'batteryPower',
	IS_BATTERY_CHARGING: 'isBatteryCharging',
	MAX_POWER: 'maxPower',
	MAX_REGENERATION_POWER: 'maxRegenerationPower',
	CUMULATIVE_CAPACITY_CHARGED: 'cumulativeCapacityCharged',
	CUMULATIVE_CAPACITY_DISCHARGED: 'cumulativeCapacityDischarged',
	CUMULATIVE_ENERGY_CHARGED: 'cumulativeEnergyCharged',
	CUMULATIVE_ENERGY_DISCHARGED: 'cumulativeEnergyDischarged',
	AVERAGE_CONSUMPTION: 'averageConsumption',
	BATTERY_CURRENT: 'batteryCurrent',
	BATTERY_VOLTAGE: 'batteryVoltage',
	BATTERY_MAX_TEMP: 'batteryMaxTemp',
	BATTERY_MIN_TEMP: 'batteryMinTemp',
	BATTERY_TEMP_1: 'batteryTemp1',
	BATTERY_TEMP_2: 'batteryTemp2',
	BATTERY_TEMP_3: 'batteryTemp3',
	BATTERY_TEMP_4: 'batteryTemp4',
	BATTERY_INLET_TEMP: 'batteryInletTemp',
	BATTERY_MAX_CELL_VOLTAGE: 'batteryMaxCellVoltage',
	BATTERY_MAX_CELL_VOLTAGE_NO: 'batteryMaxCellVoltageNo',
	BATTERY_MIN_CELL_VOLTAGE: 'batteryMinCellVoltage',
	BATTERY_MIN_CELL_VOLTAGE_NO: 'batteryMinCellVoltageNo',
	BATTERY_FAN_MODE: 'batteryFanMode',
	BATTERY_FAN_SPEED: 'batteryFanSpeed',
	AUX_BATTERY_VOLTAGE_BMS: 'auxBatteryVoltageBms',

	OPERATIONAL_TIME_SECONDS: 'operationalTimeSeconds',
	OPERATIONAL_TIME_HOURS: 'operationalTimeHours',
	BMS_CAPACITOR_VOLTAGE: 'bmsCapacitorVoltage',
	BMS_IGNITION_FLAG: 'bmsIgnition',
	MOTOR_RPM1: 'motorRpm1',
	MOTOR_RPM2: 'motorRpm2',
	SURGE_RESISTOR_K_OHM: 'surgeResistorKOhm',

	UNKNOWN_TEMP_A: 'unknownTempA',
	CELL_VOLTAGE_DIFFERENCE: 'cellVoltageDifference',
	HEATER_TEMP: 'heaterTemp',
	MAX_DETERIORATED_CELL_NO: 'maxDeterioratedCellNo',
	MIN_DETERIORATION_PERCENTAGE: 'minDeteriorationPercentage',
	MIN_DETERIORATED_CELL_NO: 'minDeterioratedCellNo',
	SOC_DISPLAY: 'socDisplay',
	UNKNOWN_TEMP_B: 'unknownTempB',

	COOLING_WATER_TEMP: 'coolingWaterTemp',
	BMS_MODE: 'bmsMode'
} as const;

export const BMS_PARAMS_CONFIG = [
	{
		name: 'Рівень заряду (BMS)',
		field: BMS_FIELD_NAMES.SOC_BMS,
		exampleValue: 78.0001,
		range: [0, 100],
		unit: '%',
		format: (value: number) => value.toFixed(2)
	},
	{
		name: "Здоров'я батареї (SOH)",
		field: BMS_FIELD_NAMES.SOH,
		exampleValue: 100,
		range: [0, 100],
		unit: '%',
		format: (value: number) => value.toFixed(2)
	},
	{
		name: 'Миттєва потужність',
		field: BMS_FIELD_NAMES.BATTERY_POWER,
		exampleValue: 10510,
		range: [-140000, 170000],
		unit: 'Вт',
		format: (value: number) => value.toFixed()
	},
	{
		name: 'Заряджання батареї',
		field: BMS_FIELD_NAMES.IS_BATTERY_CHARGING,
		exampleValue: 1,
		range: [0, 1],
		unit: '',
		format: (value: number) => (value ? 'так' : 'ні')
	},
	{
		name: 'Струм батареї',
		field: BMS_FIELD_NAMES.BATTERY_CURRENT,
		exampleValue: 15.2,
		range: [-500, 500],
		unit: 'А',
		format: (value: number) => value.toFixed(1)
	},
	{
		name: 'Напруга батареї',
		field: BMS_FIELD_NAMES.BATTERY_VOLTAGE,
		exampleValue: 350.5,
		range: [220, 420],
		unit: 'В',
		format: (value: number) => value.toFixed(1)
	},

	{
		name: 'Максимальна температура батареї',
		field: BMS_FIELD_NAMES.BATTERY_MAX_TEMP,
		exampleValue: 24,
		range: [-128, 127],
		unit: '°C',
		format: (value: number) => value.toFixed()
	},
	{
		name: 'Мінімальна температура батареї',
		field: BMS_FIELD_NAMES.BATTERY_MIN_TEMP,
		exampleValue: 21,
		range: [-128, 127],
		unit: '°C',
		format: (value: number) => value.toFixed()
	},
	{
		name: 'Температура модуля батареї 1',
		field: BMS_FIELD_NAMES.BATTERY_TEMP_1,
		exampleValue: 22,
		range: [-128, 127],
		unit: '°C',
		format: (value: number) => value.toFixed()
	},
	{
		name: 'Температура модуля батареї 2',
		field: BMS_FIELD_NAMES.BATTERY_TEMP_2,
		exampleValue: 23,
		range: [-128, 127],
		unit: '°C',
		format: (value: number) => value.toFixed()
	},
	{
		name: 'Температура модуля батареї 3',
		field: BMS_FIELD_NAMES.BATTERY_TEMP_3,
		exampleValue: 24,
		range: [-128, 127],
		unit: '°C',
		format: (value: number) => value.toFixed()
	},
	{
		name: 'Температура модуля батареї 4',
		field: BMS_FIELD_NAMES.BATTERY_TEMP_4,
		exampleValue: 21,
		range: [-128, 127],
		unit: '°C',
		format: (value: number) => value.toFixed()
	},
	{
		name: 'Температура охолоджуючої рідини на вході батареї',
		field: BMS_FIELD_NAMES.BATTERY_INLET_TEMP,
		exampleValue: 25.5,
		range: [-20, 60],
		unit: '°C',
		format: (value: number) => value.toFixed(1)
	},
	{
		name: 'Максимальна напруга елемента батареї',
		field: BMS_FIELD_NAMES.BATTERY_MAX_CELL_VOLTAGE,
		exampleValue: 3.74,
		range: [2.2, 4.2],
		unit: 'В',
		format: (value: number) => value.toFixed(2)
	},
	{
		name: 'Номер елемента з максимальною напругою',
		field: BMS_FIELD_NAMES.BATTERY_MAX_CELL_VOLTAGE_NO,
		exampleValue: 10,
		range: [0, 95],
		unit: '',
		format: (value: number) => value.toFixed()
	},
	{
		name: 'Мінімальна напруга елемента батареї',
		field: BMS_FIELD_NAMES.BATTERY_MIN_CELL_VOLTAGE,
		exampleValue: 3.7,
		range: [2.2, 4.2],
		unit: 'В',
		format: (value: number) => value.toFixed(2)
	},
	{
		name: 'Номер елемента з мінімальною напругою',
		field: BMS_FIELD_NAMES.BATTERY_MIN_CELL_VOLTAGE_NO,
		exampleValue: 80,
		range: [0, 95],
		unit: '',
		format: (value: number) => value.toFixed()
	},
	{
		name: 'Режим вентилятора батареї',
		field: BMS_FIELD_NAMES.BATTERY_FAN_MODE,
		exampleValue: 1,
		range: [0, 3],
		unit: '',
		format: (value: number) => value.toFixed()
	},
	{
		name: 'Швидкість вентилятора батареї',
		field: BMS_FIELD_NAMES.BATTERY_FAN_SPEED,
		exampleValue: 0,
		range: [0, 255],
		unit: 'об/хв',
		format: (value: number) => value.toFixed()
	},
	{
		name: 'Напруга 12 В батареї (BMS)',
		field: BMS_FIELD_NAMES.AUX_BATTERY_VOLTAGE_BMS,
		exampleValue: 12.8,
		range: [9, 16],
		unit: 'В',
		format: (value: number) => value.toFixed(1)
	},
	{
		name: 'Максимальна потужність',
		field: BMS_FIELD_NAMES.MAX_POWER,
		exampleValue: 159,
		range: [0, 170],
		unit: 'кВт',
		format: (value: number) => value.toFixed(2)
	},
	{
		name: 'Максимальна потужність рекуперації',
		field: BMS_FIELD_NAMES.MAX_REGENERATION_POWER,
		exampleValue: 137.15,
		range: [0, 140],
		unit: 'кВт',
		format: (value: number) => value.toFixed(2)
	},

	{
		name: 'Час експлуатації',
		field: BMS_FIELD_NAMES.OPERATIONAL_TIME_SECONDS,
		exampleValue: 20000000,
		range: [0, 100000000],
		unit: 'с',
		format: (value: number) => value.toFixed()
	},
	{
		name: 'Час експлуатації (годин)',
		field: BMS_FIELD_NAMES.OPERATIONAL_TIME_HOURS,
		exampleValue: 5500,
		range: [0, 50000],
		unit: 'год',
		format: (value: number) => value.toFixed(2)
	},
	{
		name: 'Напруга конденсатора батареї',
		field: BMS_FIELD_NAMES.BMS_CAPACITOR_VOLTAGE,
		exampleValue: 380,
		range: [0, 430],
		unit: 'В',
		format: (value: number) => value.toFixed()
	},
	{
		name: 'Прапорці стану BMS',
		field: BMS_FIELD_NAMES.BMS_IGNITION_FLAG,
		exampleValue: 13,
		range: [0, 256],
		unit: '-',
		format: (value: number) => parseInt(`${value}`).toString(2).padStart(8, '0')
	},
	{
		name: 'Швидкість обертання мотора',
		field: BMS_FIELD_NAMES.MOTOR_RPM1,
		exampleValue: 4000,
		range: [0, 100],
		unit: 'об/хв',
		format: (value: number) => value.toFixed()
	},
	{
		name: 'Швидкість обертання мотора (сенсор 2)',
		field: BMS_FIELD_NAMES.MOTOR_RPM2,
		exampleValue: 4000,
		range: [0, 100],
		unit: 'об/хв',
		format: (value: number) => value.toFixed()
	},
	{
		name: 'Опір ізоляції',
		field: BMS_FIELD_NAMES.SURGE_RESISTOR_K_OHM,
		exampleValue: 1000,
		range: [0, 1500],
		unit: 'кОм',
		format: (value: number) => value.toFixed()
	},

	{
		name: 'Невідома температура A',
		field: BMS_FIELD_NAMES.UNKNOWN_TEMP_A,
		exampleValue: 1,
		range: [0, 100],
		unit: '°C',
		format: (value: number) => value.toFixed()
	},
	{
		name: 'Різниця напруг між елементами',
		field: BMS_FIELD_NAMES.CELL_VOLTAGE_DIFFERENCE,
		exampleValue: 0,
		range: [0, 4.2],
		unit: 'В',
		format: (value: number) => value.toFixed(2)
	},
	{
		name: 'Температура обігрівача батареї',
		field: BMS_FIELD_NAMES.HEATER_TEMP,
		exampleValue: 3,
		range: [-40, 100],
		unit: '°C',
		format: (value: number) => value.toFixed()
	},
	{
		name: 'Номер елемента з найбільшою деградацією',
		field: BMS_FIELD_NAMES.MAX_DETERIORATED_CELL_NO,
		exampleValue: 1,
		range: [0, 98],
		unit: '',
		format: (value: number) => value.toFixed()
	},
	{
		name: 'Найменша деградація елемента',
		field: BMS_FIELD_NAMES.MIN_DETERIORATION_PERCENTAGE,
		exampleValue: 1,
		range: [0, 100],
		unit: '%',
		format: (value: number) => value.toFixed(2)
	},
	{
		name: 'Номер елемента з найменшою деградацією',
		field: BMS_FIELD_NAMES.MIN_DETERIORATED_CELL_NO,
		exampleValue: 78,
		range: [0, 98],
		unit: '',
		format: (value: number) => value.toFixed()
	},
	{
		name: 'Рівень заряду для відображення',
		field: BMS_FIELD_NAMES.SOC_DISPLAY,
		exampleValue: 70,
		range: [0, 100],
		unit: '%',
		format: (value: number) => value.toFixed()
	},
	{
		name: 'Невідома температура B',
		field: BMS_FIELD_NAMES.UNKNOWN_TEMP_B,
		exampleValue: 5,
		range: [-40, 100],
		unit: '°C',
		format: (value: number) => value.toFixed()
	},
	{
		name: 'Температура охолоджуючої рідини 2',
		field: BMS_FIELD_NAMES.COOLING_WATER_TEMP,
		exampleValue: 25.5,
		range: [-20, 60],
		unit: '°C',
		format: (value: number) => value.toFixed(1)
	},
	{
		name: 'Режим BMS',
		field: BMS_FIELD_NAMES.BMS_MODE,
		exampleValue: 25.5,
		range: [1, 16],
		unit: '',
		format: (value: number) =>
			BMS_MODES_TO_DISPLAY[(value & 0xf) as keyof typeof BMS_MODES_TO_DISPLAY] ?? value.toFixed()
	}
] as const;

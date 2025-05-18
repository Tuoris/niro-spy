import type { ObjectValues } from '../types/common.types';

export const PARAM_FIELDS = {
	BATTERY_POWER: 'batteryPower',
	VEHICLE_SPEED: 'vehicleSpeed',
	SOC_BMS: 'socBms',
	SOH: 'soh',
	STEERING_WHEEL_ANGLE: 'steeringWheelAngle',
	MAX_POWER: 'maxPower',
	ODOMETER_KM: 'odometerKm',
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
	AUX_BATTERY_VOLTAGE: 'auxBatteryVoltage',
	VEHICLE_SPEED_ABS: 'vehicleSpeedAbs'
} as const;

export type FieldType = ObjectValues<typeof PARAM_FIELDS>;

export const PARAMS_CONFIG = [
	{
		name: 'Споживана потужність',
		field: PARAM_FIELDS.BATTERY_POWER,
		exampleValue: 10510,
		range: [-140000, 170000],
		unit: 'Вт',
		format: (value: number) => value.toFixed()
	},
	{
		name: 'Швидкість',
		field: PARAM_FIELDS.VEHICLE_SPEED,
		exampleValue: 45,
		range: [0, 255],
		unit: 'км/год',
		format: (value: number) => value.toFixed(1)
	},
	{
		name: 'Рівень заряду',
		field: PARAM_FIELDS.SOC_BMS,
		exampleValue: 78.0001,
		range: [0, 100],
		unit: '%',
		format: (value: number) => value.toFixed(2)
	},
	{
		name: "Здоров'я батареї (SOH)",
		field: PARAM_FIELDS.SOH,
		exampleValue: 100,
		range: [0, 100],
		unit: '%',
		format: (value: number) => value.toFixed(2)
	},
	{
		name: 'Струм батареї',
		field: PARAM_FIELDS.BATTERY_CURRENT,
		exampleValue: 15.2,
		range: [-500, 500],
		unit: 'А',
		format: (value: number) => value.toFixed(1)
	},
	{
		name: 'Напруга батареї',
		field: PARAM_FIELDS.BATTERY_VOLTAGE,
		exampleValue: 350.5,
		range: [220, 420],
		unit: 'В',
		format: (value: number) => value.toFixed(1)
	},
	{
		name: 'Максимальна температура батареї',
		field: PARAM_FIELDS.BATTERY_MAX_TEMP,
		exampleValue: 24,
		range: [-128, 127],
		unit: '°C',
		format: (value: number) => value.toFixed()
	},
	{
		name: 'Мінімальна температура батареї',
		field: PARAM_FIELDS.BATTERY_MIN_TEMP,
		exampleValue: 21,
		range: [-128, 127],
		unit: '°C',
		format: (value: number) => value.toFixed()
	},
	{
		name: 'Температура модуля батареї 1',
		field: PARAM_FIELDS.BATTERY_TEMP_1,
		exampleValue: 22,
		range: [-128, 127],
		unit: '°C',
		format: (value: number) => value.toFixed()
	},
	{
		name: 'Температура модуля батареї 2',
		field: PARAM_FIELDS.BATTERY_TEMP_2,
		exampleValue: 23,
		range: [-128, 127],
		unit: '°C',
		format: (value: number) => value.toFixed()
	},
	{
		name: 'Температура модуля батареї 3',
		field: PARAM_FIELDS.BATTERY_TEMP_3,
		exampleValue: 24,
		range: [-128, 127],
		unit: '°C',
		format: (value: number) => value.toFixed()
	},
	{
		name: 'Температура модуля батареї 4',
		field: PARAM_FIELDS.BATTERY_TEMP_4,
		exampleValue: 21,
		range: [-128, 127],
		unit: '°C',
		format: (value: number) => value.toFixed()
	},
	{
		name: 'Температура охолоджуючої рідини на вході батареї',
		field: PARAM_FIELDS.BATTERY_INLET_TEMP,
		exampleValue: 25.5,
		range: [-20, 60],
		unit: '°C',
		format: (value: number) => value.toFixed(1)
	},
	{
		name: 'Максимальна напруга елемента батареї',
		field: PARAM_FIELDS.BATTERY_MAX_CELL_VOLTAGE,
		exampleValue: 3.74,
		range: [2.2, 4.2],
		unit: 'В',
		format: (value: number) => value.toFixed(2)
	},
	{
		name: 'Номер елемента з максимальною напругою',
		field: PARAM_FIELDS.BATTERY_MAX_CELL_VOLTAGE_NO,
		exampleValue: 10,
		range: [0, 95],
		unit: '',
		format: (value: number) => value.toFixed()
	},
	{
		name: 'Мінімальна напруга елемента батареї',
		field: PARAM_FIELDS.BATTERY_MIN_CELL_VOLTAGE,
		exampleValue: 3.7,
		range: [2.2, 4.2],
		unit: 'В',
		format: (value: number) => value.toFixed(2)
	},
	{
		name: 'Номер елемента з мінімальною напругою',
		field: PARAM_FIELDS.BATTERY_MIN_CELL_VOLTAGE_NO,
		exampleValue: 80,
		range: [0, 95],
		unit: '',
		format: (value: number) => value.toFixed()
	},
	{
		name: 'Режим вентилятора батареї',
		field: PARAM_FIELDS.BATTERY_FAN_MODE,
		exampleValue: 1,
		range: [0, 3],
		unit: '',
		format: (value: number) => value.toFixed()
	},
	{
		name: 'Швидкість вентилятора батареї',
		field: PARAM_FIELDS.BATTERY_FAN_SPEED,
		exampleValue: 0,
		range: [0, 255],
		unit: 'об/хв',
		format: (value: number) => value.toFixed()
	},
	{
		name: 'Напруга допоміжної батареї',
		field: PARAM_FIELDS.AUX_BATTERY_VOLTAGE,
		exampleValue: 12.8,
		range: [9, 16],
		unit: 'В',
		format: (value: number) => value.toFixed(1)
	},
	{
		name: 'Кут повороту керма',
		field: PARAM_FIELDS.STEERING_WHEEL_ANGLE,
		exampleValue: 0,
		range: [-415, 415],
		unit: '°',
		format: (value: number) => value.toFixed()
	},
	{
		name: 'Максимальна потужність',
		field: PARAM_FIELDS.MAX_POWER,
		exampleValue: 140,
		range: [0, 170],
		unit: 'кВт',
		format: (value: number) => value.toFixed(2)
	},
	{
		name: 'Пробіг',
		field: PARAM_FIELDS.ODOMETER_KM,
		exampleValue: 50000,
		range: [0, Infinity],
		unit: 'км',
		format: (value: number) => value.toFixed()
	},
	{
		name: 'Сукупна заряджена ємність',
		field: PARAM_FIELDS.CUMULATIVE_CAPACITY_CHARGED,
		exampleValue: 9000,
		range: [0, Infinity],
		unit: 'А·год',
		format: (value: number) => value.toFixed()
	},
	{
		name: 'Сукупна розряджена ємність',
		field: PARAM_FIELDS.CUMULATIVE_CAPACITY_DISCHARGED,
		exampleValue: 9450,
		range: [0, Infinity],
		unit: 'А·год',
		format: (value: number) => value.toFixed()
	},
	{
		name: 'Сукупна заряджена енергія',
		field: PARAM_FIELDS.CUMULATIVE_ENERGY_CHARGED,
		exampleValue: 9000,
		range: [0, Infinity],
		unit: 'кВт·год',
		format: (value: number) => value.toFixed()
	},
	{
		name: 'Сукупна розряджена енергія',
		field: PARAM_FIELDS.CUMULATIVE_ENERGY_DISCHARGED,
		exampleValue: 9450,
		range: [0, Infinity],
		unit: 'кВт·год',
		format: (value: number) => value.toFixed()
	},
	{
		name: 'Швидкість (ABS)',
		field: PARAM_FIELDS.VEHICLE_SPEED_ABS,
		exampleValue: 45,
		range: [0, 255],
		unit: 'км/год',
		format: (value: number) => value.toFixed()
	},
	{
		name: 'Середня витрата (за весь пробіг)',
		field: PARAM_FIELDS.AVERAGE_CONSUMPTION,
		exampleValue: 18,
		range: [0, 40],
		unit: 'кВт·год/100км',
		format: (value: number) => value.toFixed()
	}
];

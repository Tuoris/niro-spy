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
	AVERAGE_CONSUMPTION: 'averageConsumption'
} as const;

export type FieldType = ObjectValues<typeof PARAM_FIELDS>;

export const PARAMS_CONFIG = [
	{
		name: 'Споживана потужність',
		field: PARAM_FIELDS.BATTERY_POWER,
		exampleValue: 10510,
		range: [-140000, 170000],
		unit: 'Вт',
		format: (value: number) => value.toFixed(2)
	},
	{
		name: 'Швидкість',
		field: PARAM_FIELDS.VEHICLE_SPEED,
		exampleValue: 45,
		range: [0, 255],
		unit: 'км/год',
		format: (value: number) => value.toFixed()
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
		name: "Здоров'я акумулятора (SOH)",
		field: PARAM_FIELDS.SOH,
		exampleValue: 100,
		range: [0, 100],
		unit: '%',
		format: (value: number) => value.toFixed(2)
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
		name: 'Середня витрата (за весь пробіг)',
		field: PARAM_FIELDS.AVERAGE_CONSUMPTION,
		exampleValue: 18,
		range: [0, 40],
		unit: 'кВт·год/100км',
		format: (value: number) => value.toFixed()
	}
];

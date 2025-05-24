import type { ObjectValues } from '../types/common.types';
import { AIRCON_FIELD_NAMES, AIRCON_PARAMS_CONFIG } from './aircon.constants';
import { BMS_FIELD_NAMES, BMS_PARAMS_CONFIG } from './bms-params.constants';
import { CELL_VOLTAGE_NAMES, CELL_VOLTAGE_PARAMS_CONFIG } from './cell-voltage.constants';
import { TPMS_FIELD_NAMES, TPMS_PARAMS_CONFIG } from './tpms.constant';

export const PARAM_FIELDS = {
	...BMS_FIELD_NAMES,
	STEERING_WHEEL_ANGLE: 'steeringWheelAngle',
	VEHICLE_SPEED_ABS: 'vehicleSpeedAbs',
	VEHICLE_SPEED: 'vehicleSpeed',
	ODOMETER_KM: 'odometerKm',
	BRAKE_PEDAL_POSITION_RELATIVE: 'brakePedalPositionRelative',
	ACCELERATOR_PEDAL_POSITION_RELATIVE: 'acceleratorPedalPositionRelative',
	...CELL_VOLTAGE_NAMES,
	...TPMS_FIELD_NAMES,
	...AIRCON_FIELD_NAMES
} as const;

export type FieldType = ObjectValues<typeof PARAM_FIELDS>;

export const PARAMS_CONFIG = [
	...BMS_PARAMS_CONFIG,
	{
		name: 'Кут повороту керма',
		field: PARAM_FIELDS.STEERING_WHEEL_ANGLE,
		exampleValue: 0,
		range: [-415, 415],
		unit: '°',
		format: (value: number) => value.toFixed()
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
		name: 'Швидкість',
		field: PARAM_FIELDS.VEHICLE_SPEED,
		exampleValue: 45,
		range: [0, 255],
		unit: 'км/год',
		format: (value: number) => value.toFixed(1)
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
		name: 'Педаль гальм',
		field: PARAM_FIELDS.BRAKE_PEDAL_POSITION_RELATIVE,
		exampleValue: 45,
		range: [0, 100],
		unit: '%',
		format: (value: number) => value.toFixed()
	},
	{
		name: 'Педаль акселератора',
		field: PARAM_FIELDS.ACCELERATOR_PEDAL_POSITION_RELATIVE,
		exampleValue: 10,
		range: [0, 100],
		unit: '%',
		format: (value: number) => value.toFixed()
	},
	{
		name: 'Середня витрата (за весь пробіг)',
		field: PARAM_FIELDS.AVERAGE_CONSUMPTION,
		exampleValue: 18,
		range: [0, 40],
		unit: 'кВт·год/100км',
		format: (value: number) => value.toFixed()
	},
	...TPMS_PARAMS_CONFIG,
	...AIRCON_PARAMS_CONFIG,
	...CELL_VOLTAGE_PARAMS_CONFIG
];

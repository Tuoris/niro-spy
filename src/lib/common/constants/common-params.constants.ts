import type { ReactiveI18Next } from '$lib/i18n/i18n';
import type { ObjectValues } from '../types/common.types';
import { AIRCON_FIELD_NAMES, AIRCON_PARAMS_CONFIG } from './aircon.constants';
import { BMS_FIELD_NAMES, BMS_PARAMS_CONFIG } from './bms-params.constants';
import { CELL_VOLTAGE_NAMES, CELL_VOLTAGE_PARAMS_CONFIG } from './cell-voltage.constants';
import { OBC_FIELD_NAMES, OBC_PARAMS_CONFIG } from './obc.constants';
import { TPMS_FIELD_NAMES, TPMS_PARAMS_CONFIG } from './tpms.constant';
import { UNIT_LABELS } from './unit-labels.constants';
import { HKMC_GEARS_TO_DISPLAY } from './vmcu.constants';

export const PARAM_FIELDS = {
	...BMS_FIELD_NAMES,
	STEERING_WHEEL_ANGLE: 'steeringWheelAngle',
	VEHICLE_SPEED_ABS: 'vehicleSpeedAbs',
	VEHICLE_SPEED: 'vehicleSpeed',
	ODOMETER_KM: 'odometerKm',
	BRAKE_PEDAL_POSITION_RELATIVE: 'brakePedalPositionRelative',
	ACCELERATOR_PEDAL_POSITION_RELATIVE: 'acceleratorPedalPositionRelative',
	GEAR: 'gear',
	AUX_BATTERY_VOLTAGE: 'auxBatteryVoltage',
	AUX_BATTERY_CURRENT: 'auxBatteryCurrent',
	AUX_BATTERY_SOC: 'auxBatterySoc',
	AUX_BATTERY_POWER: 'auxBatteryPower',
	IS_AUX_BATTERY_CHARGING: 'isAuxBatteryCharging',
	// EWP_SPEED: 'ewpSpeed',
	// EWP_TARGET_SPEED: 'ewpTargetSpeed',
	MOTOR_TEMPERATURE: 'motorTemperature',
	INVERTER_TEMPERATURE: 'inverterTemperature',
	...CELL_VOLTAGE_NAMES,
	...TPMS_FIELD_NAMES,
	...AIRCON_FIELD_NAMES,
	...OBC_FIELD_NAMES,
	ALTITUDE_GPS: 'altitudeGps',
	SPEED_GPS: 'speedGps'
} as const;

export type FieldType = ObjectValues<typeof PARAM_FIELDS>;

export const PARAMS_CONFIG = [
	...BMS_PARAMS_CONFIG,
	{
		name: 'steeringWheelAngle',
		field: PARAM_FIELDS.STEERING_WHEEL_ANGLE,
		exampleValue: 0,
		range: [-415, 415],
		unit: UNIT_LABELS.DEGREE,
		format: (value: number) => value.toFixed()
	},
	{
		name: 'odometerKm',
		field: PARAM_FIELDS.ODOMETER_KM,
		exampleValue: 50000,
		range: [0, Infinity],
		unit: UNIT_LABELS.KILOMETER,
		format: (value: number) => value.toFixed()
	},
	{
		name: 'cumulativeCapacityCharged',
		field: PARAM_FIELDS.CUMULATIVE_CAPACITY_CHARGED,
		exampleValue: 9000,
		range: [0, Infinity],
		unit: UNIT_LABELS.AMPERE_HOUR,
		format: (value: number) => value.toFixed(1)
	},
	{
		name: 'cumulativeCapacityDischarged',
		field: PARAM_FIELDS.CUMULATIVE_CAPACITY_DISCHARGED,
		exampleValue: 9450,
		range: [0, Infinity],
		unit: UNIT_LABELS.AMPERE_HOUR,
		format: (value: number) => value.toFixed(1)
	},
	{
		name: 'cumulativeEnergyCharged',
		field: PARAM_FIELDS.CUMULATIVE_ENERGY_CHARGED,
		exampleValue: 9000,
		range: [0, Infinity],
		unit: UNIT_LABELS.KILOWATT_HOUR,
		format: (value: number) => value.toFixed(1)
	},
	{
		name: 'cumulativeEnergyDischarged',
		field: PARAM_FIELDS.CUMULATIVE_ENERGY_DISCHARGED,
		exampleValue: 9450,
		range: [0, Infinity],
		unit: UNIT_LABELS.KILOWATT_HOUR,
		format: (value: number) => value.toFixed(1)
	},
	{
		name: 'vehicleSpeed',
		field: PARAM_FIELDS.VEHICLE_SPEED,
		exampleValue: 45,
		range: [0, 255],
		unit: UNIT_LABELS.KILOMETERS_PER_HOUR,
		format: (value: number) => value.toFixed(1)
	},
	{
		name: 'vehicleSpeedAbs',
		field: PARAM_FIELDS.VEHICLE_SPEED_ABS,
		exampleValue: 45,
		range: [0, 255],
		unit: UNIT_LABELS.KILOMETERS_PER_HOUR,
		format: (value: number) => value.toFixed()
	},
	{
		name: 'brakePedalPositionRelative',
		field: PARAM_FIELDS.BRAKE_PEDAL_POSITION_RELATIVE,
		exampleValue: 45,
		range: [0, 100],
		unit: UNIT_LABELS.PERCENT,
		format: (value: number) => value.toFixed()
	},
	{
		name: 'acceleratorPedalPositionRelative',
		field: PARAM_FIELDS.ACCELERATOR_PEDAL_POSITION_RELATIVE,
		exampleValue: 10,
		range: [0, 100],
		unit: UNIT_LABELS.PERCENT,
		format: (value: number) => value.toFixed()
	},
	{
		name: 'gear',
		field: PARAM_FIELDS.GEAR,
		exampleValue: 1,
		range: [1, 4],
		unit: '',
		format: (value: number) =>
			HKMC_GEARS_TO_DISPLAY[value as keyof typeof HKMC_GEARS_TO_DISPLAY] ?? ''
	},
	{
		name: 'auxBatteryVoltage',
		field: PARAM_FIELDS.AUX_BATTERY_VOLTAGE,
		exampleValue: 14.775,
		range: [0, 100],
		unit: UNIT_LABELS.VOLT,
		format: (value: number) => value.toFixed(3)
	},
	{
		name: 'auxBatteryCurrent',
		field: PARAM_FIELDS.AUX_BATTERY_CURRENT,
		exampleValue: 10,
		range: [-163.84, 163.84],
		unit: UNIT_LABELS.AMPERE,
		format: (value: number) => value.toFixed(3)
	},
	{
		name: 'auxBatterySoc',
		field: PARAM_FIELDS.AUX_BATTERY_SOC,
		exampleValue: 70,
		range: [0, 100],
		unit: UNIT_LABELS.PERCENT,
		format: (value: number) => value.toFixed()
	},
	{
		name: 'auxBatteryPower',
		field: PARAM_FIELDS.AUX_BATTERY_POWER,
		exampleValue: 24,
		range: [-2000, 2000],
		unit: UNIT_LABELS.WATT,
		format: (value: number) => value.toFixed(2)
	},
	{
		name: 'isAuxBatteryCharging',
		field: PARAM_FIELDS.IS_AUX_BATTERY_CHARGING,
		exampleValue: 1,
		range: [0, 1],
		unit: '',
		format: (value: number, i18n: ReactiveI18Next) => (value ? i18n.t('yes') : i18n.t('no'))
	},
	{
		name: 'motorTemperature',
		field: PARAM_FIELDS.MOTOR_TEMPERATURE,
		exampleValue: 22,
		range: [-256, 256],
		unit: UNIT_LABELS.CELSIUS,
		format: (value: number) => value.toFixed()
	},
	{
		name: 'inverterTemperature',
		field: PARAM_FIELDS.INVERTER_TEMPERATURE,
		exampleValue: 22,
		range: [-256, 256],
		unit: UNIT_LABELS.CELSIUS,
		format: (value: number) => value.toFixed()
	},
	{
		name: 'averageConsumption',
		field: PARAM_FIELDS.AVERAGE_CONSUMPTION,
		exampleValue: 18,
		range: [0, 40],
		unit: UNIT_LABELS.KILOWATT_HOUR_PER_100_KILOMETERS,
		format: (value: number) => value.toFixed()
	},
	...TPMS_PARAMS_CONFIG,
	...AIRCON_PARAMS_CONFIG,
	...OBC_PARAMS_CONFIG,
	...CELL_VOLTAGE_PARAMS_CONFIG,
	{
		name: 'speedGps',
		field: PARAM_FIELDS.SPEED_GPS,
		exampleValue: 45,
		range: [0, 255],
		unit: UNIT_LABELS.KILOMETERS_PER_HOUR,
		format: (value: number) => value.toFixed(1)
	},
	{
		name: 'altitudeGps',
		field: PARAM_FIELDS.ALTITUDE_GPS,
		exampleValue: 500,
		range: [0, 8000],
		unit: UNIT_LABELS.METER,
		format: (value: number) => value.toFixed(1)
	}
] as const;

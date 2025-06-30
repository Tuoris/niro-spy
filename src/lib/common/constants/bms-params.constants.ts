import type { ReactiveI18Next } from '$lib/i18n/i18n';
import { BMS_MODES_TO_DISPLAY } from './bms.constants';
import { UNIT_LABELS } from './unit-labels.constants';

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
	AVERAGE_LIFETIME_CONSUMPTION: 'averageLifetimeConsumption',
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
		name: 'socBms',
		field: BMS_FIELD_NAMES.SOC_BMS,
		exampleValue: 78.0001,
		range: [0, 100],
		unit: UNIT_LABELS.PERCENT,
		format: (value: number) => value.toFixed(2)
	},
	{
		name: 'soh',
		field: BMS_FIELD_NAMES.SOH,
		exampleValue: 100,
		range: [0, 100],
		unit: UNIT_LABELS.PERCENT,
		format: (value: number) => value.toFixed(2)
	},
	{
		name: 'batteryPower',
		field: BMS_FIELD_NAMES.BATTERY_POWER,
		exampleValue: 10510,
		range: [-140000, 170000],
		unit: UNIT_LABELS.WATT,
		format: (value: number) => value.toFixed()
	},
	{
		name: 'isBatteryCharging',
		field: BMS_FIELD_NAMES.IS_BATTERY_CHARGING,
		exampleValue: 1,
		range: [0, 1],
		unit: '',
		format: (value: number, i18n: ReactiveI18Next) => (value ? i18n.t('yes') : i18n.t('no'))
	},
	{
		name: 'batteryCurrent',
		field: BMS_FIELD_NAMES.BATTERY_CURRENT,
		exampleValue: 15.2,
		range: [-500, 500],
		unit: UNIT_LABELS.AMPERE,
		format: (value: number) => value.toFixed(1)
	},
	{
		name: 'batteryVoltage',
		field: BMS_FIELD_NAMES.BATTERY_VOLTAGE,
		exampleValue: 350.5,
		range: [220, 420],
		unit: UNIT_LABELS.VOLT,
		format: (value: number) => value.toFixed(1)
	},

	{
		name: 'batteryMaxTemp',
		field: BMS_FIELD_NAMES.BATTERY_MAX_TEMP,
		exampleValue: 24,
		range: [-128, 127],
		unit: UNIT_LABELS.CELSIUS,
		format: (value: number) => value.toFixed()
	},
	{
		name: 'batteryMinTemp',
		field: BMS_FIELD_NAMES.BATTERY_MIN_TEMP,
		exampleValue: 21,
		range: [-128, 127],
		unit: UNIT_LABELS.CELSIUS,
		format: (value: number) => value.toFixed()
	},
	{
		name: 'batteryTemp_1',
		field: BMS_FIELD_NAMES.BATTERY_TEMP_1,
		exampleValue: 22,
		range: [-128, 127],
		unit: UNIT_LABELS.CELSIUS,
		format: (value: number) => value.toFixed()
	},
	{
		name: 'batteryTemp_2',
		field: BMS_FIELD_NAMES.BATTERY_TEMP_2,
		exampleValue: 23,
		range: [-128, 127],
		unit: UNIT_LABELS.CELSIUS,
		format: (value: number) => value.toFixed()
	},
	{
		name: 'batteryTemp_3',
		field: BMS_FIELD_NAMES.BATTERY_TEMP_3,
		exampleValue: 24,
		range: [-128, 127],
		unit: UNIT_LABELS.CELSIUS,
		format: (value: number) => value.toFixed()
	},
	{
		name: 'batteryTemp_4',
		field: BMS_FIELD_NAMES.BATTERY_TEMP_4,
		exampleValue: 21,
		range: [-128, 127],
		unit: UNIT_LABELS.CELSIUS,
		format: (value: number) => value.toFixed()
	},
	{
		name: 'batteryInletTemp',
		field: BMS_FIELD_NAMES.BATTERY_INLET_TEMP,
		exampleValue: 25.5,
		range: [-20, 60],
		unit: UNIT_LABELS.CELSIUS,
		format: (value: number) => value.toFixed(1)
	},
	{
		name: 'batteryMaxCellVoltage',
		field: BMS_FIELD_NAMES.BATTERY_MAX_CELL_VOLTAGE,
		exampleValue: 3.74,
		range: [2.2, 4.2],
		unit: UNIT_LABELS.VOLT,
		format: (value: number) => value.toFixed(2)
	},
	{
		name: 'batteryMaxCellVoltageNo',
		field: BMS_FIELD_NAMES.BATTERY_MAX_CELL_VOLTAGE_NO,
		exampleValue: 10,
		range: [0, 95],
		unit: '',
		format: (value: number) => value.toFixed()
	},
	{
		name: 'batteryMinCellVoltage',
		field: BMS_FIELD_NAMES.BATTERY_MIN_CELL_VOLTAGE,
		exampleValue: 3.7,
		range: [2.2, 4.2],
		unit: UNIT_LABELS.VOLT,
		format: (value: number) => value.toFixed(2)
	},
	{
		name: 'batteryMinCellVoltageNo',
		field: BMS_FIELD_NAMES.BATTERY_MIN_CELL_VOLTAGE_NO,
		exampleValue: 80,
		range: [0, 95],
		unit: '',
		format: (value: number) => value.toFixed()
	},
	{
		name: 'batteryFanMode',
		field: BMS_FIELD_NAMES.BATTERY_FAN_MODE,
		exampleValue: 1,
		range: [0, 3],
		unit: '',
		format: (value: number) => value.toFixed()
	},
	{
		name: 'batteryFanSpeed',
		field: BMS_FIELD_NAMES.BATTERY_FAN_SPEED,
		exampleValue: 0,
		range: [0, 255],
		unit: UNIT_LABELS.RPM,
		format: (value: number) => value.toFixed()
	},
	{
		name: 'auxBatteryVoltageBms',
		field: BMS_FIELD_NAMES.AUX_BATTERY_VOLTAGE_BMS,
		exampleValue: 12.8,
		range: [9, 16],
		unit: UNIT_LABELS.VOLT,
		format: (value: number) => value.toFixed(1)
	},
	{
		name: 'maxPower',
		field: BMS_FIELD_NAMES.MAX_POWER,
		exampleValue: 159,
		range: [0, 170],
		unit: UNIT_LABELS.KILOWATT,
		format: (value: number) => value.toFixed(2)
	},
	{
		name: 'maxRegenerationPower',
		field: BMS_FIELD_NAMES.MAX_REGENERATION_POWER,
		exampleValue: 137.15,
		range: [0, 140],
		unit: UNIT_LABELS.KILOWATT,
		format: (value: number) => value.toFixed(2)
	},

	{
		name: 'operationalTimeSeconds',
		field: BMS_FIELD_NAMES.OPERATIONAL_TIME_SECONDS,
		exampleValue: 20000000,
		range: [0, 100000000],
		unit: UNIT_LABELS.SECOND,
		format: (value: number) => value.toFixed()
	},
	{
		name: 'operationalTimeHours',
		field: BMS_FIELD_NAMES.OPERATIONAL_TIME_HOURS,
		exampleValue: 5500,
		range: [0, 50000],
		unit: UNIT_LABELS.HOUR,
		format: (value: number) => value.toFixed(2)
	},
	{
		name: 'bmsCapacitorVoltage',
		field: BMS_FIELD_NAMES.BMS_CAPACITOR_VOLTAGE,
		exampleValue: 380,
		range: [0, 430],
		unit: UNIT_LABELS.VOLT,
		format: (value: number) => value.toFixed()
	},
	{
		name: 'bmsIgnitionFlag',
		field: BMS_FIELD_NAMES.BMS_IGNITION_FLAG,
		exampleValue: 13,
		range: [0, 256],
		unit: '',
		format: (value: number) => parseInt(`${value}`).toString(2).padStart(8, '0')
	},
	{
		name: 'motorRpm1',
		field: BMS_FIELD_NAMES.MOTOR_RPM1,
		exampleValue: 4000,
		range: [0, 100],
		unit: UNIT_LABELS.RPM,
		format: (value: number) => value.toFixed()
	},
	{
		name: 'motorRpm2',
		field: BMS_FIELD_NAMES.MOTOR_RPM2,
		exampleValue: 4000,
		range: [0, 100],
		unit: UNIT_LABELS.RPM,
		format: (value: number) => value.toFixed()
	},
	{
		name: 'surgeResistorKOhm',
		field: BMS_FIELD_NAMES.SURGE_RESISTOR_K_OHM,
		exampleValue: 1000,
		range: [0, 1500],
		unit: UNIT_LABELS.KILOOHM,
		format: (value: number) => value.toFixed()
	},

	{
		name: 'unknownTempA',
		field: BMS_FIELD_NAMES.UNKNOWN_TEMP_A,
		exampleValue: 1,
		range: [0, 100],
		unit: UNIT_LABELS.CELSIUS,
		format: (value: number) => value.toFixed()
	},
	{
		name: 'cellVoltageDifference',
		field: BMS_FIELD_NAMES.CELL_VOLTAGE_DIFFERENCE,
		exampleValue: 0,
		range: [0, 4.2],
		unit: UNIT_LABELS.VOLT,
		format: (value: number) => value.toFixed(2)
	},
	{
		name: 'heaterTemp',
		field: BMS_FIELD_NAMES.HEATER_TEMP,
		exampleValue: 3,
		range: [-40, 100],
		unit: UNIT_LABELS.CELSIUS,
		format: (value: number) => value.toFixed()
	},
	{
		name: 'maxDeterioratedCellNo',
		field: BMS_FIELD_NAMES.MAX_DETERIORATED_CELL_NO,
		exampleValue: 1,
		range: [0, 98],
		unit: '',
		format: (value: number) => value.toFixed()
	},
	{
		name: 'minDeteriorationPercentage',
		field: BMS_FIELD_NAMES.MIN_DETERIORATION_PERCENTAGE,
		exampleValue: 1,
		range: [0, 100],
		unit: UNIT_LABELS.PERCENT,
		format: (value: number) => value.toFixed(2)
	},
	{
		name: 'minDeterioratedCellNo',
		field: BMS_FIELD_NAMES.MIN_DETERIORATED_CELL_NO,
		exampleValue: 78,
		range: [0, 98],
		unit: '',
		format: (value: number) => value.toFixed()
	},
	{
		name: 'socDisplay',
		field: BMS_FIELD_NAMES.SOC_DISPLAY,
		exampleValue: 70,
		range: [0, 100],
		unit: UNIT_LABELS.PERCENT,
		format: (value: number) => value.toFixed()
	},
	{
		name: 'unknownTempB',
		field: BMS_FIELD_NAMES.UNKNOWN_TEMP_B,
		exampleValue: 5,
		range: [-40, 100],
		unit: UNIT_LABELS.CELSIUS,
		format: (value: number) => value.toFixed()
	},
	{
		name: 'coolingWaterTemp',
		field: BMS_FIELD_NAMES.COOLING_WATER_TEMP,
		exampleValue: 25.5,
		range: [-20, 60],
		unit: UNIT_LABELS.CELSIUS,
		format: (value: number) => value.toFixed(1)
	},
	{
		name: 'bmsMode',
		field: BMS_FIELD_NAMES.BMS_MODE,
		exampleValue: 25.5,
		range: [1, 16],
		unit: '',
		format: (value: number) =>
			BMS_MODES_TO_DISPLAY[(value & 0xf) as keyof typeof BMS_MODES_TO_DISPLAY] ?? value.toFixed()
	}
] as const;

import { TPMS_LIVE_DATA_FLAG } from '$lib/elm-device/parsers/hkmc.parsers';
import type { ReactiveI18Next } from '$lib/i18n/i18n';
import { UNIT_LABELS } from './unit-labels.constants';

export const TPMS_FIELD_NAMES = {
	FRONT_LEFT_TIRE_LIVE_DATA: 'frontLeftTireLiveData',
	FRONT_LEFT_TIRE_PRESSURE: 'frontLeftTirePressure',
	FRONT_LEFT_TIRE_TEMPERATURE: 'frontLeftTireTemperature',
	FRONT_RIGHT_TIRE_LIVE_DATA: 'frontRightTireLiveData',
	FRONT_RIGHT_TIRE_PRESSURE: 'frontRightTirePressure',
	FRONT_RIGHT_TIRE_TEMPERATURE: 'frontRightTireTemperature',
	REAR_RIGHT_TIRE_LIVE_DATA: 'rearRightTireLiveData',
	REAR_RIGHT_TIRE_PRESSURE: 'rearRightTirePressure',
	REAR_RIGHT_TIRE_TEMPERATURE: 'rearRightTireTemperature',
	REAR_LEFT_TIRE_LIVE_DATA: 'rearLeftTireLiveData',
	REAR_LEFT_TIRE_PRESSURE: 'rearLeftTirePressure',
	REAR_LEFT_TIRE_TEMPERATURE: 'rearLeftTireTemperature'
} as const;

const formatTpmsLiveDataFlag = (value: number, i18n: ReactiveI18Next) =>
	value == TPMS_LIVE_DATA_FLAG.YES
		? i18n.t('yes')
		: value === TPMS_LIVE_DATA_FLAG.NO
			? i18n.t('no')
			: '-';

export const TPMS_PARAMS_CONFIG = [
	{
		name: 'frontLeftTirePressure',
		field: TPMS_FIELD_NAMES.FRONT_LEFT_TIRE_PRESSURE,
		exampleValue: 2.31,
		range: [0, 10],
		unit: UNIT_LABELS.BAR,
		format: (value: number) => value.toFixed(2)
	},
	{
		name: 'frontRightTirePressure',
		field: TPMS_FIELD_NAMES.FRONT_RIGHT_TIRE_PRESSURE,
		exampleValue: 2.23,
		range: [0, 10],
		unit: UNIT_LABELS.BAR,
		format: (value: number) => value.toFixed(2)
	},
	{
		name: 'rearRightTirePressure',
		field: TPMS_FIELD_NAMES.REAR_RIGHT_TIRE_PRESSURE,
		exampleValue: 2.23,
		range: [0, 10],
		unit: UNIT_LABELS.BAR,
		format: (value: number) => value.toFixed(2)
	},
	{
		name: 'rearLeftTirePressure',
		field: TPMS_FIELD_NAMES.REAR_LEFT_TIRE_PRESSURE,
		exampleValue: 2.23,
		range: [0, 10],
		unit: UNIT_LABELS.BAR,
		format: (value: number) => value.toFixed(2)
	},
	{
		name: 'frontLeftTireTemperature',
		field: TPMS_FIELD_NAMES.FRONT_LEFT_TIRE_TEMPERATURE,
		exampleValue: 11,
		range: [-50, 78],
		unit: UNIT_LABELS.CELSIUS,
		format: (value: number) => value.toFixed()
	},
	{
		name: 'frontRightTireTemperature',
		field: TPMS_FIELD_NAMES.FRONT_RIGHT_TIRE_TEMPERATURE,
		exampleValue: 11,
		range: [-50, 78],
		unit: UNIT_LABELS.CELSIUS,
		format: (value: number) => value.toFixed()
	},
	{
		name: 'rearRightTireTemperature',
		field: TPMS_FIELD_NAMES.REAR_RIGHT_TIRE_TEMPERATURE,
		exampleValue: 11,
		range: [-50, 78],
		unit: UNIT_LABELS.CELSIUS,
		format: (value: number) => value.toFixed()
	},
	{
		name: 'rearLeftTireTemperature',
		field: TPMS_FIELD_NAMES.REAR_LEFT_TIRE_TEMPERATURE,
		exampleValue: 11,
		range: [-50, 78],
		unit: UNIT_LABELS.CELSIUS,
		format: (value: number) => value.toFixed()
	},
	{
		name: 'frontLeftTireLiveData',
		field: TPMS_FIELD_NAMES.FRONT_LEFT_TIRE_LIVE_DATA,
		exampleValue: 1,
		range: [0, 2],
		unit: '',
		format: formatTpmsLiveDataFlag
	},
	{
		name: 'frontRightTireLiveData',
		field: TPMS_FIELD_NAMES.FRONT_RIGHT_TIRE_LIVE_DATA,
		exampleValue: 1,
		range: [0, 2],
		unit: '',
		format: formatTpmsLiveDataFlag
	},
	{
		name: 'rearRightTireLiveData',
		field: TPMS_FIELD_NAMES.REAR_RIGHT_TIRE_LIVE_DATA,
		exampleValue: 1,
		range: [0, 2],
		unit: '',
		format: formatTpmsLiveDataFlag
	},
	{
		name: 'rearLeftTireLiveData',
		field: TPMS_FIELD_NAMES.REAR_LEFT_TIRE_LIVE_DATA,
		exampleValue: 1,
		range: [0, 2],
		unit: '',
		format: formatTpmsLiveDataFlag
	}
] as const;

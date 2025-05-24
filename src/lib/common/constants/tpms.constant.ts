import { TPMS_LIVE_DATA_FLAG } from '$lib/elm-device/parsers/hkmc.parsers';

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

export const TPMS_PARAMS_CONFIG = [
	{
		name: 'Тиск у передній лівій шині',
		field: TPMS_FIELD_NAMES.FRONT_LEFT_TIRE_PRESSURE,
		exampleValue: 2.31,
		range: [0, 10],
		unit: 'бар',
		format: (value: number) => value.toFixed(2)
	},
	{
		name: 'Тиск у передній правій шині',
		field: TPMS_FIELD_NAMES.FRONT_RIGHT_TIRE_PRESSURE,
		exampleValue: 2.23,
		range: [0, 10],
		unit: 'бар',
		format: (value: number) => value.toFixed(2)
	},
	{
		name: 'Тиск у задній правій шині',
		field: TPMS_FIELD_NAMES.REAR_RIGHT_TIRE_PRESSURE,
		exampleValue: 2.23,
		range: [0, 10],
		unit: 'бар',
		format: (value: number) => value.toFixed(2)
	},
	{
		name: 'Тиск у задній лівій шині',
		field: TPMS_FIELD_NAMES.REAR_LEFT_TIRE_PRESSURE,
		exampleValue: 2.23,
		range: [0, 10],
		unit: 'бар',
		format: (value: number) => value.toFixed(2)
	},
	{
		name: 'Температура передньої лівої шини',
		field: TPMS_FIELD_NAMES.FRONT_LEFT_TIRE_TEMPERATURE,
		exampleValue: 11,
		range: [-50, 78],
		unit: '°C',
		format: (value: number) => value.toFixed()
	},
	{
		name: 'Температура передньої правої шини',
		field: TPMS_FIELD_NAMES.FRONT_RIGHT_TIRE_TEMPERATURE,
		exampleValue: 11,
		range: [-50, 78],
		unit: '°C',
		format: (value: number) => value.toFixed()
	},
	{
		name: 'Температура задньої правої шини',
		field: TPMS_FIELD_NAMES.REAR_RIGHT_TIRE_TEMPERATURE,
		exampleValue: 11,
		range: [-50, 78],
		unit: '°C',
		format: (value: number) => value.toFixed()
	},
	{
		name: 'Температура задньої лівої шини',
		field: TPMS_FIELD_NAMES.REAR_LEFT_TIRE_TEMPERATURE,
		exampleValue: 11,
		range: [-50, 78],
		unit: '°C',
		format: (value: number) => value.toFixed()
	},
	{
		name: 'Читання даних сенсора у передній лівій шині',
		field: TPMS_FIELD_NAMES.FRONT_LEFT_TIRE_LIVE_DATA,
		exampleValue: 1,
		range: [0, 2],
		unit: '',
		format: (value: number) =>
			value == TPMS_LIVE_DATA_FLAG.YES ? 'так' : value === TPMS_LIVE_DATA_FLAG.NO ? 'ні' : '-'
	},
	{
		name: 'Читання даних сенсора у передній правій шині',
		field: TPMS_FIELD_NAMES.FRONT_RIGHT_TIRE_LIVE_DATA,
		exampleValue: 1,
		range: [0, 2],
		unit: '',
		format: (value: number) =>
			value == TPMS_LIVE_DATA_FLAG.YES ? 'так' : value === TPMS_LIVE_DATA_FLAG.NO ? 'ні' : '-'
	},
	{
		name: 'Читання даних сенсора у задній правій шині',
		field: TPMS_FIELD_NAMES.REAR_RIGHT_TIRE_LIVE_DATA,
		exampleValue: 1,
		range: [0, 2],
		unit: '',
		format: (value: number) =>
			value == TPMS_LIVE_DATA_FLAG.YES ? 'так' : value === TPMS_LIVE_DATA_FLAG.NO ? 'ні' : '-'
	},
	{
		name: 'Читання даних сенсора у задній лівій шині',
		field: TPMS_FIELD_NAMES.REAR_LEFT_TIRE_LIVE_DATA,
		exampleValue: 1,
		range: [0, 2],
		unit: '',
		format: (value: number) =>
			value == TPMS_LIVE_DATA_FLAG.YES ? 'так' : value === TPMS_LIVE_DATA_FLAG.NO ? 'ні' : '-'
	}
] as const;

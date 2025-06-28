import { UNIT_LABELS } from './unit-labels.constants';

export const AIRCON_FIELD_NAMES = {
	INTERIOR_TEMPERATURE: 'interiorTemperature',
	AIR_VENT_TEMPERATURE: 'airVentTemperature',
	AMBIENT_TEMPERATURE: 'ambientTemperature',
	EVAPORATOR_TEMPERATURE: 'evaporatorTemperature'
} as const;

export const AIRCON_PARAMS_CONFIG = [
	{
		name: 'interiorTemperature',
		field: AIRCON_FIELD_NAMES.INTERIOR_TEMPERATURE,
		exampleValue: 22,
		range: [-40, 87.5],
		unit: UNIT_LABELS.CELSIUS,
		format: (value: number) => value.toFixed(1)
	},
	{
		name: 'airVentTemperature',
		field: AIRCON_FIELD_NAMES.AIR_VENT_TEMPERATURE,
		exampleValue: 22,
		range: [-40, 87.5],
		unit: UNIT_LABELS.CELSIUS,
		format: (value: number) => value.toFixed(1)
	},
	{
		name: 'ambientTemperature',
		field: AIRCON_FIELD_NAMES.AMBIENT_TEMPERATURE,
		exampleValue: 19,
		range: [-40, 87.5],
		unit: UNIT_LABELS.CELSIUS,
		format: (value: number) => value.toFixed(1)
	},
	{
		name: 'evaporatorTemperature',
		field: AIRCON_FIELD_NAMES.EVAPORATOR_TEMPERATURE,
		exampleValue: 5.5,
		range: [-40, 87.5],
		unit: UNIT_LABELS.CELSIUS,
		format: (value: number) => value.toFixed(1)
	}
] as const;

export const AIRCON_FIELD_NAMES = {
	INTERIOR_TEMPERATURE: 'interiorTemperature',
	AIR_VENT_TEMPERATURE: 'airVentTemperature',
	AMBIENT_TEMPERATURE: 'ambientTemperature',
	EVAPORATOR_TEMPERATURE: 'evaporatorTemperature'
} as const;

export const AIRCON_PARAMS_CONFIG = [
	{
		name: 'Температура салону',
		field: AIRCON_FIELD_NAMES.INTERIOR_TEMPERATURE,
		exampleValue: 22,
		range: [-40, 87.5],
		unit: '°C',
		format: (value: number) => value.toFixed(1)
	},
	{
		name: 'Температура потоку повітря з дефлектора',
		field: AIRCON_FIELD_NAMES.AIR_VENT_TEMPERATURE,
		exampleValue: 22,
		range: [-40, 87.5],
		unit: '°C',
		format: (value: number) => value.toFixed(1)
	},
	{
		name: 'Температура навколишнього середовища',
		field: AIRCON_FIELD_NAMES.AMBIENT_TEMPERATURE,
		exampleValue: 19,
		range: [-40, 87.5],
		unit: '°C',
		format: (value: number) => value.toFixed(1)
	},
	{
		name: 'Температура випарника кондиціонера',
		field: AIRCON_FIELD_NAMES.EVAPORATOR_TEMPERATURE,
		exampleValue: 5.5,
		range: [-40, 87.5],
		unit: '°C',
		format: (value: number) => value.toFixed(1)
	}
] as const;

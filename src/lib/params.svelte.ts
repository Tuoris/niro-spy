import { PARAM_FIELDS, type FieldType } from './common/constants/common-params.constants';

export type ParamValue = {
	timestamp: number;
	value: number;
};

const INITIAL_PARAM_VALUES_ENTRIES = Object.entries(PARAM_FIELDS).map(([_, param]) => [param, []]);
export const INITIAL_PARAM_VALUES = Object.fromEntries(INITIAL_PARAM_VALUES_ENTRIES);

export const paramsState = $state<{
	values: Record<FieldType, ParamValue[]>;
	selectedParams: FieldType[];
	recording: boolean;
}>({
	values: INITIAL_PARAM_VALUES,
	selectedParams: [],
	recording: false
});

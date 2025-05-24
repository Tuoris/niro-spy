import { PARAM_FIELDS, type FieldType } from './common/constants/common-params.constants';

type ParamValue = {
	timestamp: number;
	value: number;
};

const INITIAL_PARAM_VALUES = Object.entries(PARAM_FIELDS).map(([_, param]) => [param, []]);

export const paramsState = $state<{
	values: Record<FieldType, ParamValue[]>;
	selectedParams: FieldType[];
}>({
	values: Object.fromEntries(INITIAL_PARAM_VALUES),
	selectedParams: []
});

import type { CommandResponseValue } from '$lib/common/types/common.types';

export type Command = {
	payload: string;
	header?: string;
	responseParser: (buffer: string) => CommandResponseValue;
};

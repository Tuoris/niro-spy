import type { CommandResponseValue } from '$lib/common/types/common.types';

export type Command = {
	payload: string;
	header?: string;
	waitAfterCommand?: number;
	responseParser: (buffer: string) => CommandResponseValue;
};
export type ElmResponseLoggerArgs = (command: Command, response: string) => void;

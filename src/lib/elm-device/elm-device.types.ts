import type { CommandResponseValue } from '$lib/common/types/common.types';
import type { I18NLabel } from '$lib/i18n/i18n';

export type Command = {
	i18Label: I18NLabel;
	payload: string;
	header?: string;
	responseParser: (buffer: string) => CommandResponseValue;
};

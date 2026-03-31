import type { I18NLabel } from '$lib/i18n/i18n';

export type CommandResponseValue = {
	[key: string]: string | number | boolean | undefined | null;
};
export type ObjectValues<T> = T[keyof T];

export type BluetoothError = {
	message: I18NLabel;
	params?: any;
} | null;

export type CommandResponseValue = {
	[key: string]: string | number | boolean | undefined | null;
};
export type ObjectValues<T> = T[keyof T];

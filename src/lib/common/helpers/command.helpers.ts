export const getCommandDebugKey = ({ payload, header }: { payload: string; header?: string }) => {
	const key = header ? `${header} : ${payload}` : payload;

	return key;
};

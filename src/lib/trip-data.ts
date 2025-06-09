import { downloadJsonFile } from './utils/file.utils';

export function downloadTripDataFile(jsonObject: any) {
	const now = new Date();
	const filename = `niro_spy_${now.toISOString().replaceAll(':', '_').replace('Z', '')}.json`;

	downloadJsonFile(jsonObject, filename);
}

export function downloadJsonFile(jsonObject: any, filename: string) {
	const text = JSON.stringify(jsonObject, null, 4);

	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', filename);

	element.style.display = 'none';
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
}

export function downloadTripDataFile(jsonObject: any) {
	const now = new Date();
	const filename = `niro_spy_${now.toISOString().replaceAll(':', '_').replace('Z', '')}.json`;

	downloadJsonFile(jsonObject, filename);
}

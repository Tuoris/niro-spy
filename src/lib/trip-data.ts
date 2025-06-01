export function downloadJsonFile(jsonObject: any) {
	const text = JSON.stringify(jsonObject, null, 4);
	const now = new Date();
	const filename = `elm_js_scanner_${now.toISOString().replaceAll(':', '_').replace('Z', '')}.json`;
	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', filename);

	element.style.display = 'none';
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
}

export function unsignedIntFromBytes(byteOrBytes: string | string[]) {
	const bytesCombined = Array.isArray(byteOrBytes) ? byteOrBytes.join('') : byteOrBytes;

	const integerValue = parseInt(bytesCombined, 16);

	return integerValue;
}

export function signedIntFromBytes(byteOrBytes: string | string[]) {
	const unsignedIntegerValue = unsignedIntFromBytes(byteOrBytes);

	const numberOfBytes = Array.isArray(byteOrBytes) ? byteOrBytes.length : 1;

	const numberOfValuesPerBytes = 2 ** (8 * numberOfBytes);

	return unsignedIntegerValue < numberOfValuesPerBytes / 2
		? unsignedIntegerValue
		: unsignedIntegerValue - numberOfValuesPerBytes;
}

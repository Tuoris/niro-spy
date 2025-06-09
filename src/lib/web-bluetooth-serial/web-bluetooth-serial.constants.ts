export const CONFIGS = [
	{
		name: 'Viecar or Blue ELM 327 cline',
		serviceUuid: '0000fff0-0000-1000-8000-00805f9b34fb',
		characteristicUuid: '0000fff1-0000-1000-8000-00805f9b34fb',
		writeCharacteristicUuid: '0000fff2-0000-1000-8000-00805f9b34fb'
	},
	{
		name: 'vgate-icar2-bluetooth-4-0',
		serviceUuid: 'e7810a71-73ae-499d-8c15-faa9aef0c3f2',
		characteristicUuid: 'bef8d6c9-9c21-4c9e-b632-bd58c1009f9f'
	}
];

export const EMPTY_DATA_VIEW = new DataView(new ArrayBuffer(0));

export function vinParse(vin: string) {
	let manufacturer = '';

	if (vin[0] == '5' && vin[1] == 'X') {
		manufacturer = 'Hyundai/Kia, США';
	} else if (vin[0] == 'K' && vin[1] == 'M' && vin[2] == 'H') {
		manufacturer = 'Hyundai, Південна Корея';
	} else if (vin[0] == 'T' && vin[1] == 'M' && vin[2] == 'A') {
		manufacturer = 'Hyundai, Чехія';
	} else if (vin[0] == '2' && vin[1] == 'H' && vin[2] == 'M') {
		manufacturer = 'Hyundai, Канада';
	} else if (vin[0] == '5' && vin[1] == 'N' && vin[2] == 'M') {
		manufacturer = 'Hyundai, США';
	} else if (vin[0] == '5' && vin[1] == 'N' && vin[2] == 'P') {
		manufacturer = 'Hyundai, США';
	} else if (vin[0] == '9' && vin[1] == 'B' && vin[2] == 'H') {
		manufacturer = 'Hyundai, Бразилія';
	} else if (vin[0] == '9' && vin[1] == '5' && vin[2] == 'P') {
		manufacturer = 'Бразилія CAOA/Hyundai';
	} else if (vin[0] == 'L' && vin[1] == 'B' && vin[2] == 'E') {
		manufacturer = 'Hyundai, Китай (Пекін)';
	} else if (vin[0] == 'K' && vin[1] == 'N') {
		manufacturer = 'Kia, Південна Корея';

		if (vin[2] == 'D') {
			manufacturer += ' (для ринку США, Канади та Мексики)';
		} else if (vin[2] == 'A') {
			manufacturer += ' (для ринку Європи, Азії та Південної Америки)';
		}
	} else if (vin[0] == 'M' && vin[1] == 'S' && vin[2] == '0') {
		manufacturer = "Kia, М'янма";
	} else if (vin[0] == 'P' && vin[1] == 'N' && vin[2] == 'A') {
		manufacturer = 'Kia, Малайзія';
	} else if (vin[0] == 'U' && vin[1] == '5' && vin[2] == 'Y') {
		manufacturer = 'Kia, Словаччина';
	} else if (vin[0] == '3' && vin[1] == 'K' && vin[2] == 'P') {
		manufacturer = 'Kia, Мексика';
	} else if (vin[0] == '9' && vin[1] == 'U' && vin[2] == 'W') {
		manufacturer = 'Kia, Уругвай';
	} else if (vin[0] == 'L' && vin[1] == 'J' && vin[2] == 'D') {
		manufacturer = 'Kia, Китай (Jiangsu Yueda)';
	} else {
		// manufacturer = 'Невідомо';
	}

	let model = '';
	if (vin[3] == 'J') {
		model = 'Soul';
	} else if (vin[3] == 'C') {
		model = 'Niro';
	} else if (vin[3] == 'K') {
		model = 'Kona';
	} else {
		// model = 'Невідома';
	}

	const a: Record<string, number> = {
		A: 2010,
		B: 2011,
		C: 2012,
		D: 2013,
		E: 2014,
		F: 2015,
		G: 2016,
		H: 2017,
		J: 2018,
		K: 2019,
		L: 2020,
		M: 2021,
		N: 2022,
		P: 2023,
		R: 2024,
		S: 2025,
		T: 2026,
		V: 2027,
		W: 2028,
		X: 2029,
		Y: 2030
	};

	const year = a[vin[9] as string];

	let type = '';

	if (vin[7] == 'E') {
		type = '39 кВт·год / 80 кВт';
	} else if (vin[7] == 'G') {
		type = '64 кВт·год / 150 кВт';
	} else if (vin[7] == 'H') {
		type = '39 кВт·год / 100 кВт';
	}

	let productionPlant = '';
	if (vin[10] == '5') {
		productionPlant = 'Хвасон / 화성 (Корея)';
		// } else if (vin[10] == '6') {
		// 	productionPlant = 'Soha-ri / 소하리 (Корея)';
	} else if (vin[10] == '7') {
		productionPlant = 'Кванджу / 광주 (Корея)';
	} else if (vin[10] == 'T') {
		productionPlant = 'Сосан / 서산시 (Корея)';
	} else if (vin[10] == 'Y') {
		productionPlant = "Янгон / ရန်ကုန်မြို့ (М'янма)";
	} else if (vin[10] == 'U') {
		productionPlant = 'Ульсан / 울산 (Корея)';
	}

	let sequenceNumber = vin.slice(11, 17);
	return {
		manufacturer,
		model,
		year,
		type,
		productionPlant,
		sequenceNumber
	} as const;
}

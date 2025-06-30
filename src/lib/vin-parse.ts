const MANUFACTURER_LABELS = {
	HYUNDAI_KIA_USA: 'hyundaiKiaUsa',
	HYUNDAI_SOUTH_KOREA: 'hyundaiSouthKorea',
	HYUNDAI_CZECH_REPUBLIC: 'hyundaiCzechRepublic',
	HYUNDAI_CANADA: 'hyundaiCanada',
	HYUNDAI_USA: 'hyundaiUsa',
	HYUNDAI_BRAZIL: 'hyundaiBrazil',
	BRAZIL_CAOA_HYUNDAI: 'brazilCaoaHyundai',
	HYUNDAI_CHINA_BEIJING: 'hyundaiChinaBeijing',
	KIA_SOUTH_KOREA: 'kiaSouthKorea',
	KIA_MYANMAR: 'kiaMyanmar',
	KIA_MALAYSIA: 'kiaMalaysia',
	KIA_SLOVAKIA: 'kiaSlovakia',
	KIA_MEXICO: 'kiaMexico',
	KIA_URUGUAY: 'kiaUruguay',
	KIA_CHINA_JIANGSU_YUEDA: 'kiaChinaJiangsuYueda'
} as const;

const MARKET_LABELS = {
	FOR_THE_US_CANADA_AND_MEXICO_MARKET: 'forTheUsCanadaAndMexicoMarket',
	FOR_THE_EUROPEAN_ASIAN_AND_SOUTH_AMERICAN_MARKET: 'forTheEuropeanAsianAndSouthAmericanMarket'
} as const;

const MODEL_SPECS_LABELS = {
	MODEL_39_KWH_80_KW: 'model_39Kwh_80Kw',
	MODEL_64_KWH_150_KW: 'model_64Kwh_150Kw',
	MODEL_39_KWH_100_KW: 'model_39Kwh_100Kw'
} as const;

const PRODUCTION_PLAN_LABELS = {
	HWASEONG: 'plantHwaseong',
	GWANGJU: 'plantGwangju',
	SEOSAN: 'plantSeosan',
	YANGON: 'plantYangon',
	ULSAN: 'plantUlsan'
} as const;

export function vinParse(vin: string) {
	let manufacturer = '';
	let market = '';

	if (vin[0] == '5' && vin[1] == 'X') {
		manufacturer = MANUFACTURER_LABELS.HYUNDAI_KIA_USA;
	} else if (vin[0] == 'K' && vin[1] == 'M' && vin[2] == 'H') {
		manufacturer = MANUFACTURER_LABELS.HYUNDAI_SOUTH_KOREA;
	} else if (vin[0] == 'T' && vin[1] == 'M' && vin[2] == 'A') {
		manufacturer = MANUFACTURER_LABELS.HYUNDAI_CZECH_REPUBLIC;
	} else if (vin[0] == '2' && vin[1] == 'H' && vin[2] == 'M') {
		manufacturer = MANUFACTURER_LABELS.HYUNDAI_CANADA;
	} else if (vin[0] == '5' && vin[1] == 'N' && vin[2] == 'M') {
		manufacturer = MANUFACTURER_LABELS.HYUNDAI_USA;
	} else if (vin[0] == '5' && vin[1] == 'N' && vin[2] == 'P') {
		manufacturer = MANUFACTURER_LABELS.HYUNDAI_USA;
	} else if (vin[0] == '9' && vin[1] == 'B' && vin[2] == 'H') {
		manufacturer = MANUFACTURER_LABELS.HYUNDAI_BRAZIL;
	} else if (vin[0] == '9' && vin[1] == '5' && vin[2] == 'P') {
		manufacturer = MANUFACTURER_LABELS.BRAZIL_CAOA_HYUNDAI;
	} else if (vin[0] == 'L' && vin[1] == 'B' && vin[2] == 'E') {
		manufacturer = MANUFACTURER_LABELS.HYUNDAI_CHINA_BEIJING;
	} else if (vin[0] == 'K' && vin[1] == 'N') {
		manufacturer = MANUFACTURER_LABELS.KIA_SOUTH_KOREA;

		if (vin[2] == 'D') {
			market = MARKET_LABELS.FOR_THE_US_CANADA_AND_MEXICO_MARKET;
		} else if (vin[2] == 'A') {
			market = MARKET_LABELS.FOR_THE_EUROPEAN_ASIAN_AND_SOUTH_AMERICAN_MARKET;
		}
	} else if (vin[0] == 'M' && vin[1] == 'S' && vin[2] == '0') {
		manufacturer = MANUFACTURER_LABELS.KIA_MYANMAR;
	} else if (vin[0] == 'P' && vin[1] == 'N' && vin[2] == 'A') {
		manufacturer = MANUFACTURER_LABELS.KIA_MALAYSIA;
	} else if (vin[0] == 'U' && vin[1] == '5' && vin[2] == 'Y') {
		manufacturer = MANUFACTURER_LABELS.KIA_SLOVAKIA;
	} else if (vin[0] == '3' && vin[1] == 'K' && vin[2] == 'P') {
		manufacturer = MANUFACTURER_LABELS.KIA_MEXICO;
	} else if (vin[0] == '9' && vin[1] == 'U' && vin[2] == 'W') {
		manufacturer = MANUFACTURER_LABELS.KIA_URUGUAY;
	} else if (vin[0] == 'L' && vin[1] == 'J' && vin[2] == 'D') {
		manufacturer = MANUFACTURER_LABELS.KIA_CHINA_JIANGSU_YUEDA;
	} else {
	}

	let model = '';
	if (vin[3] == 'J') {
		model = 'Soul';
	} else if (vin[3] == 'C') {
		model = 'Niro';
	} else if (vin[3] == 'K') {
		model = 'Kona';
	} else {
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
		type = MODEL_SPECS_LABELS.MODEL_39_KWH_80_KW;
	} else if (vin[7] == 'G') {
		type = MODEL_SPECS_LABELS.MODEL_64_KWH_150_KW;
	} else if (vin[7] == 'H') {
		type = MODEL_SPECS_LABELS.MODEL_39_KWH_100_KW;
	}

	let productionPlant = '';
	if (vin[10] == '5') {
		productionPlant = PRODUCTION_PLAN_LABELS.HWASEONG;
	} else if (vin[10] == '7') {
		productionPlant = PRODUCTION_PLAN_LABELS.GWANGJU;
	} else if (vin[10] == 'T') {
		productionPlant = PRODUCTION_PLAN_LABELS.SEOSAN;
	} else if (vin[10] == 'Y') {
		productionPlant = PRODUCTION_PLAN_LABELS.YANGON;
	} else if (vin[10] == 'U') {
		productionPlant = PRODUCTION_PLAN_LABELS.ULSAN;
	}

	let sequenceNumber = vin.slice(11, 17);
	return {
		manufacturer,
		market,
		model,
		year,
		type,
		productionPlant,
		sequenceNumber
	} as const;
}

let DISTRICTS = ["SRINAGAR"];

let CONSTITUENCIES = {
  SRINAGAR: [
    "KHANYAR-20",
    "HAZRATBAL-19",
    "HABBAKADAL-21",
    "LAL CHOWK-22",
    "CHANNAPORA-23",
    "ZADIBAL-24",
    "EIDGAH-25",
    "CENTRAL SHALTANG-26",
  ],
};

//HALQAS MAPPED TO CONSTITUENCIES

let HALQAS = {
  "KHANYAR-20": [
    "HARWAN",
    "SHALIMAR",
    "GUPT GANGA",
    "NISHAT BAGH",
    "BRANE",
    "BUCHWARA",
    "ABI NOWPORA",
    "BRARI NAMBAL",
    "KHANYAR",
    "NOWHATTA",
    "S.R GUNJ",
    "",
  ],

  "HAZRATBAL-19": [
    "NANDPORA",
    "BATA PORA",
    "HABBAK KHUSHKI",
    "SADRA BAL",
    "HABBAK SHANPORA",
    "TAILBAL",
    "ZAKOORA",
    "GULAB BAGH",
    "SAIDAPORA BALA",
    "CHATTERHAMA",
    "KHIMBER",
    "ANCHAR",
    "BURZAHAMA",
    "GASOO",
    "HABBAKADAL",
    "CHATTABAL",
    "BAGHAT SHOORU",
    "PAZWALPORA",
    "MUFTIBAGH",
    "DARA",
    "OWANTA BHAWAN",
    "BUCHPORA",
    "UMARHAIR",
    "TASHWAN",
  ],
  "HABBAKADAL-21": ["CHATTABAL", "TASHWAN", "ZAINAKADAL", "HABBAKADAL"],
  "LAL CHOWK-22": [
    "NURSINGARH",
    "SONWAR",
    "MAISUMA",
    "KURSOO PADSHAHIBAGH",
    "PANDHRATHEN",
    "SHIVPURA",
    "BATTAMALOO",
    "BARZULLA",
    "LASJAN",
    "PANTHACHOWK",
    "ZAWOORA",
    "ZEWEN",
    "BALHAMA",
    "KHONMOH",
  ],

  "CHANNAPORA-23": [
    "NOWGAM",
    "NATIPORA",
    "RAWALPORA",
    "HYDERPORA",
    "BAGAT BRZULLA",
    "NADIRGUND",
  ],

  "ZADIBAL-24": [
    "ZOONIMAR",
    "NANDPURA",
    "ABI KARPORA",
    "SANGEEN DARWAZA",
    "NOWHATTA",
    "RAINAWARI",
  ],

  "EIDGAH-25": [
    "UCHPORA",
    "UMHERHAIR",
    "ZOONIMAR",
    "BAGAT SHOORU",
    "ANCHAR",
    "NOORBAGH",
    "BAGHWANPORA",
    "NAWAKADAL",
    "PALPORA",
    "KRESHBAL",
    "BAKSHIPORA TENGPORA",
    "SANGA,",
    "DEDMARI BAGH",
  ],
  "CENTRAL SHALTANG-26": [
    "ZAINAKOT",
    "BARTHANA",
    "MUJGUND",
    "LAWAYPORA",
    "PANZINARA",
    "BATAMALOO",
    "RAMPORA",
    "KHUSHIPORA",
  ],
};

//WARDS MAPPED TO CONSTITUENCIES

let WARDS = {
  "KHANYAR-20": [
    "HARWAN-01",
    "NISHAT-02",
    "BRANE-03",
    "DAL GATE-04",
    "MUNWARA BADH-37",
    "MAHRAJ GUNJ-39",
    "JAMIA MASJID-40",
    "MAKHDOOM SAHIB-41",
    "KHAWAJA BAZAR-42",
    "AQILMIR-43",
    "ROZABAL-44",
    "DAULATABAD-45",
    "KAWDARA-54",
    "KATHI DARWAZA-63",
  ],
  "HAZRATBAL-19": [
    "HAZRATBAL",
    "BOUD DAL",
    "TAILBAL",
    "HABBAK",
    "BUCHPORA",
    "AHMAD NAGAR",
    "ZAKURA",
    "CHATTERHAMA",
  ],
  "HABBAKADAL-21": [
    "KARAN NAGAR",
    "CHATTABAL",
    "TANKIPORA",
    "SYED ALI AKBAR",
    "BASANT BAGH",
    "FATEH KADAL",
    "KHANKAH-E-MOULA",
    "NAWABAZAR",
  ],

  "LAL CHOWK-22": [
    "LALCHOWK",
    "PANTHACHOWK",
    "RAJBAGH",
    "IKHRAJPORA",
    "MEHJOOR NAGAR",
    "NATIPORA",
    "BAGHAT",
    "ALLOCHI BAGH",
    "SHEIKH DAWOOD COLONY",
    "SHAHEED GUNJ",
  ],
  "CHANNAPORA-23": [
    "BAGH-E-MEHTAB SHANKERPORA",
    "CHANNAPORA",
    "BUDSHAH MOHALLA",
    "HYDERPORA",
    "HUMHAMA",
  ],
  "ZADIBAL-24": [
    "MAKHDOOM SAHIB",
    "HAWAL",
    "ALAMGARI BAZAR",
    "GILLI KADAL",
    "NOWSHERA",
    "LAL BAZAR",
    "BOTSHAH",
    "UMER COLONY",
    "JOGI LANKER",
    "LAKUT DAL",
    "HAZRATBAL",
  ],
  "EIDGAH-25": [
    "EIDGAH",
    "NAWA KADAL",
    "SAFA KADAL",
    "EIDGAH",
    "RATHPORA",
    "PALPORA",
    "TARABAL",
  ],
  "CENTRAL SHALTANG-26": [
    "CENTRAL SHALTENG",
    "QAMMERWARI",
    "ZIYARAT BATAMALOO",
    "BEMINA EAST",
    "BEMINA WEST",
    "NUNDRESHI COLONY",
    "PARIMPORA",
    "ZAINAKOTE",
    "LAWAYPORA",
    "MUJGUND",
  ],
};

//BOOTHS MAPPED TO HALQAS
let BOOTHS = {
  HARWAN: [
    "HARIIPORA HARWAN A",
    "HARIPORA HARWAN B",
    "HARIPORA HARWAN C",
    "HARIPORA HARWAN D",
    "HARWAN A",
    "HARWAN B",
    "HARWAN C",
  ],
  SHALIMAR: [
    "SHALIMAR A",
    "SHAILMAR B",
    "BUNNYGAM A",
    "BUNNYGAM B",
    "BUNNYGAM C",
  ],
  "GUPT GANGA": [
    "GUPT GANGA A",
    "GUPT GANGA B",
    "GUPT GANGA C",
    "GUPTA GANGA D",
    "GUPTA GANGA E",
    "GUPTA GANGA F",
  ],

  NISHAT: ["NISHAT A", "NISHAT B", "NISHAT C", "NISHAT C1"],

  BRANE: [
    "BRANE A",
    "BRANE B",
    "BRANE AC",
    "BRANE C1",
    "BRANE D",
    "BRANE E",
    "BRANE F",
    "BRANE G",
    "BRANE H",
    "BRANE I",
    "BRANE J",
    "BRANE J1",
    "ZETHYAR",
  ],

  BUCHWARA: [
    "GAGRI BAL",
    "BUCHWARA A",
    "BUCHWARA B",
    "BUCHWARA C",
    "BUCHWARA D",
    "BUCHWARA E",
    "ABI BUCHWARA",
    "ABI BUCHWARA A",
  ],
  "BRARI NAMBAL": [
    "BABA DARAMDAS",
    "KHONA KHAN A",
    "KHONA KHAN B",
    "BISHAMBER NAGAR",
    "MUNWARABAD A",
    "MUNWARABAD B",
    "TENG BAGH A",
    "TENG BAGH B",
    "BABADEMB",
  ],
  "ABI NOWPORA": [
    "BANDAR BAGH",
    "NOWPORA A",
    "NOWPORA B",
    "ABI NOWPORA A",
    "ABI NOWPORA B",
  ],
  KHANYAR: [
    "KOOLIPORA A",
    "KOOLIPORA B",
    "BRARI NAMBAL",
    "BUDOO BAGH",
    "DAULATABAD A",
    "DAULATABAD B",
    "BAGHI ROOPSINGH",
    "RAITANG",
    "THUNGA MASJID",
    "KHALIFA PORA",
    "KAW MOHALLAH AQIL MIR A",
    "KAW MOHALLA AQIL MIR B",
    "QADRI KOCHA AQIL MIR",
    "BANGI KOCHA",
    "SHEESHGARI MOHALLAH A",
    "SHEESHGAR MOHALLAH B",
    "ANZIMIR KHANYAR",
    "SUMKACHBAL",
    "MIR MASJID",
    "ROZABAL",
    "ARAM MASJID",
    "ARAM MASJID A",
    "ARAM MASJID B",
    "REDAPORA",
  ],
  NOWHATTA: [
    "KHAWJA BAZAR A",
    "KHAWAJA BAZAR B",
    "HAKA BAZAR",
    "PANDAN",
    "JAMIA MASJID NOWHATTA",
    "TILWAANDORI SARAFKADAL",
    "MALPOORA",
    "KILLI MASJID",
    "KAMANGAR PORA",
    "QADE KADAL",
    "MALIK SAHIB NOWHATA A",
    "RANGHAMAM",
    "ROSHANGAR MOHALLAH",
    "SAYEEDPORA",
    "JAB GARI MOHALLAH",
    "BHAUDIN SAHIB NOWHATTA",
    "TUJGARI MOHALLAH",
    "SIKANDER PORA",
    "GOJWARA MOHALLAH",
    "TULWARI GOJWARA",
    "HASSANABAD SAIDAKADAL A",
    "HASSANABAD SAIDAKADAL B",
    "BERUNI KATHI DARWAZA A",
    "BERUNI KATHI DARWAZA B",
    "SHAHABAD KHUDPORA",
    "KHAWAJA YARBAL SAIDAKADAL A",
    "KHAWAJA YARBAL SAIDAKADAL B",
  ],
  "S.R GANJ": [
    "SAIFUDDINPORA",
    "RAJOURI KADAL",
    "BUCH MOHALLAH",
    "MAHARAJ GATH",
    "BANDAY KOCHA",
    "SHEIKH MOHALLAH",
    "KRALTANJ",
    "GANIATMANZ A",
    "GANIATMANZ B",
    "MALCHIMAR ALIKADAL",
    "SOKALIPURA",
    "RANG TENG",
    "BUTYAR GATH",
    "BULBULLANKER A",
    "BULBULLANKER B",
    "WANGANPORA NAWAKADAL",
    "KAWDARA",
    "DALIPORA",
    "SURNAI MOHALLAH",
    "PATH POORA",
    "MAKAR POORA",
    "SAYEED SAHIB",
  ],
};

let ZONES = ["ZONE-O", "ZONE-N"];

let BLOCKS = ["BLOCK-A", "BLOCK-B", "BLOCK-C", "BLOCK-D"];

function renderHalqaFromConstituency(constituency) {
  if (!constituency) {
    return [];
  }

  if (HALQAS[constituency]) return HALQAS[constituency];
  else return [];
}

function renderConstituencyFromDistrict(district) {
  if (!district) {
    return [];
  }
  if (CONSTITUENCIES[district]) {
    return CONSTITUENCIES[district];
  } else return [];
}

function renderWardsFromConstituency(constituency) {
  if (!constituency) {
    return [];
  }
  if (WARDS[constituency]) {
    return WARDS[constituency];
  } else return [];
}

function renderBoothsFromHalqas(halqa) {
  if (!halqa) {
    return [];
  }

  if (BOOTHS[halqa]) {
    return BOOTHS[halqa];
  } else return [];
}

let DATA = {
  CONSTITUENCIES,
  HALQAS,
  WARDS,
  BOOTHS,
  ZONES,
  BLOCKS,
  DISTRICTS,
};

module.exports = DATA;

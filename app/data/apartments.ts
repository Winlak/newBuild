export type ApartmentSearchParam = 'renovation' | 'furniture' | 'installment' | 'mortgage_no_dp' | 'completed' | 'studio'

export interface Apartment {
  slug: string
  title: string
  complex: string
  address: string
  district: string
  image: string
  images?: string[]
  price: number
  pricePerMeter: number
  mortgagePayment: number
  rooms: string
  area: number
  kitchenArea: number
  floor: number
  totalFloors: number
  finish: string
  completion: string
  builder: string
  metroStation: string
  metroWalkMinutes: number
  metroDistanceMeters: number
  verified: boolean
  verificationReport?: string
  phone: string
  phoneHref: string
  coordinates: {
    lat: number
    lng: number
  }
  searchParams?: ApartmentSearchParam[]
  tags: string[]
  features: string[]
  unitMix: ApartmentUnit[]
  description: string
}

export interface ApartmentUnit {
  rooms: string
  label: string
  areaFrom: number
  areaTo: number
  priceFrom: number
  priceTo: number
  mortgageFrom: number
  count: number
  finish: string
}

export const apartments: Apartment[] = [
  {
    slug: 'evropeyskiy-bereg-2k-58',
    title: 'ЖК Европейский берег',
    complex: 'ЖК Европейский берег',
    address: 'Новосибирск, ул. Большевистская, 35',
    district: 'Октябрьский район',
    image: '/content/MainIMG.webp',
    price: 9820000,
    pricePerMeter: 168151,
    mortgagePayment: 52100,
    rooms: '2',
    area: 58.4,
    kitchenArea: 15.2,
    floor: 8,
    totalFloors: 17,
    finish: 'White box',
    completion: 'Сдан',
    builder: 'Брусника',
    metroStation: 'Речной вокзал',
    metroWalkMinutes: 12,
    metroDistanceMeters: 920,
    verified: true,
    phone: '8 383 255-55-21',
    phoneHref: 'tel:83832555521',
    coordinates: {
      lat: 55.0089,
      lng: 82.9633,
    },
    tags: ['Дом сдан', 'Вид на реку', 'Семейная ипотека'],
    features: ['Панорамные окна', 'Закрытый двор', 'Подземный паркинг', 'Школа рядом'],
    unitMix: [
      { rooms: '1', label: '1-комнатные', areaFrom: 39.8, areaTo: 46.2, priceFrom: 7200000, priceTo: 8500000, mortgageFrom: 38200, count: 6, finish: 'White box' },
      { rooms: '2', label: '2-комнатные', areaFrom: 56.4, areaTo: 67.8, priceFrom: 9820000, priceTo: 12100000, mortgageFrom: 52100, count: 8, finish: 'White box' },
      { rooms: '3', label: '3-комнатные', areaFrom: 78.2, areaTo: 91.5, priceFrom: 13800000, priceTo: 16400000, mortgageFrom: 73200, count: 3, finish: 'White box' },
    ],
    description:
      'Жилой комплекс у набережной с закрытым двором, прогулочными зонами и подбором квартир от компактных однокомнатных до семейных трехкомнатных планировок.',
  },
  {
    slug: 'rascvetai-na-gogolya-studio-32',
    title: 'ЖК Расцветай на Гоголя',
    complex: 'ЖК Расцветай на Гоголя',
    address: 'Новосибирск, ул. Гоголя, 205/1',
    district: 'Дзержинский район',
    image: '/content/AboutFirstIMG.webp',
    price: 5480000,
    pricePerMeter: 170717,
    mortgagePayment: 29100,
    rooms: 'Студия',
    area: 32.1,
    kitchenArea: 6.8,
    floor: 12,
    totalFloors: 25,
    finish: 'Чистовая',
    completion: 'IV кв. 2026',
    builder: 'Расцветай',
    metroStation: 'Березовая роща',
    metroWalkMinutes: 9,
    metroDistanceMeters: 690,
    verified: true,
    phone: '8 962 835-55-21',
    phoneHref: 'tel:89628355521',
    coordinates: {
      lat: 55.0527,
      lng: 82.9756,
    },
    tags: ['С отделкой', 'У метро', 'Первый взнос от 10%'],
    features: ['Чистовая отделка', 'Лоджия', 'Колясочные', 'Коммерция на первом этаже'],
    unitMix: [
      { rooms: 'Студия', label: 'Студии', areaFrom: 26.4, areaTo: 33.8, priceFrom: 4680000, priceTo: 5650000, mortgageFrom: 24900, count: 11, finish: 'Чистовая' },
      { rooms: '1', label: '1-комнатные', areaFrom: 36.5, areaTo: 45.1, priceFrom: 5980000, priceTo: 7350000, mortgageFrom: 31800, count: 9, finish: 'Чистовая' },
      { rooms: '2', label: '2-комнатные', areaFrom: 54.2, areaTo: 64.7, priceFrom: 8350000, priceTo: 10200000, mortgageFrom: 44300, count: 4, finish: 'Чистовая' },
    ],
    description:
      'Комплекс рядом с метро и крупными транспортными развязками. В продаже студии, однокомнатные и двухкомнатные квартиры с готовой отделкой.',
  },
  {
    slug: 'aviator-3k-78',
    title: 'ЖК Авиатор',
    complex: 'ЖК Авиатор',
    address: 'Новосибирск, ул. Аэропорт, 1/1',
    district: 'Заельцовский район',
    image: '/content/ContactIMG.webp',
    price: 12390000,
    pricePerMeter: 157634,
    mortgagePayment: 65800,
    rooms: '3',
    area: 78.6,
    kitchenArea: 18.4,
    floor: 5,
    totalFloors: 14,
    finish: 'Предчистовая',
    completion: 'II кв. 2027',
    builder: 'Стрижи',
    metroStation: 'Заельцовская',
    metroWalkMinutes: 18,
    metroDistanceMeters: 1450,
    verified: true,
    phone: '8 383 255-55-21',
    phoneHref: 'tel:83832555521',
    coordinates: {
      lat: 55.0591,
      lng: 82.9004,
    },
    tags: ['Семейная планировка', 'Парк рядом', 'Кладовая'],
    features: ['Два санузла', 'Гардеробная', 'Детские площадки', 'Велопарковки'],
    unitMix: [
      { rooms: '1', label: '1-комнатные', areaFrom: 42.3, areaTo: 48.9, priceFrom: 6950000, priceTo: 7900000, mortgageFrom: 36900, count: 5, finish: 'Предчистовая' },
      { rooms: '2', label: '2-комнатные', areaFrom: 61.4, areaTo: 72.6, priceFrom: 9600000, priceTo: 11600000, mortgageFrom: 50900, count: 7, finish: 'Предчистовая' },
      { rooms: '3', label: '3-комнатные', areaFrom: 78.6, areaTo: 94.8, priceFrom: 12390000, priceTo: 15400000, mortgageFrom: 65800, count: 5, finish: 'Предчистовая' },
    ],
    description:
      'Семейный жилой комплекс в районе с зелеными зонами, школами и удобным выездом в центр. Есть варианты с большими кухнями-гостиными и кладовыми.',
  },
  {
    slug: 'datskiy-kvartal-1k-43',
    title: 'ЖК Датский квартал',
    complex: 'ЖК Датский квартал',
    address: 'Новосибирск, ул. Никитина, 145',
    district: 'Октябрьский район',
    image: '/content/AboutBG.webp',
    price: 7140000,
    pricePerMeter: 163014,
    mortgagePayment: 37900,
    rooms: '1',
    area: 43.8,
    kitchenArea: 13.6,
    floor: 10,
    totalFloors: 21,
    finish: 'Без отделки',
    completion: 'III кв. 2026',
    builder: 'Сибирь Девелопмент',
    metroStation: 'Октябрьская',
    metroWalkMinutes: 16,
    metroDistanceMeters: 1250,
    verified: true,
    phone: '8 962 835-55-21',
    phoneHref: 'tel:89628355521',
    coordinates: {
      lat: 55.0189,
      lng: 82.9615,
    },
    tags: ['Умный дом', 'Рассрочка', 'Закрытая территория'],
    features: ['Большая кухня', 'Ниша под гардероб', 'Безбарьерная среда', 'Двор без машин'],
    unitMix: [
      { rooms: 'Студия', label: 'Студии', areaFrom: 29.4, areaTo: 34.6, priceFrom: 5120000, priceTo: 5900000, mortgageFrom: 27200, count: 4, finish: 'Без отделки' },
      { rooms: '1', label: '1-комнатные', areaFrom: 39.6, areaTo: 48.4, priceFrom: 7140000, priceTo: 8250000, mortgageFrom: 37900, count: 9, finish: 'Без отделки' },
      { rooms: '2', label: '2-комнатные', areaFrom: 57.8, areaTo: 69.3, priceFrom: 9400000, priceTo: 11200000, mortgageFrom: 49900, count: 5, finish: 'Без отделки' },
    ],
    description:
      'Квартал с закрытой территорией, двором без машин и квартирами под ремонт. Подходит тем, кто хочет адаптировать планировку и отделку под себя.',
  },
  {
    slug: 'panorama-2k-64',
    title: 'ЖК Панорама',
    complex: 'ЖК Панорама',
    address: 'Новосибирск, ул. Сибревкома, 9',
    district: 'Центральный район',
    image: '/content/AboutSecondIMG.webp',
    price: 10950000,
    pricePerMeter: 170561,
    mortgagePayment: 58100,
    rooms: '2',
    area: 64.2,
    kitchenArea: 16.9,
    floor: 18,
    totalFloors: 24,
    finish: 'White box',
    completion: 'Сдан',
    builder: 'Энергомонтаж',
    metroStation: 'Площадь Ленина',
    metroWalkMinutes: 7,
    metroDistanceMeters: 540,
    verified: true,
    phone: '8 383 255-55-21',
    phoneHref: 'tel:83832555521',
    coordinates: {
      lat: 55.0305,
      lng: 82.9249,
    },
    tags: ['Центр', 'Ключи сразу', 'Видовой этаж'],
    features: ['Вид на город', 'Консьерж', 'Лаунж-зона', 'Паркинг'],
    unitMix: [
      { rooms: '1', label: '1-комнатные', areaFrom: 41.2, areaTo: 49.5, priceFrom: 7900000, priceTo: 9200000, mortgageFrom: 41900, count: 3, finish: 'White box' },
      { rooms: '2', label: '2-комнатные', areaFrom: 60.8, areaTo: 73.4, priceFrom: 10950000, priceTo: 13700000, mortgageFrom: 58100, count: 6, finish: 'White box' },
      { rooms: '3', label: '3-комнатные', areaFrom: 86.2, areaTo: 108.7, priceFrom: 16800000, priceTo: 22400000, mortgageFrom: 89200, count: 2, finish: 'White box' },
    ],
    description:
      'Центральный комплекс с видовыми этажами, консьерж-сервисом и паркингом. В подборе есть квартиры для жизни в центре и просторные семейные варианты.',
  },
  {
    slug: 'akvarel-1k-39',
    title: 'ЖК Акварельный',
    complex: 'ЖК Акварельный',
    address: 'Новосибирск, ул. Петухова, 101',
    district: 'Кировский район',
    image: '/content/MapIMG.webp',
    price: 5930000,
    pricePerMeter: 150127,
    mortgagePayment: 31500,
    rooms: '1',
    area: 39.5,
    kitchenArea: 12.1,
    floor: 7,
    totalFloors: 18,
    finish: 'Чистовая',
    completion: 'I кв. 2027',
    builder: 'Первый строительный фонд',
    metroStation: 'Площадь Маркса',
    metroWalkMinutes: 15,
    metroDistanceMeters: 1180,
    verified: true,
    phone: '8 962 835-55-21',
    phoneHref: 'tel:89628355521',
    coordinates: {
      lat: 54.9486,
      lng: 82.8921,
    },
    tags: ['С отделкой', 'Ипотека без ПВ', 'Семейный квартал'],
    features: ['Отделка под ключ', 'Теплая лоджия', 'Детский сад во дворе', 'Места для хранения'],
    unitMix: [
      { rooms: 'Студия', label: 'Студии', areaFrom: 25.8, areaTo: 31.6, priceFrom: 4250000, priceTo: 5100000, mortgageFrom: 22600, count: 7, finish: 'Чистовая' },
      { rooms: '1', label: '1-комнатные', areaFrom: 36.9, areaTo: 44.2, priceFrom: 5930000, priceTo: 6900000, mortgageFrom: 31500, count: 10, finish: 'Чистовая' },
      { rooms: '2', label: '2-комнатные', areaFrom: 52.7, areaTo: 62.5, priceFrom: 7800000, priceTo: 9400000, mortgageFrom: 41400, count: 4, finish: 'Чистовая' },
    ],
    description:
      'Развивающийся семейный квартал с детским садом во дворе и отделкой под ключ. Хороший набор планировок для первого жилья, инвестиций и семейной покупки.',
  },
]

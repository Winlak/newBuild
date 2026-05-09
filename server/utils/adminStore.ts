import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { apartments as seedApartments, type Apartment, type ApartmentSearchParam } from '../../app/data/apartments'
import { reviews as seedReviews, type ReviewItem } from '../../app/data/reviews'

export type { Apartment }

export interface ReviewRecord extends ReviewItem {
  contact?: string
  status: 'approved' | 'pending'
  createdAt: string
}

const dataDir = join(process.cwd(), '.data')
const apartmentsPath = join(dataDir, 'apartments.json')
const reviewsPath = join(dataDir, 'reviews.json')

const ensureDataDir = async () => {
  await mkdir(dataDir, { recursive: true })
}

const readJson = async <T>(path: string, fallback: T): Promise<T> => {
  await ensureDataDir()

  try {
    return JSON.parse(await readFile(path, 'utf8')) as T
  } catch {
    await writeJson(path, fallback)
    return fallback
  }
}

const writeJson = async <T>(path: string, value: T) => {
  await ensureDataDir()
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
}

const seedReviewRecords = (): ReviewRecord[] => seedReviews.map(review => ({
  ...review,
  status: 'approved',
  createdAt: '2026-01-01T00:00:00.000Z',
}))

const searchParamIds = new Set<ApartmentSearchParam>([
  'renovation',
  'furniture',
  'installment',
  'mortgage_no_dp',
  'completed',
  'studio',
])

const normalizeSearchParams = (value: unknown): ApartmentSearchParam[] => Array.isArray(value)
  ? [...new Set(value
      .map(String)
      .filter((item): item is ApartmentSearchParam => searchParamIds.has(item as ApartmentSearchParam)))]
  : []

export const readApartments = () => readJson<Apartment[]>(apartmentsPath, seedApartments)

export const writeApartments = (apartments: Apartment[]) => writeJson(apartmentsPath, apartments)

export const readReviews = () => readJson<ReviewRecord[]>(reviewsPath, seedReviewRecords())

export const writeReviews = (reviews: ReviewRecord[]) => writeJson(reviewsPath, reviews)

export const normalizeApartment = (input: Partial<Apartment>): Apartment => {
  const phone = String(input.phone ?? '').trim()

  return {
    slug: String(input.slug ?? '').trim(),
    title: String(input.title ?? '').trim(),
    complex: String(input.complex ?? '').trim(),
    address: String(input.address ?? '').trim(),
    district: String(input.district ?? '').trim(),
    image: String(input.image ?? '/content/MainIMG.png').trim(),
    images: Array.isArray(input.images)
      ? [...new Set(input.images.map(String).map(item => item.trim()).filter(Boolean))]
      : [String(input.image ?? '/content/MainIMG.png').trim()].filter(Boolean),
    price: Number(input.price ?? 0),
    pricePerMeter: Number(input.pricePerMeter ?? 0),
    mortgagePayment: Number(input.mortgagePayment ?? 0),
    rooms: String(input.rooms ?? '').trim(),
    area: Number(input.area ?? 0),
    kitchenArea: Number(input.kitchenArea ?? 0),
    floor: Number(input.floor ?? 0),
    totalFloors: Number(input.totalFloors ?? 0),
    finish: String(input.finish ?? '').trim(),
    completion: String(input.completion ?? '').trim(),
    builder: String(input.builder ?? '').trim(),
    metroStation: String(input.metroStation ?? '').trim(),
    metroWalkMinutes: Number(input.metroWalkMinutes ?? 0),
    metroDistanceMeters: Number(input.metroDistanceMeters ?? Number(input.metroWalkMinutes ?? 0) * 80),
    verified: Boolean(input.verified),
    verificationReport: String(input.verificationReport ?? '').trim(),
    phone,
    phoneHref: String(input.phoneHref ?? `tel:${phone.replace(/\D/g, '')}`).trim(),
    coordinates: {
      lat: Number(input.coordinates?.lat ?? 55.0302),
      lng: Number(input.coordinates?.lng ?? 82.9204),
    },
    searchParams: normalizeSearchParams(input.searchParams),
    tags: Array.isArray(input.tags) ? input.tags.map(String).filter(Boolean) : [],
    features: Array.isArray(input.features) ? input.features.map(String).filter(Boolean) : [],
    unitMix: Array.isArray(input.unitMix)
      ? input.unitMix.map(unit => ({
          rooms: String(unit.rooms ?? '').trim(),
          label: String(unit.label ?? '').trim(),
          areaFrom: Number(unit.areaFrom ?? 0),
          areaTo: Number(unit.areaTo ?? 0),
          priceFrom: Number(unit.priceFrom ?? 0),
          priceTo: Number(unit.priceTo ?? 0),
          mortgageFrom: Number(unit.mortgageFrom ?? 0),
          count: Number(unit.count ?? 0),
          finish: String(unit.finish ?? '').trim(),
        })).filter(unit => unit.rooms && unit.label)
      : [],
    description: String(input.description ?? '').trim(),
  }
}

export const createSlug = (value: string) => value
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9а-яё]+/gi, '-')
  .replace(/^-+|-+$/g, '')
  || `apartment-${Date.now()}`

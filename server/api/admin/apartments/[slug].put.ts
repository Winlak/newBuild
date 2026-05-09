import { requireAdmin } from '../../../utils/adminAuth'
import { normalizeApartment, readApartments, writeApartments, type Apartment } from '../../../utils/adminStore'

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const slug = getRouterParam(event, 'slug')
  const body = await readBody<Partial<Apartment>>(event)
  const apartments = await readApartments()
  const index = apartments.findIndex(item => item.slug === slug)

  if (index === -1) {
    throw createError({
      statusCode: 404,
      statusMessage: 'ЖК не найден',
    })
  }

  const apartment = normalizeApartment({
    ...apartments[index],
    ...body,
    slug: body.slug || slug,
  })

  if (apartment.slug !== slug && apartments.some(item => item.slug === apartment.slug)) {
    throw createError({
      statusCode: 409,
      statusMessage: 'ЖК с таким slug уже существует',
    })
  }

  apartments[index] = apartment
  await writeApartments(apartments)

  return apartment
})

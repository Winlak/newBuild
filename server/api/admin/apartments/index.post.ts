import { requireAdmin } from '../../../utils/adminAuth'
import { createSlug, normalizeApartment, readApartments, writeApartments, type Apartment } from '../../../utils/adminStore'

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const body = await readBody<Partial<Apartment>>(event)
  const apartments = await readApartments()
  const apartment = normalizeApartment({
    ...body,
    slug: body.slug || createSlug(`${body.complex || ''}-${body.title || ''}`),
  })

  if (!apartment.title || !apartment.complex || !apartment.address) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Название ЖК и адрес обязательны',
    })
  }

  if (apartments.some(item => item.slug === apartment.slug)) {
    throw createError({
      statusCode: 409,
      statusMessage: 'ЖК с таким slug уже существует',
    })
  }

  await writeApartments([apartment, ...apartments])

  return apartment
})

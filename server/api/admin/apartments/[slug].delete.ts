import { requireAdmin } from '../../../utils/adminAuth'
import { readApartments, writeApartments } from '../../../utils/adminStore'

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const slug = getRouterParam(event, 'slug')
  const apartments = await readApartments()
  const nextApartments = apartments.filter(item => item.slug !== slug)

  if (nextApartments.length === apartments.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Квартира не найдена',
    })
  }

  await writeApartments(nextApartments)

  return { ok: true }
})

import { requireAdmin } from '../../../utils/adminAuth'
import { readReviews, writeReviews } from '../../../utils/adminStore'

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const id = getRouterParam(event, 'id')
  const reviews = await readReviews()
  const nextReviews = reviews.filter(item => item.id !== id)

  if (nextReviews.length === reviews.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Отзыв не найден',
    })
  }

  await writeReviews(nextReviews)

  return { ok: true }
})

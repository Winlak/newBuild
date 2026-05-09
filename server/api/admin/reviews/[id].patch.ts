import { requireAdmin } from '../../../utils/adminAuth'
import { readReviews, writeReviews } from '../../../utils/adminStore'

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const id = getRouterParam(event, 'id')
  const body = await readBody<{ status?: 'approved' | 'pending' }>(event)
  const reviews = await readReviews()
  const review = reviews.find(item => item.id === id)

  if (!review) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Отзыв не найден',
    })
  }

  review.status = body.status === 'pending' ? 'pending' : 'approved'
  await writeReviews(reviews)

  return review
})

import { readReviews, writeReviews, type ReviewRecord } from '../../utils/adminStore'

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<ReviewRecord>>(event)

  const review: ReviewRecord = {
    id: `pending-${Date.now()}`,
    name: String(body.name ?? '').trim(),
    subtitle: String(body.subtitle ?? '').trim(),
    text: String(body.text ?? '').trim(),
    rating: Math.max(1, Math.min(5, Math.round(Number(body.rating ?? 5)))),
    contact: String(body.contact ?? '').trim(),
    status: 'pending',
    createdAt: new Date().toISOString(),
  }

  if (review.name.length < 2 || review.subtitle.length < 4 || review.text.length < 4 || !review.contact) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Заполните все поля отзыва. Отзыв должен быть не короче 4 символов.',
    })
  }

  const reviews = await readReviews()
  await writeReviews([review, ...reviews])

  return { ok: true, review }
})

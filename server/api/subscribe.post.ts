import { appendJsonRecord } from '../utils/submissionStore'

interface SubscribeBody {
  email?: string
  source?: string
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default defineEventHandler(async (event) => {
  const body = await readBody<SubscribeBody>(event)
  const email = String(body.email ?? '').trim().toLowerCase()

  if (!emailPattern.test(email)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Введите корректный email',
    })
  }

  const subscription = {
    id: `subscription-${Date.now()}`,
    email,
    source: String(body.source ?? 'footer').trim() || 'footer',
    createdAt: new Date().toISOString(),
  }

  await appendJsonRecord('subscriptions.json', subscription)

  return { ok: true, subscription }
})

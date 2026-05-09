import { requireAdmin } from '../../../utils/adminAuth'
import { readJsonRecords, writeJsonRecords } from '../../../utils/submissionStore'
import type { SubscriptionRecord } from './index.get'

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const id = getRouterParam(event, 'id')
  const subscriptions = await readJsonRecords<SubscriptionRecord>('subscriptions.json')
  const nextSubscriptions = subscriptions.filter(item => item.id !== id)

  if (nextSubscriptions.length === subscriptions.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Подписка не найдена',
    })
  }

  await writeJsonRecords('subscriptions.json', nextSubscriptions)

  return { ok: true }
})

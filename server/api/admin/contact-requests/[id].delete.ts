import { requireAdmin } from '../../../utils/adminAuth'
import { readJsonRecords, writeJsonRecords } from '../../../utils/submissionStore'
import type { ContactRequestRecord } from './index.get'

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const id = getRouterParam(event, 'id')
  const requests = await readJsonRecords<ContactRequestRecord>('contact-requests.json')
  const nextRequests = requests.filter(item => item.id !== id)

  if (nextRequests.length === requests.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Заявка не найдена',
    })
  }

  await writeJsonRecords('contact-requests.json', nextRequests)

  return { ok: true }
})

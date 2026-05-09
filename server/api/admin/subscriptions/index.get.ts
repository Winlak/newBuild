import { requireAdmin } from '../../../utils/adminAuth'
import { readJsonRecords } from '../../../utils/submissionStore'

export interface SubscriptionRecord {
  id: string
  email: string
  source?: string
  createdAt: string
}

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  return readJsonRecords<SubscriptionRecord>('subscriptions.json')
})

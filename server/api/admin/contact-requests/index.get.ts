import { requireAdmin } from '../../../utils/adminAuth'
import { readJsonRecords } from '../../../utils/submissionStore'

export interface ContactRequestRecord {
  id: string
  name: string
  phone: string
  email?: string
  message?: string
  time?: string
  source?: string
  createdAt: string
}

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  return readJsonRecords<ContactRequestRecord>('contact-requests.json')
})

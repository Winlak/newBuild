import { requireAdmin } from '../../../utils/adminAuth'
import { readReviews } from '../../../utils/adminStore'

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  return readReviews()
})

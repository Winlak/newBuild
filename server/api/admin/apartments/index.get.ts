import { requireAdmin } from '../../../utils/adminAuth'
import { readApartments } from '../../../utils/adminStore'

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  return readApartments()
})

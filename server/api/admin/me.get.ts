import { requireAdmin } from '../../utils/adminAuth'

export default defineEventHandler((event) => {
  requireAdmin(event)

  return { ok: true }
})

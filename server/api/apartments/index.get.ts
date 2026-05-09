import { readApartments } from '../../utils/adminStore'

export default defineEventHandler(async () => {
  return readApartments()
})

import { readReviews } from '../../utils/adminStore'

export default defineEventHandler(async () => {
  return (await readReviews())
    .filter(review => review.status === 'approved')
    .map(({ contact, status, ...review }) => review)
})

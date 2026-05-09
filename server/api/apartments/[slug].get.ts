import { readApartments } from '../../utils/adminStore'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  const apartment = (await readApartments()).find(item => item.slug === slug)

  if (!apartment) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Квартира не найдена',
    })
  }

  return apartment
})

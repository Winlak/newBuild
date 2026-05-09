import { mkdir, writeFile } from 'node:fs/promises'
import { extname, join } from 'node:path'
import { randomUUID } from 'node:crypto'
import { requireAdmin } from '../../utils/adminAuth'

const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'])
const extensionByType: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/avif': '.avif',
}

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const form = await readMultipartFormData(event)

  if (!form?.length) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Добавьте изображения для загрузки',
    })
  }

  const uploadDir = join(process.cwd(), 'public', 'content', 'uploads')
  await mkdir(uploadDir, { recursive: true })

  const images: string[] = []

  for (const part of form) {
    if (!part.filename || !part.data?.length) {
      continue
    }

    const type = String(part.type || '')

    if (!allowedTypes.has(type)) {
      throw createError({
        statusCode: 415,
        statusMessage: 'Можно загружать только изображения',
      })
    }

    const originalExt = extname(part.filename).toLowerCase()
    const extension = extensionByType[type] || originalExt || '.jpg'
    const filename = `${Date.now()}-${randomUUID()}${extension}`

    await writeFile(join(uploadDir, filename), part.data)
    images.push(`/content/uploads/${filename}`)
  }

  if (!images.length) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Не удалось прочитать изображения',
    })
  }

  return { images }
})

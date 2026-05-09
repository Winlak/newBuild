import { appendJsonRecord } from '../utils/submissionStore'

interface ContactRequestBody {
  name?: string
  phone?: string
  email?: string
  message?: string
  time?: string
  comment?: string
  source?: string
}

export default defineEventHandler(async (event) => {
  const body = await readBody<ContactRequestBody>(event)
  const name = String(body.name ?? '').trim()
  const phone = String(body.phone ?? '').trim()
  const email = String(body.email ?? '').trim()
  const message = String(body.message ?? body.comment ?? '').trim()
  const time = String(body.time ?? '').trim()

  if (name.length < 2 || phone.replace(/\D/g, '').length < 7) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Заполните имя и корректный телефон',
    })
  }

  const submission = {
    id: `contact-${Date.now()}`,
    name,
    phone,
    email,
    message,
    time,
    source: String(body.source ?? 'site').trim() || 'site',
    createdAt: new Date().toISOString(),
  }

  await appendJsonRecord('contact-requests.json', submission)

  return { ok: true, submission }
})

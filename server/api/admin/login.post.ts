import { createAdminToken, setAdminCookie } from '../../utils/adminAuth'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ login?: string, password?: string }>(event)
  const config = useRuntimeConfig()
  const adminLogin = String(config.adminLogin || '')
  const adminPassword = String(config.adminPassword || '')

  if (!adminLogin || !adminPassword) {
    throw createError({
      statusCode: 500,
      statusMessage: 'ADMIN_LOGIN и ADMIN_PASSWORD не заданы в .env',
    })
  }

  if (body.login !== adminLogin || body.password !== adminPassword) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Неверный логин или пароль',
    })
  }

  setAdminCookie(event, createAdminToken(adminLogin, String(config.adminSessionSecret || 'change-me')))

  return { ok: true }
})

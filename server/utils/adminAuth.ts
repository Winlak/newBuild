import { createHmac, timingSafeEqual } from 'node:crypto'

const cookieName = 'admin_session'

const sign = (payload: string, secret: string) => createHmac('sha256', secret)
  .update(payload)
  .digest('hex')

export const createAdminToken = (login: string, secret: string) => {
  const payload = Buffer.from(JSON.stringify({
    login,
    exp: Date.now() + 1000 * 60 * 60 * 12,
  })).toString('base64url')

  return `${payload}.${sign(payload, secret)}`
}

export const verifyAdminToken = (token: string | undefined, secret: string) => {
  if (!token || !token.includes('.')) {
    return false
  }

  const [payload, signature] = token.split('.')
  const expectedSignature = sign(payload, secret)

  if (
    !signature
    || signature.length !== expectedSignature.length
    || !timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
  ) {
    return false
  }

  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as { exp?: number }

    return typeof session.exp === 'number' && session.exp > Date.now()
  } catch {
    return false
  }
}

export const setAdminCookie = (event: Parameters<typeof setCookie>[0], token: string) => {
  setCookie(event, cookieName, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 12,
  })
}

export const clearAdminCookie = (event: Parameters<typeof deleteCookie>[0]) => {
  deleteCookie(event, cookieName, { path: '/' })
}

export const requireAdmin = (event: Parameters<typeof getCookie>[0]) => {
  const config = useRuntimeConfig()
  const isAuthorized = verifyAdminToken(
    getCookie(event, cookieName),
    String(config.adminSessionSecret || 'change-me'),
  )

  if (!isAuthorized) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Требуется вход в админку',
    })
  }
}

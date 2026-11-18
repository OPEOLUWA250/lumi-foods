import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'

export const ADMIN_COOKIE = 'lumifoods_admin'
const SESSION_TTL_SECONDS = 60 * 60 * 8

function secret() {
  const value = process.env.ADMIN_SESSION_SECRET
  if (!value || value.length < 32) {
    throw new Error('ADMIN_SESSION_SECRET must be set to at least 32 characters.')
  }
  return value
}

function sign(value: string) {
  return createHmac('sha256', secret()).update(value).digest('base64url')
}

export function createAdminToken(email: string) {
  const payload = `${email}|${Date.now() + SESSION_TTL_SECONDS * 1000}`
  return `${Buffer.from(payload).toString('base64url')}.${sign(payload)}`
}

export function verifyAdminToken(token: string | undefined) {
  if (!token) return null
  const [encodedPayload, providedSignature] = token.split('.')
  if (!encodedPayload || !providedSignature) return null

  try {
    const payload = Buffer.from(encodedPayload, 'base64url').toString('utf8')
    const expectedSignature = sign(payload)
    const validSignature = timingSafeEqual(
      Buffer.from(providedSignature),
      Buffer.from(expectedSignature),
    )
    const [email, expiresAt] = payload.split('|')
    if (!validSignature || !email || Number(expiresAt) < Date.now()) return null
    return { email }
  } catch {
    return null
  }
}

export async function getAdminSession() {
  const cookieStore = await cookies()
  return verifyAdminToken(cookieStore.get(ADMIN_COOKIE)?.value)
}

export const adminCookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: SESSION_TTL_SECONDS,
}

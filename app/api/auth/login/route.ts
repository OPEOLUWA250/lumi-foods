import { NextResponse } from 'next/server'
import { ADMIN_COOKIE, adminCookieOptions, createAdminToken } from '@/lib/admin-auth'

function isValidEmail(value: unknown): value is string {
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254
}

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const email = body && typeof body === 'object' && 'email' in body ? body.email : undefined
  const password = body && typeof body === 'object' && 'password' in body ? body.password : undefined
  if (!isValidEmail(email) || typeof password !== 'string' || password.length === 0) {
    return NextResponse.json({ error: 'Enter a valid email and password.' }, { status: 400 })
  }

  const configuredEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  const configuredPassword = process.env.ADMIN_PASSWORD
  if (!configuredEmail || !configuredPassword) {
    return NextResponse.json({ error: 'Admin access is not configured.' }, { status: 503 })
  }
  if (email.toLowerCase() !== configuredEmail || password !== configuredPassword) {
    return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })
  }

  const response = NextResponse.json({ email: configuredEmail })
  response.cookies.set(ADMIN_COOKIE, createAdminToken(configuredEmail), adminCookieOptions)
  return response
}

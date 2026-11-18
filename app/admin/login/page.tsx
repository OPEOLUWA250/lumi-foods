'use client'

import { FormEvent, useState } from 'react'
import { ShieldCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const result = await response.json()
      if (!response.ok) {
        setError(result.error || 'Unable to sign in.')
        return
      }
      router.replace('/admin')
    } catch {
      setError('Unable to reach the admin service.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white">
            <ShieldCheck size={26} />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary/60">LumiFoods</p>
            <h1 className="text-2xl font-bold text-slate-950">Store admin</h1>
          </div>
        </div>
        <div className="space-y-4">
          <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Admin email" className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-primary" />
          <input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-primary" />
        </div>
        {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <button disabled={loading} className="mt-6 w-full rounded-lg bg-slate-950 py-3 font-semibold text-white hover:bg-slate-800 disabled:opacity-60">
          {loading ? 'Signing in…' : 'Sign in securely'}
        </button>
        <p className="mt-6 text-center text-xs text-slate-500">Private operations area. Use the credentials configured on the server.</p>
      </form>
    </main>
  )
}

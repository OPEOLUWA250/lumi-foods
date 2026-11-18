'use client'

import { useMemo, useState } from 'react'
import {
  BarChart3,
  Boxes,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  LogOut,
  MessageCircle,
  Package,
  Search,
  ShieldCheck,
  Store,
  Users,
} from 'lucide-react'
import { products } from '@/lib/products'

type View = 'overview' | 'products' | 'orders' | 'customers' | 'security'

const navItems: { id: View; label: string; icon: typeof Store }[] = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'products', label: 'Products', icon: Boxes },
  { id: 'orders', label: 'WhatsApp orders', icon: ClipboardList },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'security', label: 'Security', icon: ShieldCheck },
]

const currency = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 })

export function AdminDashboard({ email }: { email: string }) {
  const [view, setView] = useState<View>('overview')
  const [query, setQuery] = useState('')
  const [loggingOut, setLoggingOut] = useState(false)
  const totalStock = products.length * 20
  const lowStock = products.filter((product) => !product.inStock).length
  const filteredProducts = useMemo(
    () => products.filter((product) => `${product.name} ${product.category}`.toLowerCase().includes(query.toLowerCase())),
    [query],
  )

  async function logout() {
    setLoggingOut(true)
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.assign('/admin/login')
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-800 bg-slate-950 text-white lg:flex lg:flex-col">
        <div className="flex items-center gap-3 border-b border-slate-800 px-6 py-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary font-bold">L</div>
          <div><p className="font-bold">LumiFoods</p><p className="text-xs text-slate-400">Store operations</p></div>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-6">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setView(id)} className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium ${view === id ? 'bg-primary text-white' : 'text-slate-300 hover:bg-slate-900'}`}>
              <Icon size={18} />{label}
            </button>
          ))}
        </nav>
        <div className="border-t border-slate-800 p-4">
          <p className="mb-3 truncate text-xs text-slate-400">{email}</p>
          <button onClick={logout} disabled={loggingOut} className="flex items-center gap-2 text-sm text-slate-300 hover:text-white"><LogOut size={16} />{loggingOut ? 'Signing out…' : 'Sign out'}</button>
        </div>
      </aside>

      <main className="lg:pl-64">
        <header className="sticky top-0 z-10 flex min-h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-5 backdrop-blur md:px-8">
          <div><p className="text-sm text-slate-500">Good day</p><h1 className="text-xl font-bold">{navItems.find((item) => item.id === view)?.label}</h1></div>
          <div className="flex items-center gap-3">
            <a href="/" target="_blank" rel="noreferrer" className="hidden items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 sm:flex"><Store size={16} />View store</a>
            <button onClick={logout} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden" aria-label="Sign out"><LogOut size={18} /></button>
          </div>
        </header>

        <div className="p-5 md:p-8">
          {view === 'overview' && <Overview totalStock={totalStock} lowStock={lowStock} setView={setView} />}
          {view === 'products' && <Products query={query} setQuery={setQuery} products={filteredProducts} />}
          {view === 'orders' && <Orders />}
          {view === 'customers' && <Customers />}
          {view === 'security' && <Security />}
        </div>
      </main>
    </div>
  )
}

function Overview({ totalStock, lowStock, setView }: { totalStock: number; lowStock: number; setView: (view: View) => void }) {
  const stats = [
    { label: 'Catalog items', value: products.length, icon: Package, color: 'bg-secondary text-primary' },
    { label: 'Available stock', value: totalStock, icon: Boxes, color: 'bg-blue-100 text-blue-700' },
    { label: 'WhatsApp inquiries', value: '—', icon: MessageCircle, color: 'bg-green-100 text-green-700' },
    { label: 'Low stock alerts', value: lowStock, icon: CheckCircle2, color: 'bg-purple-100 text-purple-700' },
  ]
  return <section className="space-y-8">
    <div><p className="mb-1 text-sm font-semibold uppercase tracking-wider text-primary/60">LumiFoods command centre</p><h2 className="text-3xl font-bold tracking-tight">Store at a glance</h2><p className="mt-2 text-slate-500">Manage your catalog and turn customer conversations into confirmed orders.</p></div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map(({ label, value, icon: Icon, color }) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5"><div className={`mb-5 flex h-10 w-10 items-center justify-center rounded-xl ${color}`}><Icon size={20} /></div><p className="text-sm text-slate-500">{label}</p><p className="mt-1 text-2xl font-bold">{value}</p></div>)}</div>
    <div className="grid gap-6 xl:grid-cols-3">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 xl:col-span-2"><div className="mb-5 flex items-center justify-between"><div><h3 className="font-bold">Recent activity</h3><p className="text-sm text-slate-500">WhatsApp checkout is intentionally confirmed by your team.</p></div><MessageCircle className="text-green-600" size={22} /></div><div className="rounded-xl bg-slate-50 p-5"><p className="font-medium">No order events recorded yet</p><p className="mt-1 text-sm text-slate-500">When a customer checks out, WhatsApp opens with their name, phone, address, items, total, and note. Confirm payment and delivery directly in the conversation.</p></div></div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6"><h3 className="font-bold">Quick actions</h3><div className="mt-4 space-y-2"><button onClick={() => setView('products')} className="flex w-full items-center justify-between rounded-lg border border-slate-200 p-3 text-left text-sm hover:border-primary"><span>Review catalog</span><ChevronRight size={16} /></button><button onClick={() => setView('orders')} className="flex w-full items-center justify-between rounded-lg border border-slate-200 p-3 text-left text-sm hover:border-primary"><span>Open WhatsApp workflow</span><ChevronRight size={16} /></button><button onClick={() => setView('security')} className="flex w-full items-center justify-between rounded-lg border border-slate-200 p-3 text-left text-sm hover:border-primary"><span>Review security</span><ChevronRight size={16} /></button></div></div>
    </div>
  </section>
}

function Products({ query, setQuery, products: filteredProducts }: { query: string; setQuery: (value: string) => void; products: typeof products }) {
  return <section className="space-y-6"><div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><h2 className="text-2xl font-bold">Product catalog</h2><p className="mt-1 text-slate-500">Review pricing, availability, and merchandising details.</p></div><div className="relative"><Search className="absolute left-3 top-3 text-slate-400" size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 outline-none focus:ring-2 focus:ring-primary md:w-72" /></div></div><div className="overflow-hidden rounded-2xl border border-slate-200 bg-white"><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500"><tr><th className="px-5 py-4">Product</th><th className="px-5 py-4">Category</th><th className="px-5 py-4">Price</th><th className="px-5 py-4">Stock</th></tr></thead><tbody className="divide-y divide-slate-100">{filteredProducts.map((product) => <tr key={product.id}><td className="px-5 py-4 font-medium">{product.name}<p className="text-xs font-normal text-slate-500">{product.weight}</p></td><td className="px-5 py-4 text-slate-600">{product.category}</td><td className="px-5 py-4 font-semibold">{currency.format(product.price)}</td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${product.inStock ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{product.inStock ? 'Available' : 'Out of stock'}</span></td></tr>)}</tbody></table></div></div></section>
}

function Orders() {
  return <section className="space-y-6"><div><h2 className="text-2xl font-bold">WhatsApp order workflow</h2><p className="mt-1 text-slate-500">Orders are confirmed in WhatsApp so you can verify delivery and payment personally.</p></div><div className="grid gap-4 md:grid-cols-3">{[['01', 'Customer builds cart', 'Items and quantities are calculated in the browser.'], ['02', 'Details are pre-filled', 'Name, phone, address, note, and total are encoded into a WhatsApp message.'], ['03', 'Team confirms', 'Confirm availability, delivery fee, payment, and fulfilment in chat.']].map(([number, title, copy]) => <div key={number} className="rounded-2xl border border-slate-200 bg-white p-6"><span className="text-3xl font-bold text-primary">{number}</span><h3 className="mt-5 font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{copy}</p></div>)}</div><div className="rounded-2xl border border-green-200 bg-green-50 p-6"><div className="flex items-center gap-3"><MessageCircle className="text-green-700" /><div><p className="font-bold text-green-900">WhatsApp destination</p><p className="text-sm text-green-800">+234 811 133 2439</p></div></div></div></section>
}

function Customers() {
  return <section className="space-y-6"><div><h2 className="text-2xl font-bold">Customer follow-up</h2><p className="mt-1 text-slate-500">Customer records are kept in WhatsApp conversations, not copied into an unprotected database.</p></div><div className="rounded-2xl border border-slate-200 bg-white p-8 text-center"><Users className="mx-auto text-slate-300" size={38} /><h3 className="mt-4 font-bold">No customer records stored</h3><p className="mx-auto mt-2 max-w-md text-sm text-slate-500">This privacy-first setup avoids retaining names, phone numbers, and addresses on the storefront. Use WhatsApp Business labels for follow-up.</p></div></section>
}

function Security() {
  const controls = ['Signed, httpOnly admin session cookie', 'Admin routes excluded from search indexing', 'Credentials and signing secret remain server-side', 'Customer checkout data is sent only to WhatsApp', 'Checkout message uses URL encoding to prevent malformed links']
  return <section className="space-y-6"><div><h2 className="text-2xl font-bold">Security centre</h2><p className="mt-1 text-slate-500">Controls applied to the LumiFoods storefront and operations area.</p></div><div className="rounded-2xl border border-slate-200 bg-white p-6"><div className="mb-5 flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-700"><ShieldCheck size={21} /></div><div><h3 className="font-bold">Core protections enabled</h3><p className="text-sm text-slate-500">Review server environment variables before going live.</p></div></div><ul className="space-y-3">{controls.map((control) => <li key={control} className="flex items-center gap-3 text-sm"><CheckCircle2 size={17} className="shrink-0 text-green-600" />{control}</li>)}</ul></div><div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900"><p className="font-bold">Deployment checklist</p><p className="mt-2">Set ADMIN_EMAIL, ADMIN_PASSWORD, and a unique ADMIN_SESSION_SECRET of at least 32 characters in your hosting provider. Never commit your real .env.local file.</p></div></section>
}

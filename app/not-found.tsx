import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-[60vh] items-center bg-background px-4 py-20">
        <div className="mx-auto max-w-md text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-neutral/50">Error 404</p>
          <h1 className="text-3xl font-bold text-neutral md:text-4xl">This one got away</h1>
          <p className="mt-3 text-sm leading-6 text-neutral/60">
            We couldn&rsquo;t find the page you were looking for. It may have moved, or the link may be incorrect.
          </p>
          <Link
            href="/products"
            className="mt-8 inline-flex items-center gap-2 bg-primary px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:opacity-90"
          >
            Back to shop
            <ArrowRight size={16} />
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}

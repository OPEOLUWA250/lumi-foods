import Link from 'next/link'
import { ArrowRight, Mail, MessageCircle } from 'lucide-react'
import { Logo } from '@/components/logo'
import { categoryHref, shopCategories } from '@/lib/products'
import { CONTACT_EMAIL, WHATSAPP_DISPLAY, whatsappUrl } from '@/lib/site'

const linkClass = 'transition hover:text-white'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-black text-white">
      {/* Shop CTA band — a shade apart from the black footer so they don't merge */}
      <div className="bg-secondary py-12 md:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-md text-center">
            <h3 className="mb-4 text-2xl font-bold text-neutral md:text-3xl">Ready to taste the difference?</h3>
            <p className="mb-6 text-sm text-neutral/70">
              Explore our complete collection of premium fresh seafood and place your order today.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 bg-primary px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:opacity-90"
            >
              Shop now
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-16 lg:px-8">
        <div className="mb-12 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4 lg:gap-8">
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" aria-label="Lumie’s Foods home" className="mb-6 inline-block">
              <Logo tone="light" />
            </Link>
            <p className="max-w-xs text-sm text-white/70">
              Premium fresh seafood delivered straight to your door. Sustainably sourced, carefully handled.
            </p>
          </div>

          <div>
            <h5 className="mb-4 font-medium">Shop</h5>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li><Link href="/products" className={linkClass}>All Products</Link></li>
              {shopCategories.map((category) => (
                <li key={category}>
                  <Link href={categoryHref(category)} className={linkClass}>{category}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="mb-4 font-medium">Help</h5>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li><Link href="/#how-it-works" className={linkClass}>How to Order</Link></li>
              <li>
                <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  Chat with Us
                </a>
              </li>
            </ul>
          </div>

          <div className="col-span-2 lg:col-span-1">
            <h5 className="mb-4 font-medium">Get in Touch</h5>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex gap-3">
                <MessageCircle size={16} className="mt-0.5 shrink-0" />
                <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  WhatsApp: {WHATSAPP_DISPLAY}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail size={16} className="mt-0.5 shrink-0" />
                <a href={`mailto:${CONTACT_EMAIL}`} className={`${linkClass} break-all`}>
                  {CONTACT_EMAIL}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8">
          <p className="text-center text-sm text-white/60 md:text-left">
            &copy; {currentYear} Lumie’s Foods. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

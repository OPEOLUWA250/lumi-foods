'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { ArrowUp } from 'lucide-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { whatsappUrl } from '@/lib/site'
import { cn } from '@/lib/utils'

export function FloatingActionButtons() {
  const pathname = usePathname()
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 400)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // The admin area has its own chrome.
  if (pathname?.startsWith('/admin')) return null

  const tooltip =
    'pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap bg-primary px-3 py-2 text-xs font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 [@media(hover:hover)]:block'

  return (
    // Offsets clear the iPhone home indicator and Android gesture bar.
    <div className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1.25rem,env(safe-area-inset-right))] z-30 flex flex-col items-end gap-3">
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
        tabIndex={showBackToTop ? 0 : -1}
        className={cn(
          'group relative flex size-12 items-center justify-center border border-white/10 bg-primary text-white shadow-lg transition-all duration-300 hover:opacity-90',
          showBackToTop ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0',
        )}
      >
        <ArrowUp size={20} />
        <span className={tooltip}>Back to top</span>
      </button>

      <a
        href={whatsappUrl()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="group relative flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform duration-300 hover:scale-105"
      >
        <FontAwesomeIcon icon={faWhatsapp} className="size-7" />
        <span className={tooltip}>Chat with us</span>
      </a>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'

export function FloatingActionButtons() {
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const handleWhatsApp = () => {
    const whatsappUrl = 'https://wa.me/2348111332439'
    window.open(whatsappUrl, '_blank')
  }

  return (
    <>
      {/* WhatsApp Button */}
      <button
        onClick={handleWhatsApp}
        className="fixed bottom-6 right-6 z-30 w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
        aria-label="Chat with WhatsApp"
      >
        <FontAwesomeIcon icon={faWhatsapp} size="lg" />
        <span className="absolute right-16 bg-secondary text-secondary-foreground text-sm py-2 px-3 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          Chat with us
        </span>
      </button>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={handleBackToTop}
          className="fixed bottom-24 right-6 z-30 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-300 group"
          aria-label="Back to top"
        >
          <ArrowUp size={24} />
          <span className="absolute right-16 bg-secondary text-secondary-foreground text-sm py-2 px-3 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            Back to top
          </span>
        </button>
      )}
    </>
  )
}

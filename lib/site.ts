export const SITE_NAME = 'Lumie’s Foods'
export const SITE_DESCRIPTION =
  'Discover the finest quality fresh seafood delivered to your doorstep. Premium fish, shrimp, crab, and shellfish from Lumie’s Foods.'

export const WHATSAPP_NUMBER = '2348111332439'
export const WHATSAPP_DISPLAY = '+234 811 133 2439'
export const CONTACT_EMAIL = 'info@lumifoods.com'

export function whatsappUrl(message?: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}${message ? `?text=${encodeURIComponent(message)}` : ''}`
}

/**
 * Opens WhatsApp in a new tab. Some in-app browsers (Instagram, Facebook) and
 * strict popup blockers return null from window.open; fall back to navigating
 * the current tab so the order is never lost.
 */
export function openWhatsApp(message?: string) {
  const url = whatsappUrl(message)
  const opened = window.open(url, '_blank')
  if (!opened) window.location.href = url
}

const nairaNumber = new Intl.NumberFormat('en-NG', { maximumFractionDigits: 0 })

export function formatAmount(value: number) {
  return nairaNumber.format(Math.round(value))
}

export function formatNaira(value: number) {
  return `₦${formatAmount(value)}`
}

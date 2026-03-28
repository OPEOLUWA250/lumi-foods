export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-secondary text-secondary-foreground mt-20 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">L</span>
              </div>
              <span className="text-xl font-bold">LumiFoods</span>
            </div>
            <p className="text-sm opacity-80">
              Premium fresh seafood delivered straight to your door.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-base mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="opacity-80 hover:opacity-100 transition-opacity">
                  Home
                </a>
              </li>
              <li>
                <a href="/products" className="opacity-80 hover:opacity-100 transition-opacity">
                  Shop
                </a>
              </li>
              <li>
                <a href="/about" className="opacity-80 hover:opacity-100 transition-opacity">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="opacity-80 hover:opacity-100 transition-opacity">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-base mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/products?category=Fish" className="opacity-80 hover:opacity-100 transition-opacity">
                  Fish
                </a>
              </li>
              <li>
                <a href="/products?category=Shrimp" className="opacity-80 hover:opacity-100 transition-opacity">
                  Shrimp
                </a>
              </li>
              <li>
                <a href="/products?category=Crab" className="opacity-80 hover:opacity-100 transition-opacity">
                  Crab
                </a>
              </li>
              <li>
                <a href="/products?category=Shellfish" className="opacity-80 hover:opacity-100 transition-opacity">
                  Shellfish
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-base mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://wa.me/234811332439"
                  className="opacity-80 hover:opacity-100 transition-opacity"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp: +234 811-133-2439
                </a>
              </li>
              <li>
                <a href="mailto:info@lumifoods.com" className="opacity-80 hover:opacity-100 transition-opacity">
                  Email: info@lumifoods.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white border-opacity-20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <p className="opacity-80 mb-4 md:mb-0">
              © {currentYear} LumiFoods. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="opacity-80 hover:opacity-100 transition-opacity">
                Privacy Policy
              </a>
              <a href="#" className="opacity-80 hover:opacity-100 transition-opacity">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

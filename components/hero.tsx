import Link from "next/link";

export function Hero() {
  return (
    <section className="bg-gradient-to-b from-muted to-background py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-6 mb-12">
          <p className="text-primary font-semibold uppercase tracking-widest text-sm">
            Premium Quality Seafood
          </p>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground text-balance">
            Discover the Finest Fresh Seafood
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            LumiFoods brings premium quality seafood directly from the ocean to
            your table. Sustainably sourced, freshly delivered.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/products"
            className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Shop Now
          </Link>
          <Link
            href="#about"
            className="px-8 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-primary-foreground transition-all"
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
}

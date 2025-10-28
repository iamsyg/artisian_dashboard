
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative mx-auto w-full max-w-6xl px-4 pt-12 md:pt-16">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-pretty text-3xl font-semibold leading-tight md:text-5xl">
          Craft meets intelligence for{" "}
          <span className="underline decoration-[var(--color-accent)] decoration-4 underline-offset-8">sellers</span>.
        </h1>
        <p className="mt-4 text-balance text-muted-foreground leading-relaxed md:mt-6 md:text-lg">
          Artisan AI helps you turn handmade stories into sellable listings, translate across markets, and price
          fairly—without losing the soul of your craft.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row md:mt-8">
          <Button size="lg" className="w-full bg-primary text-primary-foreground hover:opacity-90 sm:w-auto">
            <a href="/protected">Start selling smarter</a>
          </Button>
          <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
            <a href="#how-it-works">See how it works</a>
          </Button>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 md:mt-14">
        {/* Decorative, artistic product imagery using placeholders */}
        <img
          src="/artisan-textiles-flatlay.jpg"
          alt="Handwoven textiles flatlay"
          className="h-full w-full rounded-lg border object-cover"
        />
        <img
          src="/handcrafted-ceramics-studio.jpg"
          alt="Handcrafted ceramics in a studio"
          className="h-full w-full rounded-lg border object-cover"
        />
        <img
          src="/woodcraft-tools-and-details.jpg"
          alt="Woodcraft tools and detailed joinery"
          className="h-full w-full rounded-lg border object-cover"
        />
        <img
          src="/artisan-jewelry-bench.jpg"
          alt="Artisan jewelry at a bench"
          className="h-full w-full rounded-lg border object-cover"
        />
      </div>
    </section>
  )
}

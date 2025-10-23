import { Button } from "@/components/ui/button"

export function CTA() {
  return (
    <section id="cta" className="mx-auto w-full max-w-6xl px-4 py-12 md:py-20">
      <div className="rounded-xl border bg-primary p-8 text-primary-foreground md:p-10">
        <h2 className="text-pretty text-2xl font-semibold md:text-3xl">Join the Artisan movement</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed opacity-90 md:text-base">
          Celebrate craft, culture, and sustainable livelihoods. Share your heritage with buyers who care.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" variant="secondary" className="bg-primary-foreground text-primary hover:opacity-90">
            <a href="/protected">Create your first listing</a>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-primary-foreground text-primary-foreground hover:opacity-90 bg-transparent"
          >
            Talk to our team
          </Button>
        </div>
      </div>
    </section>
  )
}

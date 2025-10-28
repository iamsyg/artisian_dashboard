const steps = [
  {
    n: "01",
    title: "Tell your story",
    body: "Record voice or write a few notes. We capture materials, technique, and origin.",
  },
  {
    n: "02",
    title: "Refine & translate",
    body: "Get a clear listing in multiple languages without losing tone or nuance.",
  },
  {
    n: "03",
    title: "Publish & grow",
    body: "Price with confidence, share everywhere, and reach buyers who value craft.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto w-full max-w-6xl px-4 py-12 md:py-20">
      <header className="mx-auto max-w-2xl text-center">
        <h2 className="text-balance text-2xl font-semibold md:text-3xl">How it works</h2>
        <p className="mt-3 text-muted-foreground leading-relaxed">A calm, guided flow that respects your process.</p>
      </header>

      <ol className="mt-8 grid gap-4 sm:grid-cols-3 md:mt-12">
        {steps.map((s) => (
          <li key={s.n} className="rounded-lg border p-5">
            <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-sm">
              {s.n}
            </div>
            <h3 className="text-base font-medium">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

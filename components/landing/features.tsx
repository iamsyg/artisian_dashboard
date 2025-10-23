import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    title: "Voice-to-listing",
    body: "Speak in your language. We turn your story into polished, multilingual product listings.",
  },
  {
    title: "Fair pricing guidance",
    body: "Get market-aware suggestions that respect your craft and adjust with demand and seasonality.",
  },
  {
    title: "Auto-translate & polish",
    body: "Reach buyers globally with translations that keep cultural nuance and authenticity.",
  },
  {
    title: "Ready-to-post content",
    body: "Generate captions and visuals that spotlight process, provenance, and technique.",
  },
]

export function Features() {
  return (
    <section id="features" className="mx-auto w-full max-w-6xl px-4 py-12 md:py-20">
      <header className="mx-auto max-w-2xl text-center">
        <h2 className="text-balance text-2xl font-semibold md:text-3xl">Tools designed for makers</h2>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          Everything you need to tell your story beautifully—and sell confidently.
        </p>
      </header>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 md:mt-12">
        {features.map((f) => (
          <Card key={f.title} className="border-muted">
            <CardHeader>
              <CardTitle className="text-base">{f.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground leading-relaxed">{f.body}</CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

export function Showcase() {
  return (
    <section id="showcase" className="mx-auto w-full max-w-6xl px-4 py-12 md:py-20">
      <header className="mx-auto max-w-2xl text-center">
        <h2 className="text-balance text-2xl font-semibold md:text-3xl">Made by hand. Told with care.</h2>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          A glimpse of what sellers share when craft meets clarity.
        </p>
      </header>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:mt-12">
        <img
          src="/wool-tapestry-loom.jpg"
          alt="Textured wool tapestry on a loom"
          className="h-full w-full rounded-lg border object-cover"
        />
        <img
          src="/hand-thrown-pottery.jpg"
          alt="Hand-thrown pottery with natural glazes"
          className="h-full w-full rounded-lg border object-cover"
        />
        <img
          src="/carved-wood-details.jpg"
          alt="Carved wood with intricate details"
          className="h-full w-full rounded-lg border object-cover"
        />
        <img
          src="/embroidered-textiles.jpg"
          alt="Embroidered textiles with floral motifs"
          className="h-full w-full rounded-lg border object-cover"
        />
        <img
          src="/handmade-jewelry-workbench.jpg"
          alt="Handmade jewelry at a workbench"
          className="h-full w-full rounded-lg border object-cover"
        />
        <img
          src="/leathercraft-tools.jpg"
          alt="Leathercraft tools and hand-stitched seams"
          className="h-full w-full rounded-lg border object-cover"
        />
      </div>
    </section>
  )
}

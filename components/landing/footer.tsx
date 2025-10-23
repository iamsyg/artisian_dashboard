export function Footer() {
  return (
    <footer id="contact" className="border-t">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground md:flex-row">
        <p>&copy; {new Date().getFullYear()} Artisan AI. All rights reserved.</p>
        <nav className="flex items-center gap-6" aria-label="Footer">
          <a href="#features" className="hover:opacity-80">
            Features
          </a>
          <a href="#how-it-works" className="hover:opacity-80">
            How it works
          </a>
          <a href="#showcase" className="hover:opacity-80">
            Showcase
          </a>
        </nav>
      </div>
    </footer>
  )
}

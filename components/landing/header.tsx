"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeSwitcher } from "@/components/theme-switcher";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
        <ThemeSwitcher />
        <Link href="/" aria-label="Artisan AI Home" className="font-semibold tracking-tight">
          <span className="sr-only">Artisan AI</span>
          <span aria-hidden="true" className="text-lg">
            Artisan <span className="rounded-sm px-1 py-0.5 text-primary">AI</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-6 md:flex">
          <a href="#features" className="text-sm hover:opacity-80">
            Features
          </a>
          <a href="#how-it-works" className="text-sm hover:opacity-80">
            How it works
          </a>
          <a href="#showcase" className="text-sm hover:opacity-80">
            Showcase
          </a>
          <a href="#contact" className="text-sm hover:opacity-80">
            Contact
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <a href="#how-it-works">Learn</a>
          </Button>
          <Button className="bg-primary text-primary-foreground hover:opacity-90" asChild>
            <a href="/protected">Start selling</a>
          </Button>
        </div>
      </div>
    </header>
  )
}

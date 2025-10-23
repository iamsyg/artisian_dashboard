import { Header } from "@/components/landing/header"
import { Hero } from "@/components/landing/hero"
import { Features } from "@/components/landing/features"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Showcase } from "@/components/landing/showcase"
import { CTA } from "@/components/landing/cta"
import { Footer } from "@/components/landing/footer"
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function Page() {
  return (
    <main>
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <Showcase />
      <CTA />
      <Footer />
    </main>
  )
}


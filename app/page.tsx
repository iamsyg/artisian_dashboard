import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { BackgroundBeams } from "../components/ui/background-beams";
import { TypewriterEffectSmooth } from "../components/ui/typewriter-effect";


export default function Home() {

  const words = [
    {
      text: "Connect",
    },
    {
      text: "with world market",
    },
    {
      text: "with",
    },
    {
      text: "ArtTisan AI",
      className: "text-blue-500 dark:text-blue-500",
    },
  ];

  return (
    <main className="min-h-screen flex flex-col items-center">
      
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <Link href={"/"}>Welcome to Artisan AI</Link>
              {/* Dashboard */}
                <Link href="/protected">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm transition">
                    Dashboard
                  </button>
                </Link>
              <div className="flex items-center gap-2">
              </div>
            </div>
            {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
          </div>
        </nav>
        <div className="h-screen w-screen relative flex-2 flex flex-col items-center justify-center bg-neutral-950 antialiased">
    <BackgroundBeams />
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <TypewriterEffectSmooth words={words} />
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4">
        
      </div>
    </div>

     
    </div>

        <footer className="w-full flex flex-col items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
          <p>
            Powered by{" "}
            <a
              href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
              target="_blank"
              className="font-bold hover:underline"
              rel="noreferrer"
            >
              Supabase
            </a>
          </p>
        </footer>
      
    </main>
  );
}

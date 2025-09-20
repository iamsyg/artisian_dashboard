import { ReactNode } from "react";
import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { Sidebar, SidebarBody } from "../../components/ui/sidebar";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  IconWallet,
  IconAnalyze,
  IconDashboard,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { hasEnvVars } from "@/lib/utils";
import { ThemeSwitcher } from "@/components/theme-switcher";

export const metadata = {
  title: "Protected Area",
  description: "Layout for protected pages",
};

// Helper to render a navigation button
async function NavButton({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {

  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return (
    <form action={href} method="get">
      <button
        type="submit"
        className="flex items-center gap-2 w-full p-3 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-left"
      >
        {icon}
        <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{label}</span>
      </button>
    </form>
  );
}

export default function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const buttons = [
    {
      label: "Dashboard",
      href: "/protected",
      icon: <IconDashboard className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Wallet Status",
      href: "/protected/wallets",
      icon: <IconWallet className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Analysis",
      href: "/protected/analysis",
      icon: <IconAnalyze className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
  ];

  return (
    <div
      className={cn(
        "mx-auto flex w-full flex-2 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800 h-screen"
      )}
    >
      {/* Sidebar always open */}
      <Sidebar animate={false}>
        <SidebarBody className="justify-between gap-10">
          
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            <div className="mt-8 flex flex-3 flex-col gap-4">
              {buttons.map((button, idx) => (
                <NavButton key={idx} {...button} />
              ))}
            </div>
          </div>

          <div></div>
        </SidebarBody>
      </Sidebar>

      {/* Right side content */}
      <div className="flex flex-1 flex-col h-screen rounded-tl-2xl rounded-tr-2xl overflow-hidden border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
        <header className="sticky top-0 z-10 bg-black p-6 border-b border-neutral-700 flex justify-between items-center rounded-tl-2xl rounded-tr-2xl">
          <ThemeSwitcher />
          <div className="flex space-x-4">
            {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  );
}



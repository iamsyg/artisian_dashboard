"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

function ProductLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");

  // build query string
  const query = productId ? `?id=${productId}` : "";

  const baseClasses = "px-4 py-2 rounded-md transition-colors font-medium";
  const activeClasses =
    "bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700";
  const inactiveClasses =
    "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700";

  return (
    <div className="p-6">
      {/* Navigation buttons */}
      <div className="flex gap-4 mb-6">
        <Link
          href={`/protected/product${query}`}
          className={`${baseClasses} ${
            pathname === "/protected/product" ? activeClasses : inactiveClasses
          }`}
        >
          Details
        </Link>
        <Link
          href={`/protected/product/analytics${query}`}
          className={`${baseClasses} ${
            pathname.includes("/analytics") ? activeClasses : inactiveClasses
          }`}
        >
          Analytics
        </Link>
        <Link
          href={`/protected/product/generation${query}`}
          className={`${baseClasses} ${
            pathname.includes("/generation") ? activeClasses : inactiveClasses
          }`}
        >
          Generation
        </Link>
      </div>

      {/* Render details or analytics */}
      <div className="border rounded-md p-4 bg-white dark:bg-gray-900 dark:border-gray-700">
        {children}
      </div>
    </div>
  );
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <ProductLayoutContent>{children}</ProductLayoutContent>
    </Suspense>
  );
}




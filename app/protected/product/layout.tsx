"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");

  // build query string
  const query = productId ? `?id=${productId}` : "";

  return (
    <div className="p-6">
      {/* Navigation buttons */}
      <div className="flex gap-4 mb-6">
        <Link
          href={`/protected/product${query}`}
          className={`px-4 py-2 rounded ${
            pathname === "/protected/product"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Details
        </Link>
        <Link
          href={`/protected/product/analytics${query}`}
          className={`px-4 py-2 rounded ${
            pathname.includes("/analytics")
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Analytics
        </Link>
        <Link
          href={`/protected/product/generation${query}`}
          className={`px-4 py-2 rounded ${
            pathname.includes("/generation")
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Generation
        </Link>
      </div>

      {/* Render details or analytics */}
      <div className="border rounded-md">{children}</div>
    </div>
  );
}


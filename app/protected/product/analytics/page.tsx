"use client";

import { useSearchParams } from "next/navigation";

export default function AnalyticsPage() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");

  return (
    <div>
      <h2 className="text-xl font-bold">Analytics</h2>
      <p>Showing analytics for product ID: {productId}</p>
    </div>
  );
}

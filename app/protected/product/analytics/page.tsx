export const runtime = "nodejs";

"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function AnalyticsContent() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");

  return (
    <div>
      <h2 className="text-xl font-bold">Analytics</h2>
      <p>Showing analytics for product ID: {productId}</p>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <Suspense fallback={<div>Loading analytics...</div>}>
      <AnalyticsContent />
    </Suspense>
  );
}

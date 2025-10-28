export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server"; // adjust path if needed

export async function POST(req: Request) {
  console.log("🚀 /api/protected called");
  try {
    const supabase = await createClient();

    // incoming body should contain product_id + image_url
    const { product_id, image_url } = await req.json();
    console.log("➡️ Incoming request:", { product_id, image_url });

    if (!product_id || !image_url) {
      return NextResponse.json(
        { error: "Missing product_id or image_url" },
        { status: 400 }
      );
    }

    // 1. Call your AI service
    const res = await fetch(
      "https://imagedescription-533908603677.us-central1.run.app/describe-url",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_url }),
      }
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("❌ AI service failed:", text);
      throw new Error(`AI service error: ${res.status} ${text}`);
    }

    const aiData = await res.json();
    console.log("✅ AI service raw response:", aiData);

    // assume response looks like { description: "..." }
    const aiDescription = aiData.description || JSON.stringify(aiData);
    console.log("📌 Parsed AI description:", aiDescription);

    // 2. Update Supabase PRODUCT table
    const { data, error } = await supabase
    .from("PRODUCT")
    .update({ ai_description: aiDescription })
    .eq("id", Number(product_id))  // ✅ cast string to number
    .select();

  console.log("✅ Supabase update result:", data);

    if (error) {
      console.error("❌ Supabase update failed:", error);
      return NextResponse.json(
        { error: "Failed to update PRODUCT table" },
        { status: 500 }
      );
    }

    console.log("✅ Supabase update result:", data);

    return NextResponse.json({
      success: true,
      product_id,
      ai_description: aiDescription,
      updated: data,
    });
  } catch (err: any) {
    console.error("❌ Route error:", err);
    return NextResponse.json(
      { error: err.message || "Unexpected error" },
      { status: 500 }
    );
  }
}
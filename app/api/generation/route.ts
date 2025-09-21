// app/api/generate-ad/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { artisan_description, image_description } = await req.json();

    if (!artisan_description || !image_description) {
      return NextResponse.json(
        { error: "Missing artisan_description or image_description" },
        { status: 400 }
      );
    }

    // Build the final prompt for ad image generation
    const prompt = `
    You are creating an advertisement image for an artisan-made product.

    Product details from artisan:
    "${artisan_description}"

    Additional details from AI analysis of the product image:
    "${image_description}"

    Generate a high-quality advertisement image that:
    - Highlights the product attractively
    - Uses clean, aesthetic, and minimal design
    - Adds subtle background or props that complement the product
    - Makes the product the clear focus
    - Looks suitable for an online shop or catalog ad
    `;

    // Forward request to your image generation API
    const formData = new FormData();
    formData.append("prompt", prompt);

    const res = await fetch(
      "https://imagecreation-533908603677.us-central1.run.app/generate-image",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: `Image API error: ${res.status}` },
        { status: 500 }
      );
    }

    const blob = await res.blob();

    // Return raw image stream to frontend
    return new NextResponse(blob, {
      headers: {
        "Content-Type": "image/png", // adjust if API returns jpeg/webp
        "Content-Disposition": "inline; filename=ad-image.png",
      },
    });
  } catch (err: any) {
    console.error("Error in generate-ad route:", err);
    return NextResponse.json(
      { error: "Internal Server Error", details: err.message },
      { status: 500 }
    );
  }
}

"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ProductPage() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("PRODUCT")
        .select("*")
        .eq("id", productId)
        .single();

      if (!error) setProduct(data);
      else console.error(error);
    };

    fetchProduct();
  }, [productId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  // Generate preview image (not saving to DB yet)
  const handleGeneratePreview = async () => {
    if (!productId) return;
    setLoading(true);
    setPreviewUrl(null);

    try {
      const res = await fetch("/api/generation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artisan_description: product.description,
          image_description: product.ai_description,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error("Ad generation failed: " + errText);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
    } catch (err: any) {
      console.error(err);
      alert("Failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Confirm and save preview to Supabase
  const handleConfirmSave = async () => {
    if (!previewUrl || !productId) return;

    setLoading(true);
    try {
      const blob = await fetch(previewUrl).then((r) => r.blob());
      const filePath = `products/${productId}-ad-${Date.now()}.png`;

      const { error: uploadError } = await supabase.storage
        .from("product-photos")
        .upload(filePath, blob, {
          upsert: true,
          contentType: "image/png",
        });

      if (uploadError) throw new Error(uploadError.message);

      const { data } = supabase.storage
        .from("product-photos")
        .getPublicUrl(filePath);

      const newImageUrl = data.publicUrl;

      const { error } = await supabase
        .from("PRODUCT")
        .update({
          image_url: newImageUrl,
          description: product.description,
          ai_description: product.ai_description,
        })
        .eq("id", productId);

      if (error) throw new Error(error.message);

      setProduct((prev: any) => ({ ...prev, image_url: newImageUrl }));
      setPreviewUrl(null);

      alert("Product updated with new AI ad image!");
    } catch (err: any) {
      console.error(err);
      alert("Save failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!productId) return <p className="text-gray-400">No product selected.</p>;
  if (!product) return <p className="text-gray-400">Loading...</p>;

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-neutral-950 text-gray-900 dark:text-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <h1 className="text-2xl font-semibold">AI Image Generation for {product.name}</h1>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6">
            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                name="description"
                value={product.description || ""}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 
                       bg-white dark:bg-neutral-900 px-3 py-2 h-32 resize-none 
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* AI Description */}
            <div>
              <label className="block text-sm font-medium mb-2">AI Description</label>
              <textarea
                name="ai_description"
                value={product.ai_description || ""}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 
                       bg-white dark:bg-neutral-900 px-3 py-2 h-32 resize-none 
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Dedicated Preview Space */}
          <div className="flex flex-col items-center justify-center border border-dashed 
                          border-gray-400 dark:border-gray-700 rounded-lg p-6 min-h-[300px]">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="max-w-full max-h-[400px] object-contain rounded-md"
              />
            ) : (
              <p className="text-gray-500">Generated image will appear here</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          {previewUrl && (
            <>
              <button
                onClick={handleConfirmSave}
                disabled={loading}
                className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded-md font-medium transition disabled:opacity-50"
              >
                {loading ? "Saving..." : "Confirm & Save"}
              </button>
              <button
                onClick={() => setPreviewUrl(null)}
                className="px-6 py-2 bg-gray-500 hover:bg-gray-400 text-white rounded-md font-medium transition"
              >
                Discard
              </button>
            </>
          )}
          <button
            onClick={handleGeneratePreview}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-md font-medium transition disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate Preview"}
          </button>
        </div>
      </div>
    </div>
  );
}



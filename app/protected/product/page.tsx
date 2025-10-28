"use client";

export const runtime = "nodejs";

import { Suspense } from "react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import UploadPicture from "@/components/ui/uploadPicture";

function ProductPageContent() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  const [pendingImage, setPendingImage] = useState<File | null>(null);

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("products")
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

  const handleUpdate = async () => {
    if (!productId) return;
    setLoading(true);

    try {
      // 1️⃣ Get current authenticated user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("❌ No authenticated user found:", userError);
        alert("You must be logged in as a seller to update a product.");
        setLoading(false);
        return;
      }

      // 2️⃣ Fetch seller record for this user
      const { data: seller, error: sellerError } = await supabase
        .from("sellers")
        .select("id, is_seller")
        .eq("user_id", user.id)
        .single();

      if (sellerError || !seller) {
        console.error("❌ No seller record found:", sellerError);
        alert("You are not registered as a seller.");
        setLoading(false);
        return;
      }

      if (!seller.is_seller) {
        alert("Your seller account is not verified yet.");
        setLoading(false);
        return;
      }

      // 3️⃣ Handle image upload if pending
      let newImageUrl = product.image_url;
      if (pendingImage) {
        const filePath = `products/${productId}-${Date.now()}.png`;
        const { error: uploadError } = await supabase.storage
          .from("product-photos")
          .upload(filePath, pendingImage, { upsert: true });

        if (uploadError) {
          alert("Image upload failed: " + uploadError.message);
          setLoading(false);
          return;
        }

        const { data } = supabase.storage
          .from("product-photos")
          .getPublicUrl(filePath);

        newImageUrl = data.publicUrl;
      }

      // 4️⃣ Update the product with RLS-compliant ownership
      const { data: updatedData, error: updateError, count } = await supabase
        .from("products")
        .update({
          name: product.name,
          price: parseFloat(product.price), // ensure numeric
          description: product.description,
          image_url: newImageUrl,
          ai_description: product.ai_description,
          user_id: user.id,       // ensures user_id matches RLS
          seller_id: seller.id,   // ensures seller_id matches RLS
        }, { count: "exact" })
        .eq("id", productId);

      setLoading(false);

      if (updateError) throw updateError;

      if (count === 0) {
        alert("You can only update your own verified products.");
        return;
      }

      alert("✅ Product updated successfully!");
      setProduct((prev: any) => ({ ...prev, image_url: newImageUrl }));
      setPendingImage(null);
      setShowUploader(false);

    } catch (err: any) {
      console.error("❌ Error updating product:", err);
      alert("Update failed: " + err.message);
      setLoading(false);
    }
  };

  const handleFileSelect = (file: File | null) => {
    setPendingImage(file);
  };

  if (!productId) return <p className="text-gray-400">No product selected.</p>;
  if (!product) return <p className="text-gray-400">Loading...</p>;

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-neutral-950 text-gray-900 dark:text-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold mb-10">Edit Product</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left column */}
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={product.name || ""}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 
                       bg-white dark:bg-neutral-900 px-3 py-2 
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium mb-2">Price</label>
              <input
                type="number"
                name="price"
                value={product.price || ""}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 
                       bg-white dark:bg-neutral-900 px-3 py-2 
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

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

          {/* Right column */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-3">Image</label>
              <div className="flex items-start gap-4">
                {product.image_url && (
                  <div className="flex flex-col items-start">
                    <img
                      src={product.image_url}
                      alt="product"
                      className="w-48 h-48 object-cover rounded-lg border border-gray-300 dark:border-gray-700"
                    />
                    <span className="mt-2 text-xs text-gray-500 break-all max-w-xs">
                      {product.image_url}
                    </span>
                  </div>
                )}

                {/* Button beside image */}
                {!showUploader ? (
                  <button
                    type="button"
                    onClick={() => setShowUploader(true)}
                    className="h-10 px-4 bg-blue-600 hover:bg-blue-500 text-white text-sm 
                           rounded-md transition self-start"
                  >
                    Change Picture
                  </button>
                ) : (
                  <UploadPicture onFileSelect={handleFileSelect} />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Submit button */}
        <div className="mt-12 flex justify-end">
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-md 
                   font-medium transition disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Product"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProductPage() {
  return (
    <Suspense fallback={null}>
      <ProductPageContent />
    </Suspense>
  );
}



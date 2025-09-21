"use client";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTrigger,
} from "../../components/ui/animated-modal";

import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../components/ui/card";
import { useState, useEffect } from "react";

import AudioRecorderButton from "../../components/ui/AudioRecorderButton";
import UploadPicture from "../../components/ui/uploadPicture";
import { createClient } from "../../lib/supabase/client";
import { useRouter } from "next/navigation";

export default function ProtectedPage() {
  const supabase = createClient();
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);

  const fetchProducts = async () => {
    const { data, error } = await supabase.from("PRODUCT").select("*");
    if (error) {
      console.error("❌ Error fetching products:", error);
    } else {
      setProducts(data || []);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const [formData, setFormData] = useState({
    productName: "",
    productPrice: "",
    productPhoto: null as File | null,
    language: "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;

    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDelete = async (productId: number) => {
    try {
      const { error } = await supabase
        .from("PRODUCT")
        .delete()
        .eq("id", productId);

      if (error) {
        console.error("❌ Error deleting product:", error);
        alert("Failed to delete product.");
      } else {
        alert("Product deleted successfully!");
        fetchProducts();
      }
    } catch (err) {
      console.error("❌ Unexpected error:", err);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      let photoUrl: string | null = null;
      if (formData.productPhoto) {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("product-photos")
          .upload(
            `products/${Date.now()}-${formData.productPhoto.name}`,
            formData.productPhoto
          );

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("product-photos")
          .getPublicUrl(uploadData.path);

        photoUrl = publicUrlData.publicUrl;
      }

      const { data: inserted, error } = await supabase
        .from("PRODUCT")
        .insert([
          {
            name: formData.productName,
            price: formData.productPrice,
            description: formData.description,
            image_url: photoUrl,
            language: formData.language,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      if (inserted) {
        try {
          const res = await fetch("/api/protected", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              product_id: inserted.id,
              image_url: inserted.image_url,
            }),
          });

          const result = await res.json();
          console.log("AI route result:", result);
        } catch (err) {
          console.error("❌ Failed to call AI route:", err);
        }
      }

      await fetchProducts();

      setFormData({
        productName: "",
        productPrice: "",
        productPhoto: null,
        language: "",
        description: "",
      });
    } catch (err) {
      console.error("❌ Error submitting form:", err);
    }
  };

  return (
    <div className="py-20 flex flex-col items-center justify-start w-full bg-neutral-50 dark:bg-neutral-900 transition-colors">
      {/* Modal Section */}
      <Modal>
        <ModalTrigger className="bg-neutral-800 dark:bg-neutral-200 text-white dark:text-black flex justify-top group/modal-btn rounded-lg shadow hover:opacity-90 transition">
          <div className="w-20 h-20 rounded-md flex items-center justify-center">
            <span className="text-6xl font-bold leading-none flex items-center mb-2">
              +
            </span>
          </div>
        </ModalTrigger>

        <ModalBody>
          <ModalContent>
            <form className="flex flex-col items-center gap-6 p-6 w-full max-w-md mx-auto">
              <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">
                Let's add a new product
              </h2>

              {/* Product Name */}
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                placeholder="Enter product name"
                className="w-full p-2 rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-400"
              />

              {/* Product Price */}
              <div className="w-full flex items-center rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus-within:ring-2 focus-within:ring-neutral-400">
                <span className="px-3 text-neutral-500">₹</span>
                <input
                  type="number"
                  name="productPrice"
                  value={formData.productPrice}
                  onChange={handleChange}
                  placeholder="Enter product price"
                  className="w-full p-2 bg-transparent text-inherit focus:outline-none"
                />
              </div>

              {/* Upload Photo */}
              <div className="flex flex-col items-center">
                <UploadPicture
                  onFileSelect={(file) =>
                    setFormData({ ...formData, productPhoto: file })
                  }
                />
              </div>

              {/* Language Selector */}
              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="w-full p-2 rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
              >
                <option value="" disabled>
                  Choose your preferred language
                </option>
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="es">Spanish</option>
              </select>

              {/* AI / Record Audio buttons */}
              <div className="flex justify-center items-start w-full relative">
                <span className="absolute left-1/2 transform -translate-x-1/2 top-10 text-neutral-500 p-3">
                  OR
                </span>
                <AudioRecorderButton />
              </div>

              {/* Description */}
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Write description yourself"
                className="w-full h-24 p-3 mt-5 rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 resize-none focus:outline-none focus:ring-2 focus:ring-neutral-400"
              ></textarea>
            </form>
          </ModalContent>

          <ModalFooter className="gap-4">
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-neutral-800 text-white dark:bg-neutral-200 dark:text-black text-sm px-4 py-2 rounded-md border border-transparent hover:opacity-90 transition w-28"
            >
              Done
            </button>
          </ModalFooter>
        </ModalBody>
      </Modal>

      {/* Product Cards Section */}
      <div className="w-full max-w-5xl px-6 mt-12 flex flex-wrap justify-center gap-6">
        {products.map((product) => (
          <Card
            key={product.id}
            className="bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-700 w-64 shadow-sm hover:shadow-md transition"
          >
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
              <CardDescription className="text-neutral-600 dark:text-neutral-400">
                ₹{product.price}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {product.image_url && (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-md mb-3"
                />
              )}
              <p className="text-sm text-neutral-700 dark:text-neutral-300">
                {product.description}
              </p>
            </CardContent>

            <CardFooter className="flex flex-col justify-between">
              {/* Language Info */}
              <span className="text-xs text-neutral-500 mb-3">
                Language: {product.language}
              </span>

              {/* Action Buttons */}
              <div className="flex flex-row gap-2 items-end">
                <button
                  className="px-3 py-1 text-xs bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-800 dark:text-neutral-100 rounded transition"
                  onClick={() =>
                    router.push(`/protected/product?id=${product.id}`)
                  }
                >
                  Expand
                </button>

                <button
                  onClick={() => handleDelete(product.id)}
                  className="px-3 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded transition"
                >
                  Delete
                </button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}


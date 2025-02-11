"use client";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { createProduct } from "./actions";

export default function CreateProductPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const errorMessage = searchParams.get("errorMessage");

  const handleImageUpload = async () => {
    if (!image) return "";

    const formData = new FormData();
    formData.append("file", image);
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    if (!uploadPreset || !cloudName) {
      setError("Cloudinary environment variables are missing");
      return "";
    }

    formData.append("upload_preset", uploadPreset);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error?.message || "Image upload failed");
        return "";
      }

      return data.secure_url;
    } catch {
      setError("Error uploading image");
      return "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!name || !description || !price || !category) {
        setError("All fields except image are required.");
        setLoading(false);
        return;
      }

      const imageUrl = await handleImageUpload();

      await createProduct(
        name,
        description,
        Number(price),
        imageUrl,
        tags.trim(),
        category
      );
    } catch {
      setError("Error creating product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center py-10 bg-gray-50">
      <div className="w-full max-w-lg bg-white p-6 shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
          Create Product
        </h2>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}
        {errorMessage && (
          <p className="text-red-500 text-sm text-center mb-4">
            {errorMessage}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Product Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">
              Product Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300 h-28 resize-none"
            ></textarea>
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Image</label>
            <input
              type="file"
              accept="image/*"
              className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setImage(e.target.files[0]);
                }
              }}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Product"}
          </button>
        </form>
      </div>
    </div>
  );
}

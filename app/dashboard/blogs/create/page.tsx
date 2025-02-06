"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { createBlog } from "./actions";

export default function CreateBlogPage() {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false); // Added loading state

  const searchParams = useSearchParams();
  const errorMessage = searchParams.get("errorMessage");

  // Function to handle image upload to Cloudinary
  const handleImageUpload = async () => {
    if (!image) return "";

    const formData = new FormData();
    formData.append("file", image);
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    if (!uploadPreset || !cloudName) {
      throw new Error("Cloudinary environment variables are missing");
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
        console.error("Cloudinary Error Response:", data);
        throw new Error(data.error?.message || "Image upload failed");
      }

      console.log("Cloudinary Response:", data);
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      return "";
    }
  };

  // Function to handle form submission and create a blog post
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const imageUrl = await handleImageUpload();

      await createBlog(name, content, imageUrl);
      // Redirect or show success message after successful blog creation
    } catch (error) {
      console.error("Error creating blog:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto w-full p-5">
      <h1 className="text-2xl font-semibold mb-4">Create a New Blog</h1>
      {errorMessage && (
        <div className="bg-red-200 text-red-700 p-4 rounded mb-4">
          {errorMessage}
        </div>
      )}
      <div className="space-y-4">
        <input
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded w-full"
          placeholder="Blog Title"
        />
        <textarea
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border p-2 rounded w-full"
          placeholder="Blog Content"
          rows={6}
        />
        <input
          type="file"
          onChange={(e) => setImage(e.target.files?.[0] ?? null)}
          className="w-full border p-2 rounded"
        />
        <div className="flex gap-4">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Blog"}
          </button>
        </div>
      </div>
    </div>
  );
}

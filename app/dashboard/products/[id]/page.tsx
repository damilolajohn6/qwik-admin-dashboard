"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchProductById } from "@/api/products";
import { deleteProductById, updateProduct } from "./actions";
import ProductListItem from "../ProductListItem";

export default function ProductPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const [product, setProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedData, setUpdatedData] = useState({
    name: "",
    price: 0,
    description: "",
    tag: "",
    category: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Fetch product data on component mount
  useEffect(() => {
    async function fetchProduct() {
      setIsLoading(true);
      try {
        const data = await fetchProductById(Number(id));
        setProduct(data);
        setUpdatedData({
          name: data.name,
          price: data.price,
          description: data.description,
          category: data.category,
          tag: data.tag,
        });
      } catch (err) {
        setError("Failed to fetch product details.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  // Handle product deletion
  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this product?")) {
      setIsLoading(true);
      try {
        await deleteProductById(Number(id));
        router.push("/dashboard/products");
      } catch (err) {
        setError("Failed to delete product.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle form field change
  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUpdatedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle update product
  const handleUpdate = async () => {
    setIsLoading(true);
    console.log(updatedData); // Debugging the updated data
    try {
      // Call the updateProduct function with the updated data
      const updatedProduct = await updateProduct(Number(id), updatedData);

      // Update the local state with the updated product data
      setProduct(updatedProduct);
      setIsEditing(false); // Exit edit mode
    } catch (err) {
      setError("Failed to update product.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!product) return <div>Product not found.</div>;

  return (
    <div className="max-w-screen-xl h-auto mx-auto w-full p-5">
      {!isEditing ? (
        <>
          <ProductListItem product={product} />
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <input
            type="text"
            name="name"
            value={updatedData.name}
            onChange={handleFieldChange}
            className="border p-2 rounded w-full"
            placeholder="Product Name"
          />
          <input
            type="number"
            name="price"
            value={updatedData.price}
            onChange={handleFieldChange}
            className="border p-2 rounded w-full"
            placeholder="Product Price"
          />
          <textarea
            name="description"
            value={updatedData.description}
            onChange={handleFieldChange}
            className="border p-2 rounded w-full"
            placeholder="Product Description"
            rows={6}
          />
          <input
            type="text"
            name="tag"
            value={updatedData.tag}
            onChange={handleFieldChange}
            className="border p-2 rounded w-full"
            placeholder="Product Tag"
          />
          <input
            type="text"
            name="category"
            value={updatedData.category}
            onChange={handleFieldChange}
            className="border p-2 rounded w-full"
            placeholder="Product Category"
          />
          <div className="flex gap-4">
            <button
              onClick={handleUpdate}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Save Changes
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <div className="h-20 my-10"></div>
    </div>
  );
}

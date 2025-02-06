"use server";

import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function deleteProductById(id: number) {
  const token = cookies().get("token")?.value;

  if (!token) {
    throw new Error("Unauthorized: No token found");
  }

  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `${token}`,
    },
  });

  if (!res.ok) {
    console.error(await res.text());
    throw new Error("Error deleting product");
  }
  return res.json();
}


interface ProductData {
  name: string;
  price: number;
  description?: string;
  tag: string;
  category: string;
}

export async function updateProduct(id: number, productData: ProductData) {
  const token = cookies().get("token")?.value;

  if (!token) {
    throw new Error("Unauthorized: No token found");
  }

  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to update product");
  }
  return res.json();
}

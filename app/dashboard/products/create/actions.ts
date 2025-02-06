"use server";

import { API_URL } from "@/config";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createProduct(
  name: string,
  description: string,
  price: number,
  Image: string, // Change from imageUrl to Image
  tag: string, // Change from tags array to a single string
  category: string
) {
  let redirectUrl = "/dashboard/products";
  try {
    const token = cookies().get("token")?.value;

    const res = await fetch(`${API_URL}/products`, {
      method: "POST",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        description,
        price,
        Image, // Make sure this matches the schema
        tag, // Send as string, not an array
        category,
      }),
    });

    if (!res.ok) {
      if (res.status === 401) {
        cookies().delete("token");
        redirectUrl = "/login";
      } else {
        throw new Error("Failed to create product");
      }
    }
  } catch (error) {
    redirectUrl = `/dashboard/products/create?errorMessage=${encodeURIComponent(
      "Failed to create product"
    )}`;
  } finally {
    redirect(redirectUrl);
  }
}

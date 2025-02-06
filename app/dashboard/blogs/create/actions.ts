"use server";

import { API_URL } from "@/config";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createBlog(
  name: string,
  content: string,
  Image: string,
) {
  let redirectUrl = "/dashboard/blogs";
  try {
    const token = cookies().get("token")?.value;

    const res = await fetch(`${API_URL}/blogs`, {
      method: "POST",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        content,
        Image,
      }),
    });

    if (!res.ok) {
      if (res.status === 401) {
        cookies().delete("token");
        redirectUrl = "/login";
      } else {
        throw new Error("Failed to create blog");
      }
    }
  } catch {
    redirectUrl = `/dashboard/blogs/create?errorMessage=${encodeURIComponent(
      "Failed to create blog"
    )}`;
  } finally {
    redirect(redirectUrl);
  }
}

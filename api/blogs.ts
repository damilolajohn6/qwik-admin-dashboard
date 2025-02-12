import { API_URL } from '@/config';

export async function fetchBlogs() {
  const res = await fetch(`${API_URL}/blogs`, { cache: "no-store" });
  const data = await res.json();
  if (!res.ok) {
    throw new Error("Error");
  }
  return data;
}

export async function fetchBlog(id: number) {
  const res = await fetch(`${API_URL}/blogs/${id}`, { cache: "no-store" });
  const data = await res.json();
  if (!res.ok) {
    throw new Error("Error");
  }
  return data;
}

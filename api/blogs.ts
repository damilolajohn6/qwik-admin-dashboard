import { API_URL } from '@/config';
import { cookies } from 'next/headers';

export async function fetchBlogs() {
  try {
    const token = cookies().get('token')?.value;

    const response = await fetch(`${API_URL}/blogs`, {
      headers: {
        Authorization: token ?? '',
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      console.error(response);
      throw new Error('Failed to fetch orders');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function fetchBlog(id: number) {
  try {
    const token = cookies().get('token')?.value;

    const response = await fetch(`${API_URL}/blogs/${id}`, {
      headers: {
        Authorization: token ?? '',
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      console.error(response);
      throw new Error('Failed to fetch orders');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

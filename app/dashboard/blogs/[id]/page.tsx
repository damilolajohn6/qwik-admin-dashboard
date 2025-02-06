// eslint-disable-
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ListBlog from "../ListBlogs";
import { fetchBlog } from "@/api/blogs";
import { deleteBlogById, updateBlog } from "./actions";

export default function BlogPage({
  params: { id },
}: {
  params: { id: string };
}) {
  interface Blog {
    id: number;
    name: string;
    content: string;
    Image: string;
  }

  const [blog, setBlog] = useState<Blog | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedData, setUpdatedData] = useState({
    name: "",
    content: "",
    Image: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Fetch blog data on component mount
  useEffect(() => {
    async function fetchBlogData() {
      setIsLoading(true);
      try {
        const data = await fetchBlog(Number(id));
        setBlog(data);
        setUpdatedData({
          name: data.name,
          content: data.content,
          Image: data.Image
        });
      } catch (err) {
        setError("Failed to fetch blog details.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchBlogData();
  }, [id]);

  // Handle blog deletion
  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this blog?")) {
      setIsLoading(true);
      try {
        await deleteBlogById(Number(id));
        router.push("/dashboard/blogs");
      } catch (err) {
        setError("Failed to delete blog.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle form field change for updating blog
  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUpdatedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle update blog
  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const updatedBlog = await updateBlog(Number(id), updatedData);

      // Update the local state with the updated blog data
      setBlog(updatedBlog);
      setIsEditing(false); // Exit edit mode
    } catch (err) {
      setError("Failed to update blog.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!blog) return <div>Blog not found.</div>;

  return (
    <div className="max-w-screen-xl mx-auto w-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Blog Details</h1>
        <div>
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-4"
          >
            Edit Blog
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Delete Blog
          </button>
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <input
            type="text"
            name="name"
            value={updatedData.name}
            onChange={handleFieldChange}
            className="border p-2 rounded w-full"
            placeholder="Blog Title"
          />
          <textarea
            name="content"
            value={updatedData.content}
            onChange={handleFieldChange}
            className="border p-2 rounded w-full"
            placeholder="Blog Content"
            rows={6}
          />
          <div className="flex gap-4">
            <button
              onClick={handleUpdate}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Blog"}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        <ListBlog blog={blog} />
      )}
    </div>
  );
}

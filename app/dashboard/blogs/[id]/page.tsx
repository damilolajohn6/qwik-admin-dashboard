import ListBlog from "../ListBlogs";
import { fetchBlog } from "@/api/blogs";

export default async function BlogPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const blog = await fetchBlog(Number(id));

  return (
    <div className="max-w-screen-xl mx-auto w-full">
      <ListBlog blog={blog} />
    </div>
  );
}



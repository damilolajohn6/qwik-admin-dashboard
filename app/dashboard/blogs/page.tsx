import { fetchBlogs } from "@/api/blogs";
import ListBlog from "./ListBlogs";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { AddIcon, Icon } from "@/components/ui/icon";

export default async function BlogsPage() {
  const blogs = await fetchBlogs();

  return (
    <div className="flex flex-row flex-wrap gap-4 max-w-[1400px] w-full">
      <Link
        href="/dashboard/blogs/create"
        className="flex flex-1 min-w-[300px]"
      >
        <Card className="w-full h-full p-5 flex items-center justify-center">
          <Icon as={AddIcon} className="w-10 h-10 color-slate-400" />
        </Card>
      </Link>

      {blogs.map((blog) => (
        <ListBlog key={blog.id} blog={blog} />
      ))}
    </div>
  );
}

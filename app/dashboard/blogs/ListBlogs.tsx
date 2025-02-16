import { Card } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import Link from "next/link";

interface Blog {
  id: number;
  Image: string;
  name: string;
  content: string;
}

export default function ListBlog({ blog }: { blog: Blog }) {
  // Function to generate a content excerpt
  const getExcerpt = (text: string, length: number) => {
    if (text.length <= length) return text;
    return text.slice(0, length) + "...";
  };

  return (
    <Link
      href={`/dashboard/blogs/${blog.id}`}
      className="flex flex-1 min-w-[300px]"
    >
      <Card className="p-5 rounded-lg flex-1">
        <Image
          source={{
            uri: blog.Image,
          }}
          className="mb-6 h-[240px] w-full rounded-md"
          alt={`${blog.name} image`}
          resizeMode="contain"
        />
        <Text className="text-3xl font-normal mb-2 text-typography-700">
          Title: {blog.name}
        </Text>
        <Text className="text-sm mb-2 text-typography-600">
          Content: {getExcerpt(blog.content, 100)}
        </Text>
      </Card>
    </Link>
  );
}

import { Card } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import Link from "next/link";

export default function ProductListItem({ product }) {
  return (
    <div className="p-4">
      <Link
        href={`/dashboard/products/${product.id}`}
        className="flex flex-1 min-w-[300px]"
      >
        <Card className="p-5 rounded-lg flex-1">
          <Image
            source={{
              uri: product.Image, // Adjust this to the correct field name
            }}
            className="mb-6 h-[240px] w-full rounded-md"
            alt={`${product.name} image`}
            resizeMode="contain"
          />
          <Text className="text-sm font-normal mb-2 text-typography-700">
            {product.name}
          </Text>
          <Heading size="md" className="mb-2">
            ₦{product.price}
          </Heading>
          <Text className="text-sm mb-2 text-typography-600">
            Category: {product.category}
          </Text>
          <Text className="text-sm mb-2 text-typography-600">
            Tags: {product.tag}
          </Text>
          <Text className="text-sm mb-2 text-typography-600">
            Description: {product.description}
          </Text>
        </Card>
      </Link>
    </div>
  );
}

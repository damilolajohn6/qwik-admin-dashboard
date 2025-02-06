"use client";
import { Box } from "@/components/ui/box";
import { FormControl } from "@/components/ui/form-control";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Input, InputField } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { createProduct } from "./actions";

export default function CreateProductPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const errorMessage = searchParams.get("errorMessage");

  const handleImageUpload = async () => {
    if (!image) return "";

    const formData = new FormData();
    formData.append("file", image);
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    if (!uploadPreset || !cloudName) {
      throw new Error("Cloudinary environment variables are missing");
    }

    formData.append("upload_preset", uploadPreset);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error("Cloudinary Error Response:", data);
        throw new Error(data.error?.message || "Image upload failed");
      }

      console.log("Cloudinary Response:", data);
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      return "";
    }
  };



  const handleSubmit = async () => {
    setLoading(true);
    try {
      const imageUrl = await handleImageUpload();

      await createProduct(
        name,
        description,
        Number(price),
        imageUrl,
        tags.trim(), // Convert tags to a single string
        category
      );
    } catch (error) {
      console.error("Error creating product:", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen py-10 mb-10">
      <Box className="flex-1  flex justify-center items-center p-4 bg-gray-50">
        <FormControl
          isInvalid={!!errorMessage}
          className="p-6 border rounded-xl max-w-[500px] w-full border-gray-300 bg-white shadow-md sm:p-8 md:max-w-[600px] lg:max-w-[700px] m-2"
        >
          <VStack space="xl">
            <Heading className="text-gray-900 text-2xl font-bold pt-3 text-center">
              Create Product
            </Heading>

            <VStack space="xs">
              <Text className="text-gray-700 font-medium">Name</Text>
              <Input>
                <InputField value={name} onChangeText={setName} type="text" />
              </Input>
            </VStack>

            <VStack space="xs">
              <Text className="text-gray-700 font-medium">Description</Text>
              <Input>
                <InputField
                  value={description}
                  onChangeText={setDescription}
                  type="text"
                />
              </Input>
            </VStack>

            <VStack space="xs">
              <Text className="text-gray-700 font-medium">Price</Text>
              <Input>
                <InputField
                  value={price}
                  onChangeText={setPrice}
                  type="number"
                />
              </Input>
            </VStack>

            <VStack space="xs">
              <Text className="text-gray-700 font-medium">Category</Text>
              <Input>
                <InputField
                  value={category}
                  onChangeText={setCategory}
                  type="text"
                />
              </Input>
            </VStack>

            <VStack space="xs">
              <Text className="text-gray-700 font-medium">
                Tags (comma-separated)
              </Text>
              <Input>
                <InputField value={tags} onChangeText={setTags} type="text" />
              </Input>
            </VStack>

            <VStack space="xs">
              <Text className="text-gray-700 font-medium">Image</Text>
              <Input>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full text-gray-700"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setImage(e.target.files[0]);
                    }
                  }}
                />
              </Input>
            </VStack>

            {errorMessage && (
              <Text className="text-red-500 text-sm text-center">
                {errorMessage}
              </Text>
            )}

            <Button
              onPress={handleSubmit}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
              disabled={loading}
            >
              <ButtonText>{loading ? "Saving..." : "Save Product"}</ButtonText>
            </Button>
          </VStack>
        </FormControl>
      </Box>
      <div className='h-20 bg-gray-100'></div>
    </div>
  );
}

"use client";

import { Avatar, AvatarFallbackText } from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import Link from "next/link";
import { deleteCookie } from "cookies-next";
import { Icon, MenuIcon, StarIcon, ThreeDotsIcon } from "@/components/ui/icon";
import { Power } from "lucide-react"; // Importing Power icon

type DashboardLayoutClientProps = {
  children: React.ReactNode;
};

export default function DashboardLayoutClient({
  children,
}: DashboardLayoutClientProps) {
  const handleLogout = () => {
    deleteCookie("token");
    window.location.href = "/login"; // Use window.location for Client-side redirect
  };

  return (
    <div className="h-screen overflow-hidden">
      <Header handleLogout={handleLogout} />
      <HStack className="h-full">
        <Sidebar />
        <Box className="flex-1 overflow-y-auto bg-gray-100 p-3">{children}</Box>
      </HStack>
      <MobileNavbar />
    </div>
  );
}

function Header({ handleLogout }: { handleLogout: () => void }) {
  return (
    <HStack className="p-3 border-b justify-between items-center flex flex-1">
      <Heading>Dashboard</Heading>
      <HStack className="gap-3 items-center">
        <Avatar>
          <AvatarFallbackText>VS</AvatarFallbackText>
        </Avatar>
        <button
          onClick={handleLogout}
          className="text-red-500 hover:text-red-700 cursor-pointer flex items-center gap-1"
        >
          <Power size={18} /> Logout
        </button>
      </HStack>
    </HStack>
  );
}

function Sidebar() {
  return (
    <VStack className="p-3 pr-10 border-r gap-3 hidden md:flex">
      <Link href="/dashboard">
        <Text>Dashboard</Text>
      </Link>
      <Link href="/dashboard/products">
        <Text>Products</Text>
      </Link>
      <Link href="/dashboard/blogs">
        <Text>Blogs</Text>
      </Link>
      <Link href="/dashboard/orders">
        <Text>Orders</Text>
      </Link>
    </VStack>
  );
}

function MobileNavbar() {
  return (
    <HStack className="p-3 pr-10 border-t gap-3 absolute bottom-0 left-0 right-0 bg-white justify-between md:hidden">
      <Link href="/dashboard">
        <Icon as={MenuIcon} />
      </Link>
      <Link href="/dashboard/products">
        <Icon as={StarIcon} />
      </Link>
      <Link href="/dashboard/orders">
        <Icon as={ThreeDotsIcon} />
      </Link>
    </HStack>
  );
}

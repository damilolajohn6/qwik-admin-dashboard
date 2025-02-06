import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardLayoutClient from "./DashboardLayoutClient";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const token = cookies().get("token")?.value;

  // Redirect to login if no token is found
  if (!token) {
    redirect("/login");
  }

  // Pass the token to the Client Component
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}

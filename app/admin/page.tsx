import AdminDashboard from "@/components/admin/AdminDashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | Tech Society",
  description: "Membership management.",
};

export default function AdminPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 xl:px-24 max-w-[var(--container-width)] mx-auto relative z-10">
      <AdminDashboard />
    </div>
  );
}

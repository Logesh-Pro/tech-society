import type { Metadata } from "next";
import AdminLogin from "@/components/admin/AdminLogin";

export const metadata: Metadata = {
  title: "Control Room Login | Tech Society",
  description: "Admin access to Tech Society.",
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 xl:px-24 flex items-center justify-center max-w-[var(--container-width)] mx-auto relative z-10">
      <AdminLogin />
    </div>
  );
}

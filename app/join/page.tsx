import JoinHero from "@/components/join/JoinHero";
import ApplicationForm from "@/components/join/ApplicationForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join | Tech Society",
  description: "Apply for Tech Society membership and become part of the community.",
};

export default function JoinPage() {
  return (
    <>
      <JoinHero />
      <div className="w-full flex justify-center -mt-8 mb-12">
        <div className="w-[1px] h-24 bg-gradient-to-b from-white/20 to-transparent" />
      </div>
      <div
        id="membership-form"
        className="px-6 md:px-12 xl:px-24 pb-32 max-w-[var(--container-width)] mx-auto relative z-10"
      >
        <ApplicationForm />
      </div>
    </>
  );
}

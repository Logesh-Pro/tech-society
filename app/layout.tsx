import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import SmoothScroll from "@/components/layout/SmoothScroll";
import Navbar from "@/components/navigation/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Saveetha Tech Society",
  description: "An immersive digital experience for the Saveetha Tech Society.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SmoothScroll>
          <Navbar />
          <main>{children}</main>
        </SmoothScroll>
      </body>
    </html>
  );
}

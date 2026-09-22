import type { Metadata } from "next";
import { Inter, Space_Grotesk, Fira_Code } from "next/font/google";
import "../styles/globals.css";
import SmoothScroll from "@/components/layout/SmoothScroll";
import Navbar from "@/components/navigation/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });
const firaCode = Fira_Code({ subsets: ["latin"], variable: "--font-mono" });

import CustomCursor from "@/components/ui/CustomCursor";
import GlobalScrollProgress from "@/components/ui/GlobalScrollProgress";
import GlobalBracketField from "@/components/background/GlobalBracketField";
import TechSocietySignature from "@/components/ui/TechSocietySignature";

export const metadata: Metadata = {
  title: "TECH SOCIETY",
  description: "A community for builders, creators, and engineers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${firaCode.variable} font-sans`}>
        <CustomCursor />
        <GlobalBracketField />
        <GlobalScrollProgress />
        <TechSocietySignature />
        <SmoothScroll>
          <Navbar />
          <main>{children}</main>
        </SmoothScroll>
      </body>
    </html>
  );
}

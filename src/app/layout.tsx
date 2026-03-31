import type { Metadata } from "next";
import { Poppins, Dancing_Script } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GenImages - Free AI Image Generation",
  description: "Generate AI Images Instantly for Free. Text to image, image enhancer, product modeling, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${dancingScript.variable} h-full antialiased dark scroll-pt-32 md:scroll-pt-36`}
    >
      <body className="min-h-full flex flex-col animated-gradient-bg text-white">
        <Navbar />
        <main className="flex-1 filter-blur-sm pt-32 md:pt-36">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}


import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers/providers";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GoLedger TV Shows",
  description: "Desafio Técnico GoLedger",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={inter.className}>
        <Providers>
          <Navbar /> 
          
          <main className="min-h-screen bg-background text-foreground p-8 pt-4">
            <div className="max-w-7xl mx-auto space-y-8">
              {children}
            </div>
          </main>
          <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
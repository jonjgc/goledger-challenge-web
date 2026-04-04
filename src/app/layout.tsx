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
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <Providers>
          <Navbar /> 
          
          <main className="flex-1 bg-background text-foreground p-8 pt-4">
            <div className="max-w-7xl mx-auto space-y-8">
              {children}
            </div>
          </main>

          <footer className="border-t bg-background/95 backdrop-blur py-6 mt-auto">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <p className="text-sm text-muted-foreground">
                Goledger 2026 todos os direitos reservados
              </p>
            </div>
          </footer>

          <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
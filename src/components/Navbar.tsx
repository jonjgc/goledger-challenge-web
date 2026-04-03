"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Film, Menu, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useState, Suspense, useEffect } from "react";

function NavbarContent() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setSearchTerm(searchParams.get("q") || "");
  }, [searchParams]);

  const routes = [
    { href: "/tvshows", label: "TV Shows" },
    { href: "/seasons", label: "Seasons" },
    { href: "/episodes", label: "Episodes" },
    { href: "/watchlist", label: "Watchlist" },
  ];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("q", value);
    } else {
      params.delete("q");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <div className="flex items-center gap-2">
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="mr-2">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Abrir menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[240px] sm:w-[300px] p-6 pt-12">
                  <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
                  <div className="flex items-center gap-2 mb-8 mt-4">
                    <Film className="h-6 w-6 text-yellow-500" />
                    <span className="font-bold text-xl tracking-tight">GoLMDB</span>
                  </div>
                  <div className="flex flex-col gap-4">
                    {routes.map((route) => (
                      <Link
                        key={route.href}
                        href={route.href}
                        className={`text-sm font-medium transition-colors hover:text-primary ${
                          pathname === route.href ? "text-foreground font-bold" : "text-muted-foreground"
                        }`}
                      >
                        {route.label}
                      </Link>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Logo */}
            <Link href="/tvshows" className="flex items-center gap-2">
              <Film className="h-6 w-6 text-yellow-500" />
              <span className="font-bold text-xl tracking-tight hidden sm:block">GoLMDB</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-6">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === route.href ? "text-foreground font-semibold" : "text-muted-foreground"
                }`}
              >
                {route.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center">
            <div className="relative w-full max-w-[200px] sm:max-w-[300px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar..."
                className="w-full pl-8 bg-muted/50 border-transparent focus:bg-background focus:border-primary transition-all"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={<div className="h-16 border-b bg-background" />}>
      <NavbarContent />
    </Suspense>
  );
}
import Link from "next/link";
import { Search, Film } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tighter text-yellow-500">
          <Film className="w-6 h-6" />
          <span>GoIMDb</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link href="/tvshows" className="hover:text-foreground transition-colors">TV Shows</Link>
          <Link href="/seasons" className="hover:text-foreground transition-colors">Seasons</Link>
          <Link href="/episodes" className="hover:text-foreground transition-colors">Episodes</Link>
          <Link href="/watchlist" className="hover:text-foreground transition-colors">Watchlist</Link>
        </nav>
        <div className="flex items-center gap-2 flex-1 md:flex-initial justify-end">
          <div className="relative w-full max-w-sm hidden sm:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Buscar séries..." 
              className="pl-8 bg-muted border-none w-full lg:w-[300px]" 
            />
          </div>
          <Button variant="ghost" size="icon" className="sm:hidden">
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
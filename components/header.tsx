import Link from "next/link";
import { Film } from "lucide-react";

export function Header() {
  return (
    <header
      data-testid="header"
      className="sticky top-0 z-10 w-full bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60 border-b"
    >
      <div className="container flex h-14 items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Film className="h-6 w-6" />
          <span className="font-bold">Movie Database</span>
        </Link>
      </div>
    </header>
  );
}

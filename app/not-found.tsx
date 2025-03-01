import Link from "next/link";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <>
      <Header />
      <div className="container flex flex-col items-center justify-center min-h-[50vh] py-12 text-center">
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The page you are looking for doesn&lsquo;t exist or has been moved.
        </p>
        <Link href="/">
          <Button>Return to Home</Button>
        </Link>
      </div>
    </>
  );
}

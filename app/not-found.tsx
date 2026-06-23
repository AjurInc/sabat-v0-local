import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/landing/navigation";

export default function NotFoundPage() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="text-center space-y-6 max-w-md">
          <div className="flex justify-center">
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <AlertCircle className="w-12 h-12 text-red-500" />
            </div>
          </div>

          <div>
            <h1 className="text-5xl font-display font-bold mb-2">404</h1>
            <p className="text-3xl font-display font-bold text-foreground/50">
              Page not found
            </p>
          </div>

          <p className="text-muted-foreground">
            The page you are looking for doesn&apos;t exist or has been moved.
          </p>

          <div className="flex gap-3">
            <Link href="/dashboard" className="flex-1">
              <Button className="w-full">
                Go to Dashboard
              </Button>
            </Link>
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full">
                Go Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/landing/navigation";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <>
      <Navigation />
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="text-center space-y-6 max-w-md">
          <div className="flex justify-center">
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <AlertTriangle className="w-12 h-12 text-red-500" />
            </div>
          </div>

          <div>
            <h1 className="text-5xl font-display font-bold mb-2">500</h1>
            <p className="text-3xl font-display font-bold text-foreground/50">
              Server error
            </p>
          </div>

          <div>
            <p className="text-muted-foreground mb-2">
              Something went wrong on our end. Our team has been notified.
            </p>
            {error.digest && (
              <p className="text-xs text-muted-foreground/50 font-mono">
                Error ID: {error.digest}
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <Button onClick={reset} className="flex-1">
              Try Again
            </Button>
            <Link href="/dashboard" className="flex-1">
              <Button variant="outline" className="w-full">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

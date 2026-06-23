"use client";

import AuthenticationCard from "@/components/landing/authentication-card";
import { Navigation } from "@/components/landing/navigation";

export default function ForgotPasswordPage() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen w-full bg-gradient-to-br from-background via-background/95 to-background/90 flex items-center justify-center p-4">
        <AuthenticationCard />
      </div>
    </>
  );
}

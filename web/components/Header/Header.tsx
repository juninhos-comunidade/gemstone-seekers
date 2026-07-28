"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GemIcon } from "lucide-react";

export function Header() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/login");
  };

  const handleSignUp = () => {
    router.push("/signup/role");
  };

  return (
    <header className="bg-background/95 border-b backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-sm font-bold tracking-tight transition-opacity hover:opacity-80"
        >
          <span className="bg-primary text-primary-foreground grid size-9 place-items-center rounded-xl shadow-sm">
            <GemIcon className="size-4" />
          </span>
          <h1 className="text-base sm:text-lg">Gemstone Seekers</h1>
        </Link>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleLogin}>
            Login
          </Button>
          <Button onClick={handleSignUp} className="hidden sm:inline-flex">
            Criar conta
          </Button>
        </div>
      </div>
    </header>
  );
}

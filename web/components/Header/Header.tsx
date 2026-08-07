"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaGem } from "react-icons/fa";

export function Header() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/login");
  };

  const handleSignUp = () => {
    router.push("/signup");
  };

  return (
    <header className="bg-background/95 border-b backdrop-blur">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-3 px-3 py-3 sm:h-16 sm:px-6 sm:py-0">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2 text-sm font-bold tracking-tight transition-opacity hover:opacity-80 sm:gap-2.5"
        >
          <span className="bg-primary text-primary-foreground grid size-9 place-items-center rounded-xl shadow-sm">
            <FaGem className="size-4" />
          </span>
          <h1 className="truncate text-sm sm:text-lg">Gemstone Seekers</h1>
        </Link>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="outline"
            onClick={handleLogin}
            className="px-3 text-xs sm:text-sm"
          >
            Login
          </Button>
          <Button onClick={handleSignUp} className="px-3 text-xs sm:text-sm">
            Criar conta
          </Button>
        </div>
      </div>
    </header>
  );
}

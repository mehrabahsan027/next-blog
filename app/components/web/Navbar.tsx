"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Menu } from "lucide-react";

import { useConvexAuth } from "convex/react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { SearchInput } from "./SearchInput";
import { ThemeToggle } from "./ThemeToggle";
import { useState } from "react";

export function Navbar() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const navLinks = (
    <>
      <Link className={buttonVariants({ variant: "ghost" })} href="/" onClick={() => setOpen(false)}>
        Home
      </Link>
      <Link className={buttonVariants({ variant: "ghost" })} href="/blog" onClick={() => setOpen(false)}>
        Blog
      </Link>
      <Link className={buttonVariants({ variant: "ghost" })} href="/create" onClick={() => setOpen(false)}>
        Create
      </Link>
    </>
  );

  const authButtons = isLoading ? null : isAuthenticated ? (
    <Button
      onClick={() =>
        authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              toast.success("Logged out successfully");
              router.push("/");
              setOpen(false);
            },
            onError: (error) => {
              toast.error(error.error.message);
            },
          },
        })
      }
    >
      Logout
    </Button>
  ) : (
    <>
      <Link className={buttonVariants()} href="/auth/sign-up" onClick={() => setOpen(false)}>
        Sign up
      </Link>
      <Link
        className={buttonVariants({ variant: "outline" })}
        href="/auth/login"
        onClick={() => setOpen(false)}
      >
        Login
      </Link>
    </>
  );

  return (
    <nav className="w-full py-5 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link href="/">
          <h1 className="text-3xl font-bold">
            Next<span className="text-primary">Pro</span>
          </h1>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-2">
          {navLinks}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Desktop Search */}
        <div className="hidden md:block">
          <SearchInput />
        </div>

        {/* Desktop Auth Buttons & Theme Toggle */}
        <div className="hidden md:flex items-center gap-2">
          {authButtons}
          <ThemeToggle />
        </div>

        {/* Mobile Menu */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="flex flex-col gap-8 p-6 pt-8">
                {/* Mobile Search */}
                <SearchInput />

                {/* Mobile Navigation Links */}
                <div className="flex flex-col gap-4">
                  {navLinks}
                </div>

                {/* Mobile Auth Buttons */}
                <div className="flex flex-col gap-4">
                  {authButtons}
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </nav>
  );
}
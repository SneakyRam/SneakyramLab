"use client";

import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { UserNav } from "@/components/auth/user-nav";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ShieldHalf } from "lucide-react";

const navItems = [
  { label: "Blog", href: "/blog" },
  { label: "Learn", href: "/learn" },
  { label: "Tools", href: "/tools" },
];

export function Header() {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo />
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname?.startsWith(item.href)
                    ? "text-foreground"
                    : "text-foreground/60"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="pr-0">
                <Link href="/" className="flex items-center">
                   <ShieldHalf className="h-7 w-7 text-primary" />
                   <span className="ml-2 font-headline text-xl font-bold tracking-tighter">
                      CyberLearn Central
                   </span>
                </Link>
                <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
                    <div className="flex flex-col space-y-3">
                        {navItems.map((item) => (
                            <Link key={item.href} href={item.href} className="text-lg">
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <nav className="flex items-center">
            {loading ? (
              <div className="h-8 w-20 animate-pulse rounded-md bg-muted" />
            ) : user ? (
              <UserNav />
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link href="/login">Log In</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { UserNav } from "@/components/auth/user-nav";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ShieldHalf, X } from "lucide-react";
import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { label: "Blog", href: "/blog" },
  { label: "Dashboard", href: "/dashboard", auth: true },
];

const learnItems = [
  { label: "Beginner Path", href: "/learn/foundations-of-cybersecurity/intro-to-cyber" },
  { label: "Intermediate Path", href: "/learn/web-application-security/how-web-apps-work" },
  { label: "Advanced Path", href: "/learn/advanced-network-defense/network-architecture" },
];

const toolItems = [
  { label: "Password Checker", href: "/tools/password-strength-checker" },
  { label: "Hash Generator", href: "/tools/hash-generator" },
  { label: "Encoder/Decoder", href: "/tools/encoder-decoder" },
  { label: "File Conversion Lab", href: "/tools/file-lab" },
];

export function Header() {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled ? "border-b border-border/40 bg-background/80 backdrop-blur-lg" : ""
      )}
    >
      <div className={cn(
        "container flex items-center transition-all duration-300",
        isScrolled ? "h-14" : "h-20"
      )}>
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo />
          </Link>
          <nav className="flex items-center space-x-2 text-sm font-medium">
            <NavMenu title="Learn" items={learnItems} pathname={pathname} href="/learn" />
            <NavMenu title="Tools" items={toolItems} pathname={pathname} href="/tools" />
            {navItems.map((item) =>
              (item.auth && !user) ? null : (
                <Button key={item.href} variant="link" asChild className="text-sm font-medium">
                  <Link
                    href={item.href}
                    className={cn(
                      "transition-colors hover:text-primary",
                      pathname?.startsWith(item.href)
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                </Button>
              )
            )}
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
              <SheetContent side="left" className="w-full pr-0">
                <Link href="/" className="flex items-center p-6">
                  <Logo />
                </Link>
                <div className="my-4 flex h-[calc(100vh-8rem)] flex-col space-y-3 p-6">
                  {learnItems.map((item) => (
                    <Link key={item.href} href={item.href} className="text-lg font-medium text-foreground hover:text-primary">
                      {item.label}
                    </Link>
                  ))}
                  <div className="pt-4"></div>
                  {toolItems.map((item) => (
                    <Link key={item.href} href={item.href} className="text-lg font-medium text-foreground hover:text-primary">
                      {item.label}
                    </Link>
                  ))}
                   <div className="pt-4"></div>
                  {navItems.map((item) => (
                    <Link key={item.href} href={item.href} className="text-lg font-medium text-foreground hover:text-primary">
                      {item.label}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <Link href="/" className="flex items-center space-x-2 md:hidden">
            <Logo />
          </Link>
          <nav className="flex items-center">
            {loading ? (
              <div className="h-8 w-20 animate-pulse rounded-md bg-muted" />
            ) : user ? (
              <UserNav />
            ) : (
              <div className="hidden items-center gap-2 md:flex">
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

function NavMenu({ title, items, pathname, href }: { title: string; items: { label: string; href: string }[]; pathname: string | null, href: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="link" className={cn(
            "text-sm font-medium transition-colors hover:text-primary data-[state=open]:text-primary",
            pathname?.startsWith(href)
                ? "text-foreground"
                : "text-muted-foreground"
            )}>
          {title}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {items.map((item) => (
          <DropdownMenuItem key={item.href} asChild>
            <Link href={item.href}>{item.label}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

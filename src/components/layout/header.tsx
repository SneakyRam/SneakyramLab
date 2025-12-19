

"use client";

import Link from "next/link";
import * as React from "react";
import { cn } from "@/lib/utils";
import { useAssistant } from '@/contexts/ai-assistant-context';
import { useAuth } from "@/hooks/use-auth";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { UserNav } from "@/components/auth/user-nav";
import {
  Menu,
  Sparkles,
  BookOpen,
  Wrench,
  ChevronRight
} from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { Logo } from "../logo";

const learnComponents: { title: string; href: string; description: string }[] = [
  {
    title: "Beginner Path",
    href: "/learn/foundations-of-cybersecurity/intro-to-cyber",
    description: "Foundations of cybersecurity & ethical hacking",
  },
  {
    title: "Intermediate Path",
    href: "/learn/web-application-security/how-web-apps-work",
    description: "Web security & vulnerability understanding",
  },
  {
    title: "Advanced Path",
    href: "/learn/advanced-network-defense/network-architecture",
    description: "Network defense & blue team thinking",
  },
];

const toolComponents: { title: string; href: string; description: string }[] = [
  {
    title: "Password Strength Checker",
    href: "/tools/password-strength-checker",
    description: "Understand password security & entropy.",
  },
  {
    title: "Hash Generator",
    href: "/tools/hash-generator",
    description: "Learn how cryptographic hashing works.",
  },
  {
    title: "Encoder / Decoder",
    href: "/tools/encoder-decoder",
    description: "Base64, URL encoding explained.",
  },
  {
    title: "File Conversion Lab",
    href: "/tools/file-lab",
    description: "Safe file conversions for learning.",
  },
];

const mainNav = [
  { title: "Home", href: "/" },
  { title: "Blog", href: "/blog" },
  { title: "Dashboard", href: "/dashboard", auth: true },
];

export function Header() {
  const { user, loading } = useAuth();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const { toggleAssistant } = useAssistant();

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
        isScrolled
          ? "border-b border-border/40 bg-background/80 backdrop-blur-lg"
          : ""
      )}
    >
      <div
        className={cn(
          "container flex h-20 items-center justify-between transition-all duration-300",
          isScrolled ? "h-16" : "h-20"
        )}
      >
        <div className="flex items-center gap-6 md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col pr-0">
                <div className="p-6">
                  <Link href="/" onClick={() => setOpen(false)}>
                      <Logo />
                  </Link>
                </div>
              <nav className="flex flex-col gap-2 px-6 text-lg font-medium">
                <Link
                  href="/"
                  className="rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-accent/10 hover:text-primary"
                  onClick={() => setOpen(false)}
                >
                  Home
                </Link>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="learn" className="border-b-0">
                    <AccordionTrigger className="rounded-md px-3 py-2 text-lg font-medium text-muted-foreground transition-colors hover:bg-accent/10 hover:text-primary hover:no-underline [&[data-state=open]>svg]:text-primary [&[data-state=open]]:bg-accent/10 [&[data-state=open]]:text-primary">
                        <span>Learn</span>
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-1 pt-2 pl-6">
                      {learnComponents.map((component) => (
                        <Link
                            key={component.title}
                            href={component.href}
                            onClick={() => setOpen(false)}
                            className="rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-accent/10 hover:text-primary"
                        >
                            {component.title}
                        </Link>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                   <AccordionItem value="tools" className="border-b-0">
                    <AccordionTrigger className="rounded-md px-3 py-2 text-lg font-medium text-muted-foreground transition-colors hover:bg-accent/10 hover:text-primary hover:no-underline [&[data-state=open]>svg]:text-primary [&[data-state=open]]:bg-accent/10 [&[data-state=open]]:text-primary">
                        <span>Tools</span>
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-1 pt-2 pl-6">
                      {toolComponents.map((component) => (
                        <Link
                            key={component.title}
                            href={component.href}
                            onClick={() => setOpen(false)}
                            className="rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-accent/10 hover:text-primary"
                        >
                            {component.title}
                        </Link>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <Link
                  href="/blog"
                  className="rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-accent/10 hover:text-primary"
                  onClick={() => setOpen(false)}
                >
                  Blog
                </Link>
                {user && (
                    <Link
                        href="/dashboard"
                        className="rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-accent/10 hover:text-primary"
                        onClick={() => setOpen(false)}
                    >
                        Dashboard
                    </Link>
                )}
              </nav>
              <div className="mt-auto flex flex-col gap-2 p-6">
                {loading ? (
                    <>
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </>
                ) : user ? (
                  <UserNav />
                ) : (
                  <>
                    <Button variant="outline" asChild onClick={() => setOpen(false)}>
                      <Link href="/login">Log In</Link>
                    </Button>
                    <Button asChild onClick={() => setOpen(false)}>
                      <Link href="/signup">Sign Up</Link>
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
          <Link href="/" className="md:hidden">
            <Logo />
          </Link>
        </div>

        <div className="hidden flex-1 items-center justify-between md:flex">
          <div className="flex items-center gap-6">
            <Link href="/" className="mr-6 hidden md:flex">
                 <Logo />
            </Link>
            <NavigationMenu>
              <NavigationMenuList>
                {mainNav.map((item) =>
                  !item.auth || (item.auth && user) ? (
                    <NavigationMenuItem key={item.title}>
                      <NavigationMenuLink asChild>
                          <Link href={item.href} className={navigationMenuTriggerStyle()}>
                            {item.title}
                          </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ) : null
                )}
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Learn</NavigationMenuTrigger>
                  <NavigationMenuContent>
                     <div className="grid w-[400px] grid-cols-[1fr_2fr] p-4 md:w-[500px] lg:w-[600px]">
                        <div className="flex flex-col justify-center rounded-lg bg-gradient-to-b from-card to-card/70 p-6">
                           <BookOpen className="mb-4 h-10 w-10 text-primary" />
                           <div className="font-headline text-lg font-semibold text-primary">
                            Learning Paths
                           </div>
                           <p className="mt-1 text-sm text-muted-foreground">Structured modules to build real-world skills.</p>
                        </div>
                        <ul className="grid gap-3 p-4">
                          {learnComponents.map((component) => (
                            <ListItem
                              key={component.title}
                              title={component.title}
                              href={component.href}
                            >
                              {component.description}
                            </ListItem>
                          ))}
                        </ul>
                     </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Tools</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[400px] grid-cols-[1fr_2fr] p-4 md:w-[500px] lg:w-[600px]">
                        <div className="flex flex-col justify-center rounded-lg bg-gradient-to-b from-card to-card/70 p-6">
                           <Wrench className="mb-4 h-10 w-10 text-accent" />
                           <div className="font-headline text-lg font-semibold text-primary">
                            Practical Tools
                           </div>
                           <p className="mt-1 text-sm text-muted-foreground">Safe, client-side utilities for hands-on learning.</p>
                        </div>
                        <ul className="grid grid-cols-2 gap-3 p-4">
                          {toolComponents.map((component) => (
                            <ListItem
                              key={component.title}
                              title={component.title}
                              href={component.href}
                            >
                              {component.description}
                            </ListItem>
                          ))}
                        </ul>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleAssistant}>
                <Sparkles className="h-5 w-5" />
                <span className="sr-only">AI Tutor</span>
            </Button>
            {loading ? (
                <Skeleton className="h-10 w-28 rounded-md bg-muted" />
            ) : user ? (
              <UserNav />
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Log In</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* This div is only for layout spacing on mobile. The actual buttons/nav are rendered above. */}
        <div className="flex items-center gap-2 md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleAssistant}>
                <Sparkles className="h-5 w-5" />
                <span className="sr-only">AI Tutor</span>
            </Button>
        </div>
      </div>
    </header>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={props.href || "/"}
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent/10 focus:bg-accent/10",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">
            <span className="font-headline text-primary transition-colors group-hover:text-primary-foreground">{title}</span>
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

    

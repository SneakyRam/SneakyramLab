
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
import { Logo } from "@/components/logo";
import { UserNav } from "@/components/auth/user-nav";
import {
  Menu,
  Sparkles,
  BookOpen,
  Wrench
} from "lucide-react";
import AnimatedGradientText from "../effects/animated-gradient-text";

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
          "container flex items-center transition-all duration-300",
          isScrolled ? "h-14" : "h-20"
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
            <SheetContent side="left" className="flex flex-col">
              <nav className="flex flex-col gap-6 text-lg font-medium">
                <Link
                  href="#"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <Logo />
                </Link>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => setOpen(false)}
                >
                  Home
                </Link>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="learn" className="border-b-0">
                    <AccordionTrigger className="py-0 hover:no-underline text-muted-foreground hover:text-foreground">Learn</AccordionTrigger>
                    <AccordionContent className="pt-4 pl-4 flex flex-col gap-4">
                      {learnComponents.map((component) => (
                        <Link
                            key={component.title}
                            href={component.href}
                            onClick={() => setOpen(false)}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            {component.title}
                        </Link>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                   <AccordionItem value="tools" className="border-b-0">
                    <AccordionTrigger className="py-2 hover:no-underline text-muted-foreground hover:text-foreground">Tools</AccordionTrigger>
                    <AccordionContent className="pt-4 pl-4 flex flex-col gap-4">
                      {toolComponents.map((component) => (
                        <Link
                            key={component.title}
                            href={component.href}
                            onClick={() => setOpen(false)}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            {component.title}
                        </Link>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <Link
                  href="/blog"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => setOpen(false)}
                >
                  Blog
                </Link>
                {user && (
                    <Link
                        href="/dashboard"
                        className="text-muted-foreground hover:text-foreground"
                        onClick={() => setOpen(false)}
                    >
                        Dashboard
                    </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/" className="md:hidden">
            <Logo />
          </Link>
        </div>

        <div className="hidden md:flex md:flex-1 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="mr-6 hidden md:flex">
              <Logo />
            </Link>
            <NavigationMenu>
              <NavigationMenuList>
                {mainNav.map((item) =>
                  !item.auth || (item.auth && user) ? (
                    <NavigationMenuItem key={item.title}>
                      <Link href={item.href} legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                          {item.title}
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  ) : null
                )}
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Learn</NavigationMenuTrigger>
                  <NavigationMenuContent>
                     <div className="grid w-[400px] p-4 md:w-[500px] lg:w-[600px] grid-cols-[1fr_2fr]">
                        <div className="flex flex-col justify-center rounded-lg bg-gradient-to-b from-card to-card/70 p-6">
                           <BookOpen className="h-10 w-10 text-primary mb-4" />
                           <h3 className="font-headline text-lg font-semibold">Learning Paths</h3>
                           <p className="text-sm text-muted-foreground mt-1">Structured modules to build real-world skills.</p>
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
                    <div className="grid w-[400px] p-4 md:w-[500px] lg:w-[600px] grid-cols-[1fr_2fr]">
                        <div className="flex flex-col justify-center rounded-lg bg-gradient-to-b from-card to-card/70 p-6">
                           <Wrench className="h-10 w-10 text-accent mb-4" />
                           <h3 className="font-headline text-lg font-semibold">Practical Tools</h3>
                           <p className="text-sm text-muted-foreground mt-1">Safe, client-side utilities for hands-on learning.</p>
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
                <div className="h-8 w-20 animate-pulse rounded-md bg-muted" />
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
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent/10 focus:bg-accent/10",
            className
          )}
          {...props}
        >
          <AnimatedGradientText as="div" className="text-sm font-medium leading-none font-headline">
            {title}
          </AnimatedGradientText>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

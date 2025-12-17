
"use client";

import Link from "next/link";
import * as React from "react";
import { usePathname } from "next/navigation";
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
} from "lucide-react";

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
                        <NavigationMenuLink
                          className={navigationMenuTriggerStyle()}
                        >
                          {item.title}
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  ) : null
                )}
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Learn</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
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
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Tools</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
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
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

import { Logo } from "@/components/logo";
import { Github, Instagram } from "lucide-react";
import Link from "next/link";

const footerNav = [
    { name: "Learn", href: "/learn" },
    { name: "Blog", href: "/blog" },
    { name: "Tools", href: "/tools" },
    { name: "Dashboard", href: "/dashboard" },
];

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur-sm">
      <div className="container py-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Column 1: Logo and Motto */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <Logo />
            <p className="mt-4 text-sm text-muted-foreground">
              Learn freely. Act ethically.
            </p>
          </div>

          {/* Column 2: Navigation Links (centered on mobile) */}
          <div className="flex flex-col items-center">
            <h3 className="font-headline text-lg font-semibold">Explore</h3>
            <ul className="mt-4 space-y-2">
              {footerNav.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-muted-foreground transition-colors hover:text-primary">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Column 3: Social Links (centered on mobile) */}
          <div className="flex flex-col items-center md:items-end">
            <h3 className="font-headline text-lg font-semibold">Connect</h3>
            <div className="mt-4 flex items-center gap-4">
              <Link href="#" aria-label="Github">
                  <Github className="h-6 w-6 text-muted-foreground transition-colors hover:text-primary" />
              </Link>
              <Link href="#" aria-label="Instagram">
                  <Instagram className="h-6 w-6 text-muted-foreground transition-colors hover:text-primary" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border/40 pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Sneaky::Lab. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}

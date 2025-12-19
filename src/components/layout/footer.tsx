import { Logo } from "@/components/logo";
import { Github, Twitter } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border/40">
      <div className="container flex items-center justify-between py-6">
        <Logo />
        <div className="flex items-center gap-4">
             <p className="text-center text-sm text-muted-foreground hidden sm:block">
                Learn freely. Act ethically.
            </p>
            <Link href="#" aria-label="Github">
                <Github className="h-5 w-5 text-muted-foreground transition-colors hover:text-primary" />
            </Link>
             <Link href="#" aria-label="Twitter">
                <Twitter className="h-5 w-5 text-muted-foreground transition-colors hover:text-primary" />
            </Link>
        </div>
      </div>
    </footer>
  );
}

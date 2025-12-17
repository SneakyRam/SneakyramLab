
import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

const AnimatedGradientText = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "group relative mx-auto flex max-w-fit flex-row items-center justify-center rounded-2xl bg-white/5 p-1",
        className,
      )}
    >
      <div className="absolute inset-0 animate-gradient-fade-infinite rounded-xl bg-gradient-to-r from-primary via-accent to-primary bg-[200%_200%] opacity-30 blur-xl" />
      <h1 className="bg-gradient-to-r from-foreground/80 via-foreground to-foreground/80 bg-clip-text text-transparent">
        {children}
      </h1>
    </div>
  );
};

export default AnimatedGradientText;

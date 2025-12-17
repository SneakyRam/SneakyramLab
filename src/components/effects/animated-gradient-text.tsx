
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
    <h1
      className={cn(
        "animate-gradient-fade-infinite bg-gradient-to-r from-primary via-accent to-success bg-[200%_200%] bg-clip-text text-transparent",
        className
      )}
    >
      {children}
    </h1>
  );
};

export default AnimatedGradientText;

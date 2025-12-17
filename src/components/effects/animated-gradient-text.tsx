
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
        "bg-gradient-to-r from-primary via-accent to-success bg-[size:200%_auto] bg-clip-text text-transparent animate-[gradient-move_6s_ease-in-out_infinite]",
        className
      )}
    >
      {children}
    </h1>
  );
};

export default AnimatedGradientText;

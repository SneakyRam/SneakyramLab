
import { cn } from "@/lib/utils";
import { type ReactNode, type ElementType } from "react";

const AnimatedGradientText = ({
  children,
  className,
  as: Tag = 'h1',
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) => {
  return (
    <Tag
      className={cn(
        "bg-gradient-to-r from-primary via-accent to-success bg-[size:200%_auto] bg-clip-text text-transparent animate-[gradient-move_6s_ease-in-out_infinite]",
        className
      )}
    >
      {children}
    </Tag>
  );
};

export default AnimatedGradientText;

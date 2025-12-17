
'use client';

import { Button } from "@/components/ui/button";

interface QuickReplyButtonProps extends React.ComponentProps<typeof Button> {}

export function QuickReplyButton({ children, ...props }: QuickReplyButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      className="h-auto px-3 py-1.5 text-xs text-primary border-primary/50 hover:bg-primary/10 hover:text-primary"
      {...props}
    >
      {children}
    </Button>
  );
}

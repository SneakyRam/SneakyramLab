import { cn } from '@/lib/utils';
import { ShieldAlert } from 'lucide-react';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-center", className)}>
        <div className="w-10 h-10 bg-primary/10 border-2 border-primary/50 rounded-lg flex items-center justify-center">
            <ShieldAlert className="w-6 h-6 text-primary" />
        </div>
    </div>
  );
}

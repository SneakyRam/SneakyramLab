
import { cn } from '@/lib/utils';
import Image from 'next/image';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <Image
        src="/logo.png"
        alt="Hack the Why Logo"
        width={64}
        height={64}
        className="hexagon-clip"
        unoptimized 
      />
    </div>
  );
}

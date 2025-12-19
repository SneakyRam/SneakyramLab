
import { cn } from '@/lib/utils';
import Image from 'next/image';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <Image
        src="/logo.png"
        alt="SneakyLab Logo"
        width={56}
        height={56}
        className="drop-shadow-[0_0_8px_hsl(var(--primary)_/_0.4)]"
        unoptimized 
      />
    </div>
  );
}

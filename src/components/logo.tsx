
import { cn } from '@/lib/utils';
import Image from 'next/image';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <Image
        src="/logo.png"
        alt="SneakyLab Logo"
        width={40}
        height={40}
        className="rounded-lg"
        unoptimized // Added to help bypass cache during development
      />
    </div>
  );
}

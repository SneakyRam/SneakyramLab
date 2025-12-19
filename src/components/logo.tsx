import { cn } from '@/lib/utils';
import AnimatedGradientText from './effects/animated-gradient-text';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
        <AnimatedGradientText as="span" className="font-headline text-xl font-bold tracking-tighter">
            CyberLearn Central
        </AnimatedGradientText>
    </div>
  );
}

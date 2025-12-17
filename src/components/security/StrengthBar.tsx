import { cn } from "@/lib/utils";

export default function StrengthBar({ percent }: { percent: number }) {
  const getBarColor = () => {
    if (percent < 25) return 'bg-red-500';
    if (percent < 50) return 'bg-orange-500';
    if (percent < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
      <div
        className={cn("h-2 rounded-full transition-all duration-300 ease-out", getBarColor())}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

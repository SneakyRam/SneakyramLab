import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '../ui/label';

export default function AlgorithmInfo({
  algo,
  onValueChange,
}: {
  algo: string;
  onValueChange: (value: string) => void;
}) {
  const info: Record<string, string> = {
    'SHA-256':
      'Secure modern hash. Standard for TLS, blockchain, and password verification.',
    'SHA-512':
      'A stronger variant of SHA-256 with a longer output. Very secure.',
    MD5: 'Broken for security. Use only for legacy file checksums, not for passwords or signatures.',
  };

  return (
    <div className="grid w-full max-w-sm items-center gap-2">
      <Label htmlFor="algorithm">Algorithm</Label>
      <Select value={algo} onValueChange={onValueChange}>
        <SelectTrigger id="algorithm">
          <SelectValue placeholder="Select algorithm" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="SHA-256">SHA-256</SelectItem>
          <SelectItem value="SHA-512">SHA-512</SelectItem>
          <SelectItem value="MD5">MD5 (Insecure - Educational Only)</SelectItem>
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground">{info[algo]}</p>
    </div>
  );
}

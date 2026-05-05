import { cn } from '../../components/ui/utils';

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="size-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
        <span className="text-white font-bold text-lg">HC</span>
      </div>
      <div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          H&S
        </h1>
        <p className="text-xs text-muted-foreground">Admin Panel</p>
      </div>
    </div>
  );
}
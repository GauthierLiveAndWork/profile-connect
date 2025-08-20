import { Badge } from "@/components/ui/badge";
import { Brain, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIStatusBadgeProps {
  isAIEnabled?: boolean;
  variant?: "default" | "secondary" | "outline";
  className?: string;
}

export function AIStatusBadge({ 
  isAIEnabled = true, 
  variant = "secondary",
  className 
}: AIStatusBadgeProps) {
  if (!isAIEnabled) return null;

  return (
    <Badge 
      variant={variant} 
      className={cn(
        "inline-flex items-center gap-1 text-xs font-medium",
        "bg-gradient-to-r from-purple-500/10 to-blue-500/10",
        "border-purple-500/20 text-purple-700 dark:text-purple-300",
        "hover:from-purple-500/20 hover:to-blue-500/20",
        "transition-all duration-200",
        className
      )}
    >
      <Brain className="h-3 w-3" />
      IA
      <Sparkles className="h-3 w-3" />
    </Badge>
  );
}
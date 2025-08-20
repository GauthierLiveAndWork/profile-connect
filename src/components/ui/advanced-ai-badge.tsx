import { Badge } from "@/components/ui/badge";
import { Brain, Zap, Sparkles, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdvancedAIBadgeProps {
  engines: ('classic' | 'ai' | 'langchain' | 'openmatch')[];
  className?: string;
}

export function AdvancedAIBadge({ engines, className }: AdvancedAIBadgeProps) {
  const getEngineIcon = (engine: string) => {
    switch (engine) {
      case 'ai': return <Brain className="h-2.5 w-2.5" />;
      case 'langchain': return <Zap className="h-2.5 w-2.5" />;
      case 'openmatch': return <Cpu className="h-2.5 w-2.5" />;
      default: return <Sparkles className="h-2.5 w-2.5" />;
    }
  };

  const getEngineColor = (engine: string) => {
    switch (engine) {
      case 'ai': return 'text-purple-600 dark:text-purple-400';
      case 'langchain': return 'text-blue-600 dark:text-blue-400';
      case 'openmatch': return 'text-green-600 dark:text-green-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const hasAdvancedEngine = engines.some(e => ['ai', 'langchain', 'openmatch'].includes(e));

  if (!hasAdvancedEngine) return null;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {engines.filter(e => e !== 'classic').map((engine, index) => (
        <Badge 
          key={engine}
          variant="outline" 
          className={cn(
            "px-1.5 py-0.5 text-xs font-medium border",
            "bg-gradient-to-r from-background to-background/50",
            getEngineColor(engine),
            "border-current/20 hover:border-current/40",
            "transition-all duration-200"
          )}
        >
          <div className="flex items-center gap-1">
            {getEngineIcon(engine)}
            <span className="uppercase text-[10px] font-bold">
              {engine === 'langchain' ? 'LC' : 
               engine === 'openmatch' ? 'OM' : 
               engine.slice(0, 2)}
            </span>
          </div>
        </Badge>
      ))}
    </div>
  );
}
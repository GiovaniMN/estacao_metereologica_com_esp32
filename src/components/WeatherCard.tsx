import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface WeatherCardProps {
  title: string;
  value: string;
  unit: string;
  icon: LucideIcon;
  color: "temperature" | "humidity" | "pressure" | "altitude" | "precipitation";
  isLoading?: boolean;
}

export function WeatherCard({ 
  title, 
  value, 
  unit, 
  icon: Icon, 
  color, 
  isLoading = false 
}: WeatherCardProps) {
  const colorClasses = {
    temperature: "border-temperature/30",
    humidity: "border-humidity/30",
    pressure: "border-pressure/30",
    altitude: "border-altitude/30",
    precipitation: "border-precipitation/30",
  };

  const iconColorClasses = {
    temperature: "text-temperature",
    humidity: "text-humidity",
    pressure: "text-pressure",
    altitude: "text-altitude",
    precipitation: "text-precipitation",
  };

  return (
    <Card
      className={cn(
        "glass-card p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg",
        "border-2",
        colorClasses[color]
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            {title}
          </p>
          <div className="flex items-baseline space-x-1">
            {isLoading ? (
              <div className="h-8 w-16 bg-muted animate-pulse rounded" />
            ) : (
              <>
                <span className="text-3xl font-bold">{value}</span>
                <span className="text-lg text-muted-foreground">{unit}</span>
              </>
            )}
          </div>
        </div>
        <div
          className={cn(
            "p-3 rounded-full bg-background/50 backdrop-blur-sm",
            iconColorClasses[color]
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </Card>
  );
}

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { LucideIcon, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface WeatherCardProps {
  title: string;
  value: string;
  unit: string;
  icon: LucideIcon;
  color: "temperature" | "humidity" | "pressure" | "altitude" | "precipitation";
  isLoading?: boolean;
  children?: React.ReactNode;
}

export function WeatherCard({
  title,
  value,
  unit,
  icon: Icon,
  color,
  isLoading = false,
  children,
}: WeatherCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

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

  const getTemperatureWarning = (temp: number) => {
    if (temp <= 20) {
      return "Frio";
    }
    if (temp >= 35) {
      return "Quente";
    }
    return "Normal";
  };

  const getHumidityWarning = (humidity: number) => {
    if (humidity < 40) {
      return "Baixa";
    }
    if (humidity > 60) {
      return "Alta";
    }
    return "Normal";
  };

  const getPressureWarning = (press: number) => {
    if (press >= 980 && press <= 1030 || press > 1030) {
      return "Normal";
    }
    if (press < 980 && press >= 600) {
      return "Atenção";
    }
    if (press < 600) {
      return "Muito Baixa";
    }
  };

  const getHeightWarning = (height: number) => {
    if (height < 2400) {
      return "Segura";
    }
    if (height > 2400 && height < 4500) {
      return "Atenção";
    }
    return "Muito Alta";
  };

  const getRainWarning = (rain: number) => {
    if (rain < 40) {
      return "Baixa";
    }
    if (rain > 60) {
      return "Alta";
    }
    return "Normal";
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
          {title.toLowerCase() === "temperatura" && !isLoading && (
            <p className="text-sm text-muted-foreground">
              {getTemperatureWarning(parseFloat(value))}
            </p>
          )}
          {title.toLowerCase() === "umidade" && !isLoading && (
            <p className="text-sm text-muted-foreground">
              {getHumidityWarning(parseFloat(value))}
            </p>
          )}
          {title.toLowerCase() === "pressão" && !isLoading && (
            <p className="text-sm text-muted-foreground">
              {getPressureWarning(parseFloat(value))}
            </p>
          )}
          {title.toLowerCase() === "altitude" && !isLoading && (
            <p className="text-sm text-muted-foreground">
              {getHeightWarning(parseFloat(value))}
            </p>
          )}
          {title.toLowerCase() === "precipitação" && !isLoading && (
            <p className="text-sm text-muted-foreground">
              {getRainWarning(parseFloat(value))}
            </p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <div
            className={cn(
              "p-3 rounded-full bg-background/50 backdrop-blur-sm",
              iconColorClasses[color]
            )}
          >
            <Icon className="h-6 w-6" />
          </div>

          {/* botão só aparece se houver conteúdo extra */}
          {children && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-full hover:bg-muted/50 transition-colors"
            >
              <ChevronDown
                className={cn(
                  "h-5 w-5 text-muted-foreground transition-transform duration-300",
                  isExpanded && "rotate-180"
                )}
              />
            </button>
          )}
        </div>
      </div>

      {/* conteúdo expandido (ex: gráfico) */}
      {children && (
        <div
          className={cn(
            "transition-all duration-500 ease-in-out overflow-hidden -ml-5 ",
            isExpanded ? "max-h-screen mt-4" : "max-h-0"
          )}
        >
          {children}
        </div>
      )}
    </Card>
  );
}
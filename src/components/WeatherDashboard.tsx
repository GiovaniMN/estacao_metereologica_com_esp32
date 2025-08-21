import { useEffect, useState } from "react";
import { WeatherCard } from "./WeatherCard";
import { Thermometer, Droplets, CloudRain } from "lucide-react";
import { database } from "../firebaseConfig"; // Importa a configuração real
import { ref, onValue, off } from "firebase/database";

// A configuração do Firebase foi movida para firebaseConfig.js

interface WeatherData {
  temperatura: number;
  umidade: number;
  chuva_mm: number; // Alterado de precipitacao para chuva_mm
}

export function WeatherDashboard() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    const weatherRef = ref(database, 'sensores/'); // Caminho para os dados dos sensores

    const unsubscribe = onValue(weatherRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setWeatherData(data);
        setLastUpdate(new Date());
      }
      setIsLoading(false);
    }, (error) => {
      console.error("Erro ao buscar dados do Firebase:", error);
      setIsLoading(false);
    });

    return () => off(weatherRef, 'value', unsubscribe);
  }, []);

  const formatValue = (value: number | undefined, decimals: number = 1): string => {
    if (value === undefined || value === null) return "--";
    return value.toFixed(decimals);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Estação Meteorológica
        </h1>
        <p className="text-lg text-muted-foreground mb-2">
          Monitoramento em tempo real das condições atmosféricas
        </p>
        {lastUpdate && (
          <p className="text-sm text-muted-foreground">
            Última atualização: {lastUpdate.toLocaleString('pt-BR')}
          </p>
        )}
      </div>

      {/* Weather Cards Grid */}
      <div className="weather-grid">
        <WeatherCard
          title="Temperatura"
          value={formatValue(weatherData?.temperatura)}
          unit="°C"
          icon={Thermometer}
          color="temperature"
          isLoading={isLoading}
        />
        
        <WeatherCard
          title="Umidade"
          value={formatValue(weatherData?.umidade, 0)}
          unit="%"
          icon={Droplets}
          color="humidity"
          isLoading={isLoading}
        />
        
        <WeatherCard
          title="Pressão"
          value={formatValue(weatherData?.pressao, 2)}
          unit="hPa"
          icon={Gauge}
          color="pressure"
          isLoading={isLoading}
        />
        
        <WeatherCard
          title="Altitude"
          value={formatValue(weatherData?.altitude, 0)}
          unit="m"
          icon={Mountain}
          color="altitude"
          isLoading={isLoading}
        />
        
        {/* Weather Cards Grid */}
      <div className="weather-grid">
        <WeatherCard
          title="Temperatura"
          value={formatValue(weatherData?.temperatura)}
          unit="°C"
          icon={Thermometer}
          color="temperature"
          isLoading={isLoading}
        />
        
        <WeatherCard
          title="Umidade"
          value={formatValue(weatherData?.umidade, 0)}
          unit="%"
          icon={Droplets}
          color="humidity"
          isLoading={isLoading}
        />
        
        <WeatherCard
          title="Precipitação"
          value={formatValue(weatherData?.chuva_mm)}
          unit="mm"
          icon={CloudRain}
          color="precipitation"
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
      </div>

      {/* Configuration Notice */}
      {firebaseConfig.apiKey === "your-api-key" && (
        <div className="mt-12 p-6 glass-card border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 to-orange-500/5">
          <h3 className="text-lg font-semibold mb-2 text-yellow-700 dark:text-yellow-300">
            ⚠️ Configuração do Firebase Necessária
          </h3>
          <p className="text-sm text-muted-foreground">
            Para conectar com seus dados reais, substitua a configuração do Firebase no arquivo 
            <code className="mx-1 px-2 py-1 bg-muted rounded text-xs">WeatherDashboard.tsx</code> 
            pelos dados do seu projeto Firebase Realtime Database.
          </p>
        </div>
      )}
    </div>
  );
}
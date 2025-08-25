import { useEffect, useState } from "react";
import { WeatherCard } from "./WeatherCard";
import { Thermometer, Droplets, CloudRain, Gauge, Mountain } from "lucide-react"; // Importa os ícones
import { database } from "../firebaseConfig"; // Importa a configuração real
import { ref, onValue, off } from "firebase/database";
import TemperatureChart from "@/components/Grafico";

// A configuração do Firebase foi movida para firebaseConfig.js

interface WeatherData {
  temperatura: number;
  umidade: number;
  chuva_mm: number;
  pressao: number; // Adicionado
  altitude: number; // Adicionado
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
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
          Estação Meteorológica
        </h1>
        <p className="text-lg texto mb-2">
          Monitoramento em tempo real das condições atmosféricas
        </p>
        {lastUpdate && (
          <p className="text-sm texto">
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
        >
          <TemperatureChart />
        </WeatherCard>
        
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

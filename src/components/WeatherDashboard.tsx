import { useEffect, useState } from "react";
import { WeatherCard } from "./WeatherCard";
import { Thermometer, Droplets, CloudRain, Gauge, Mountain } from "lucide-react";
import { database } from "../firebaseConfig";
import { ref, onValue, off } from "firebase/database";
import WeatherChart from "@/components/Grafico";

interface WeatherData {
  temperatura: number;
  umidade: number;
  chuva_mm: number;
  pressao: number;
  altitude: number;
}

// Dados de exemplo para os gráficos
const tempData = [
  { time: "10:00", value: 24 },
  { time: "10:10", value: 25 },
  { time: "10:20", value: 26 },
  { time: "10:30", value: 27 },
];

const humidityData = [
  { time: "10:00", value: 60 },
  { time: "10:10", value: 62 },
  { time: "10:20", value: 61 },
  { time: "10:30", value: 63 },
];

const pressureData = [
  { time: "10:00", value: 1012.5 },
  { time: "10:10", value: 1012.8 },
  { time: "10:20", value: 1012.6 },
  { time: "10:30", value: 1013.0 },
];

const altitudeData = [
  { time: "10:00", value: 100 },
  { time: "10:10", value: 105 },
  { time: "10:20", value: 110 },
  { time: "10:30", value: 115 },
];

const precipitationData = [
  { time: "10:00", value: 0 },
  { time: "10:10", value: 0 },
  { time: "10:20", value: 2 },
  { time: "10:30", value: 5 },
];

const chartColors = {
  temperature: "hsl(25, 85%, 55%)",
  humidity: "hsl(200, 85%, 50%)",
  pressure: "hsl(270, 75%, 60%)",
  altitude: "hsl(120, 60%, 45%)",
  precipitation: "hsl(220, 85%, 55%)",
};

export function WeatherDashboard() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    const weatherRef = ref(database, "sensores/");

    const unsubscribe = onValue(
      weatherRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setWeatherData(data);
          setLastUpdate(new Date());
        }
        setIsLoading(false);
      },
      (error) => {
        console.error("Erro ao buscar dados do Firebase:", error);
        setIsLoading(false);
      }
    );

    return () => off(weatherRef, "value", unsubscribe);
  }, []);

  const formatValue = (value: number | undefined, decimals: number = 1): string => {
    if (value === undefined || value === null) return "--";
    return value.toFixed(decimals);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Conteúdo principal */}
      <main className="flex-grow">
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
                Última atualização: {lastUpdate.toLocaleString("pt-BR")}
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
              <WeatherChart
                data={tempData}
                dataKey="value"
                unit="°C"
                stroke={chartColors.temperature}
                title="Temperatura em Tempo Real"
              />
            </WeatherCard>

            <WeatherCard
              title="Umidade"
              value={formatValue(weatherData?.umidade, 0)}
              unit="%"
              icon={Droplets}
              color="humidity"
              isLoading={isLoading}
            >
              <WeatherChart
                data={humidityData}
                dataKey="value"
                unit="%"
                stroke={chartColors.humidity}
                title="Umidade em Tempo Real"
              />
            </WeatherCard>

            <WeatherCard
              title="Pressão"
              value={formatValue(weatherData?.pressao, 2)}
              unit="hPa"
              icon={Gauge}
              color="pressure"
              isLoading={isLoading}
            >
              <WeatherChart
                data={pressureData}
                dataKey="value"
                unit="hPa"
                stroke={chartColors.pressure}
                title="Pressão em Tempo Real"
              />
            </WeatherCard>

            <WeatherCard
              title="Altitude"
              value={formatValue(weatherData?.altitude, 0)}
              unit="m"
              icon={Mountain}
              color="altitude"
              isLoading={isLoading}
            >
              <WeatherChart
                data={altitudeData}
                dataKey="value"
                unit="m"
                stroke={chartColors.altitude}
                title="Altitude em Tempo Real"
              />
            </WeatherCard>

            <WeatherCard
              title="Precipitação"
              value={formatValue(weatherData?.chuva_mm)}
              unit="mm"
              icon={CloudRain}
              color="precipitation"
              isLoading={isLoading}
            >
              <WeatherChart
                data={precipitationData}
                dataKey="value"
                unit="mm"
                stroke={chartColors.precipitation}
                title="Precipitação em Tempo Real"
              />
            </WeatherCard>
          </div>
        </div>
      </main>

      {/* Footer fixado no fim */}
      <footer className="footer text-center pt-8 pb-6 border-t border-white/20 w-full">
        <p className="text-sm text-white">
          &copy; {new Date().getFullYear()} Todos os direitos reservados.
        </p>
        <div className="mt-4 text-sm text-white space-y-1">
          <p>Desenvolvedores:</p>
          <p>Adriano Fernandes Scarabelli</p>
          <p>Giovani Martinho do Nascimento</p>
        </div>
        <p className="text-xs text-white mt-4">
          Projeto desenvolvido para aprovação de horas de estágio prestadas à faculdade
        </p>
      </footer>
    </div>
  );
}

import { useEffect, useState } from "react";
import { WeatherCard } from "./WeatherCard";
import { Thermometer, Droplets, Gauge, Mountain, CloudRain } from "lucide-react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, off } from "firebase/database";

// Firebase configuration - usuário deve substituir pelos dados do seu projeto
const firebaseConfig = {
  // Substitua pela sua configuração do Firebase
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com/",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

interface WeatherData {
  temperatura: number;
  umidade: number;
  pressao: number;
  altitude: number;
  precipitacao: number;
}

export function WeatherDashboard() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    // Initialize Firebase apenas se a configuração estiver definida
    if (firebaseConfig.apiKey !== "your-api-key") {
      const app = initializeApp(firebaseConfig);
      const database = getDatabase(app);
      const weatherRef = ref(database, '/'); // ou o caminho específico dos seus dados

      const unsubscribe = onValue(weatherRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setWeatherData(data);
          setLastUpdate(new Date());
        }
        setIsLoading(false);
      });

      return () => off(weatherRef, 'value', unsubscribe);
    } else {
      // Dados mock para demonstração
      const mockData: WeatherData = {
        temperatura: 24.5,
        umidade: 65,
        pressao: 1013.25,
        altitude: 850,
        precipitacao: 2.3
      };
      
      setTimeout(() => {
        setWeatherData(mockData);
        setLastUpdate(new Date());
        setIsLoading(false);
      }, 1000);
    }
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
        
        <WeatherCard
          title="Precipitação"
          value={formatValue(weatherData?.precipitacao)}
          unit="mm"
          icon={CloudRain}
          color="precipitation"
          isLoading={isLoading}
        />
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
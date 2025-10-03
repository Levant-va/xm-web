'use client';

import { useState, useEffect } from 'react';

interface WeatherData {
  airport: string;
  name: string;
  temperature: number;
  condition: string;
  windSpeed: number;
  windDirection: number;
  visibility: number;
  pressure: number;
}

const WeatherWidget = () => {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([
    { airport: 'OMDB', name: 'Dubai Intl', temperature: 0, condition: '', windSpeed: 0, windDirection: 0, visibility: 0, pressure: 0 },
    { airport: 'OMAA', name: 'Abu Dhabi Intl', temperature: 0, condition: '', windSpeed: 0, windDirection: 0, visibility: 0, pressure: 0 },
    { airport: 'OKBK', name: 'Kuwait Intl', temperature: 0, condition: '', windSpeed: 0, windDirection: 0, visibility: 0, pressure: 0 }
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Mock weather data - in production, integrate with actual weather API
  const fetchWeatherData = async () => {
    try {
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock weather data for Middle East airports
      const mockWeatherData: WeatherData[] = [
        {
          airport: 'OMDB',
          name: 'Dubai Intl',
          temperature: Math.floor(Math.random() * 15) + 25, // 25-40°C
          condition: ['Clear', 'Partly Cloudy', 'Sunny'][Math.floor(Math.random() * 3)],
          windSpeed: Math.floor(Math.random() * 15) + 5, // 5-20 knots
          windDirection: Math.floor(Math.random() * 360),
          visibility: Math.floor(Math.random() * 5) + 8, // 8-13 km
          pressure: Math.floor(Math.random() * 20) + 1010 // 1010-1030 hPa
        },
        {
          airport: 'OMAA',
          name: 'Abu Dhabi Intl',
          temperature: Math.floor(Math.random() * 15) + 25,
          condition: ['Clear', 'Partly Cloudy', 'Sunny'][Math.floor(Math.random() * 3)],
          windSpeed: Math.floor(Math.random() * 15) + 5,
          windDirection: Math.floor(Math.random() * 360),
          visibility: Math.floor(Math.random() * 5) + 8,
          pressure: Math.floor(Math.random() * 20) + 1010
        },
        {
          airport: 'OKBK',
          name: 'Kuwait Intl',
          temperature: Math.floor(Math.random() * 15) + 25,
          condition: ['Clear', 'Partly Cloudy', 'Sunny'][Math.floor(Math.random() * 3)],
          windSpeed: Math.floor(Math.random() * 15) + 5,
          windDirection: Math.floor(Math.random() * 360),
          visibility: Math.floor(Math.random() * 5) + 8,
          pressure: Math.floor(Math.random() * 20) + 1010
        }
      ];
      
      setWeatherData(mockWeatherData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching weather data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
    
    // Refresh data every 10 minutes
    const interval = setInterval(fetchWeatherData, 600000);
    
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getWindDirection = (degrees: number) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Weather Conditions</h3>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isLoading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
          <span className="text-xs text-gray-500">
            Updated: {formatTime(lastUpdated)}
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {weatherData.map((airport) => (
            <div key={airport.airport} className="border-b border-gray-100 pb-4 last:border-b-0">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-800">{airport.airport}</h4>
                <span className="text-sm text-gray-600">{airport.name}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-blue-600">{airport.temperature}°C</span>
                    <span className="text-sm text-gray-600">{airport.condition}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Visibility: {airport.visibility} km
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-700">
                    Wind: {airport.windSpeed} kt {getWindDirection(airport.windDirection)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Pressure: {airport.pressure} hPa
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-100">
        <button
          onClick={fetchWeatherData}
          disabled={isLoading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
        >
          {isLoading ? 'Refreshing...' : 'Refresh Weather'}
        </button>
      </div>
    </div>
  );
};

export default WeatherWidget;

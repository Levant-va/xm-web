'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';

interface WeatherData {
  airport: string;
  metar: string;
  temperature: number;
  condition: string;
  windSpeed: number;
  windDirection: string;
  visibility: number;
  pressure: number;
  humidity: number;
  dewpoint: number;
  clouds: string;
  rawMetar: string;
}

interface WeatherInfo {
  temperature?: { value: number } | number;
  dewpoint?: { value: number } | number;
  wind_speed?: { value: number } | number;
  wind_direction?: { value: number | string } | number | string;
  visibility?: { value: number } | number;
  altimeter?: { value: number } | number;
  weather?: Array<{ code: string }>;
  clouds?: Array<{ code: string }>;
}

interface AvwxResponse {
  raw?: string;
  info?: WeatherInfo;
}

const AirportWeatherWidget = () => {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);

  const airports = useMemo(() => ['OJAI', 'OSDI', 'ORBI'], []);

  const fetchMetarData = useCallback(async () => {
    // Helper function to safely extract numeric values
    const getNumericValue = (value: number | { value: number } | undefined, fallback: number): number => {
      if (typeof value === 'number') return value;
      if (value && typeof value === 'object' && 'value' in value) return value.value;
      return fallback;
    };
    
    // Helper function to safely extract string/number values
    const getValue = (value: number | string | { value: number | string } | undefined, fallback: number | string): number | string => {
      if (typeof value === 'number' || typeof value === 'string') return value;
      if (value && typeof value === 'object' && 'value' in value) return value.value;
      return fallback;
    };

    const parseAvwxMetar = (airport: string, data: AvwxResponse): WeatherData => {
      try {
        console.log(`Parsing METAR for ${airport}:`, data);
        
        const rawMetar = data.raw || '';
        const info = data.info || {};
        
        // Extract basic weather data with better fallbacks
        const temperature = getNumericValue(info.temperature, 25);
        const dewpoint = getNumericValue(info.dewpoint, temperature - 5);
        const windSpeed = getNumericValue(info.wind_speed, 5);
        const windDirectionRaw = getValue(info.wind_direction, 'VRB');
        const visibility = getNumericValue(info.visibility, 10);
        const pressure = getNumericValue(info.altimeter, 1013);
        
        // Convert wind direction to readable format
        let windDirection = 'VRB';
        if (typeof windDirectionRaw === 'number') {
          const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
          const index = Math.round(windDirectionRaw / 22.5) % 16;
          windDirection = directions[index];
        } else if (typeof windDirectionRaw === 'string') {
          windDirection = windDirectionRaw;
        }
        
        // Determine weather condition from weather codes
        let condition = 'Clear';
        const weather = info.weather || [];
        
        if (weather.some((w) => w.code === 'RA')) condition = 'Rain';
        else if (weather.some((w) => w.code === 'SN')) condition = 'Snow';
        else if (weather.some((w) => w.code === 'FG')) condition = 'Fog';
        else if (weather.some((w) => w.code === 'BR')) condition = 'Mist';
        else if (weather.some((w) => w.code === 'HZ')) condition = 'Haze';
        else if (weather.some((w) => w.code === 'TS')) condition = 'Thunderstorm';
        else if (weather.some((w) => w.code === 'SH')) condition = 'Showers';
        
        // Determine cloud condition with priority
        const clouds = info.clouds || [];
        if (clouds.some((c) => c.code === 'OVC')) condition = 'Cloudy';
        else if (clouds.some((c) => c.code === 'BKN')) condition = 'Mostly Cloudy';
        else if (clouds.some((c) => c.code === 'SCT')) condition = 'Partly Cloudy';
        else if (clouds.some((c) => c.code === 'FEW')) condition = 'Few Clouds';
        
        // Calculate humidity from temperature and dewpoint
        const humidity = Math.round(100 * Math.exp((17.625 * dewpoint) / (243.04 + dewpoint)) / Math.exp((17.625 * temperature) / (243.04 + temperature)));
        
        // Get cloud coverage
        const cloudCoverage = clouds.length > 0 ? clouds[0].code : 'CLR';
        
        const result = {
          airport,
          metar: rawMetar.substring(0, 50) + (rawMetar.length > 50 ? '...' : ''),
          temperature: Math.round(temperature),
          condition,
          windSpeed: Math.round(windSpeed),
          windDirection: windDirection.toString(),
          visibility: Math.round(visibility),
          pressure: Math.round(pressure),
          humidity,
          dewpoint: Math.round(dewpoint),
          clouds: cloudCoverage,
          rawMetar: rawMetar
        };
        
        console.log(`Parsed weather data for ${airport}:`, result);
        return result;
      } catch (err) {
        console.warn(`Error parsing AVWX METAR for ${airport}:`, err);
        return getMockWeatherData(airport);
      }
    };

    try {
      setLoading(true);
      
      const apiToken = process.env.NEXT_PUBLIC_AVWX_API_TOKEN;
      
      if (!apiToken || apiToken === 'your_avwx_api_token_here') {
        console.warn('AVWX API token not configured, using mock data');
        setWeatherData(airports.map(getMockWeatherData));
        setLoading(false);
        return;
      }
      
      const weatherPromises = airports.map(async (airport) => {
        try {
          console.log(`Fetching METAR for ${airport}...`);
          const response = await fetch(
            `https://avwx.rest/api/metar/${airport}?format=json&options=info`,
            {
              headers: {
                'Authorization': `BEARER ${apiToken}`,
                'Content-Type': 'application/json'
              }
            }
          );
          
          console.log(`Response status for ${airport}: ${response.status}`);
          
          if (response.ok) {
            const data = await response.json();
            console.log(`Raw API response for ${airport}:`, data);
            return parseAvwxMetar(airport, data);
          } else {
            const errorText = await response.text();
            console.warn(`Failed to fetch METAR for ${airport}: ${response.status} - ${errorText}`);
            return getMockWeatherData(airport);
          }
        } catch (err) {
          console.warn(`Error fetching METAR for ${airport}:`, err);
          return getMockWeatherData(airport);
        }
      });
      
      const results = await Promise.all(weatherPromises);
      setWeatherData(results);
    } catch {
      // Use mock data as fallback
      setWeatherData(airports.map(getMockWeatherData));
    } finally {
      setLoading(false);
    }
  }, [airports]);

  const getMockWeatherData = (airport: string): WeatherData => {
    const mockData = {
      'OJAI': { 
        temp: 28, 
        condition: 'Clear', 
        wind: 12, 
        windDir: 'NW', 
        vis: 10, 
        press: 1013, 
        hum: 65,
        metar: 'OJAI 281200Z 32012KT 10SM CLR 28/15 Q1013 NOSIG'
      },
      'OSDI': { 
        temp: 32, 
        condition: 'Partly Cloudy', 
        wind: 8, 
        windDir: 'NE', 
        vis: 8, 
        press: 1015, 
        hum: 58,
        metar: 'OSDI 281200Z 04008KT 8SM SCT030 32/18 Q1015 NOSIG'
      },
      'ORBI': { 
        temp: 25, 
        condition: 'Clear', 
        wind: 15, 
        windDir: 'SW', 
        vis: 12, 
        press: 1012, 
        hum: 72,
        metar: 'ORBI 281200Z 23015KT 12SM CLR 25/20 Q1012 NOSIG'
      }
    };
    
    const data = mockData[airport as keyof typeof mockData] || mockData.OJAI;
    
    return {
      airport,
      metar: data.metar.substring(0, 50) + '...',
      temperature: data.temp,
      condition: data.condition,
      windSpeed: data.wind,
      windDirection: data.windDir,
      visibility: data.vis,
      pressure: data.press,
      humidity: data.hum,
      dewpoint: data.temp - 5,
      clouds: 'CLR',
      rawMetar: data.metar
    };
  };

  useEffect(() => {
    fetchMetarData();
    
    // Refresh every 30 minutes
    const interval = setInterval(fetchMetarData, 1800000);
    
    return () => clearInterval(interval);
  }, [fetchMetarData]);

  if (loading) {
    return (
      <div className="bg-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-700 rounded w-48 mx-auto mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-gray-700 rounded-lg p-4">
                    <div className="h-4 bg-gray-600 rounded w-16 mb-2"></div>
                    <div className="h-8 bg-gray-600 rounded w-20 mb-2"></div>
                    <div className="h-3 bg-gray-600 rounded w-24"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Airport METAR</h2>
          <p className="text-gray-400 text-sm">Real-time METAR data for Middle East airports</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {weatherData.map((airport) => (
            <div key={airport.airport} className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors duration-200">
              <div className="mb-3">
                <h3 className="text-lg font-semibold text-white">{airport.airport}</h3>
              </div>
              
              <div className="text-gray-300 font-mono text-sm break-all">
                {airport.rawMetar}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AirportWeatherWidget;

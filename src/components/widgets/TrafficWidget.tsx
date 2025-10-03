'use client';

import { useState, useEffect } from 'react';

interface TrafficData {
  fir: string;
  name: string;
  inbound: number;
  outbound: number;
  online: number;
  controllers: number;
}

interface IVAOData {
  clients: Array<{
    callsign: string;
    clientType: string;
    latitude: number;
    longitude: number;
    altitude: number;
    groundSpeed: number;
    heading: number;
    onGround: boolean;
    squawk: string;
    flightPlan?: {
      departure: string;
      arrival: string;
      aircraft: string;
      cruiseAltitude: string;
    };
  }>;
}

const TrafficWidget = () => {
  const [trafficData, setTrafficData] = useState<TrafficData[]>([
    { fir: 'OJAC', name: 'Amman Control', inbound: 0, outbound: 0, online: 0, controllers: 0 },
    { fir: 'OSDI', name: 'Baghdad Control', inbound: 0, outbound: 0, online: 0, controllers: 0 },
    { fir: 'ORBI', name: 'Baghdad Control', inbound: 0, outbound: 0, online: 0, controllers: 0 }
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [error, setError] = useState<string | null>(null);

  // FIR boundaries (approximate coordinates for Middle East region)
  const firBoundaries = {
    OJAC: { minLat: 29.0, maxLat: 33.0, minLon: 34.0, maxLon: 40.0 },
    OSDI: { minLat: 29.0, maxLat: 37.0, minLon: 38.0, maxLon: 50.0 },
    ORBI: { minLat: 29.0, maxLat: 37.0, minLon: 38.0, maxLon: 50.0 }
  };

  const fetchIVAOData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch data from IVAO Whazzup API
      const response = await fetch('https://api.ivao.aero/getdata/whazzup/whazzup.txt', {
        method: 'GET',
        headers: {
          'Accept': 'text/plain',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.text();
      const parsedData = parseWhazzupData(data);
      
      // Process the data for each FIR
      const processedData = processTrafficData(parsedData);
      setTrafficData(processedData);
      setLastUpdated(new Date());
      
    } catch (error) {
      console.error('Error fetching IVAO data:', error);
      setError('Failed to fetch traffic data. Using demo data.');
      
      // Fallback to demo data
      const demoData: TrafficData[] = [
        { 
          fir: 'OJAC', 
          name: 'Amman Control', 
          inbound: Math.floor(Math.random() * 15) + 5, 
          outbound: Math.floor(Math.random() * 12) + 3, 
          online: Math.floor(Math.random() * 8) + 2,
          controllers: Math.floor(Math.random() * 3) + 1
        },
        { 
          fir: 'OSDI', 
          name: 'Baghdad Control', 
          inbound: Math.floor(Math.random() * 20) + 8, 
          outbound: Math.floor(Math.random() * 18) + 5, 
          online: Math.floor(Math.random() * 10) + 3,
          controllers: Math.floor(Math.random() * 4) + 1
        },
        { 
          fir: 'ORBI', 
          name: 'Baghdad Control', 
          inbound: Math.floor(Math.random() * 25) + 10, 
          outbound: Math.floor(Math.random() * 22) + 7, 
          online: Math.floor(Math.random() * 12) + 4,
          controllers: Math.floor(Math.random() * 5) + 2
        }
      ];
      setTrafficData(demoData);
    } finally {
      setIsLoading(false);
    }
  };

  const parseWhazzupData = (data: string) => {
    const lines = data.split('\n');
    const clients: any[] = [];
    
    let inClientsSection = false;
    
    for (const line of lines) {
      if (line.startsWith('!CLIENTS:')) {
        inClientsSection = true;
        continue;
      }
      
      if (inClientsSection && line.trim() === '') {
        break;
      }
      
      if (inClientsSection && line.trim()) {
        const parts = line.split(':');
        if (parts.length >= 10) {
          clients.push({
            callsign: parts[0],
            clientType: parts[1],
            latitude: parseFloat(parts[5]) || 0,
            longitude: parseFloat(parts[6]) || 0,
            altitude: parseInt(parts[7]) || 0,
            groundSpeed: parseInt(parts[8]) || 0,
            heading: parseInt(parts[9]) || 0,
            onGround: parts[10] === '1',
            squawk: parts[11] || '',
          });
        }
      }
    }
    
    return { clients };
  };

  const processTrafficData = (data: IVAOData) => {
    const firData: TrafficData[] = [
      { fir: 'OJAC', name: 'Amman Control', inbound: 0, outbound: 0, online: 0, controllers: 0 },
      { fir: 'OSDI', name: 'Baghdad Control', inbound: 0, outbound: 0, online: 0, controllers: 0 },
      { fir: 'ORBI', name: 'Baghdad Control', inbound: 0, outbound: 0, online: 0, controllers: 0 }
    ];

    data.clients.forEach(client => {
      // Check if client is in any of our FIRs
      Object.entries(firBoundaries).forEach(([fir, bounds]) => {
        if (client.latitude >= bounds.minLat && client.latitude <= bounds.maxLat &&
            client.longitude >= bounds.minLon && client.longitude <= bounds.maxLon) {
          
          const firIndex = firData.findIndex(f => f.fir === fir);
          if (firIndex !== -1) {
            if (client.clientType === 'ATC') {
              firData[firIndex].controllers++;
            } else if (client.clientType === 'PILOT') {
              firData[firIndex].online++;
              
              // Simple logic to determine inbound/outbound based on altitude and ground speed
              if (client.onGround || client.groundSpeed < 50) {
                firData[firIndex].inbound++;
              } else {
                firData[firIndex].outbound++;
              }
            }
          }
        }
      });
    });

    return firData;
  };

  useEffect(() => {
    fetchIVAOData();
    
    // Refresh data every 60 seconds
    const interval = setInterval(fetchIVAOData, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Current Traffic</h3>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isLoading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
          <span className="text-xs text-gray-500">
            Updated: {formatTime(lastUpdated)}
          </span>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="grid grid-cols-4 gap-4">
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {trafficData.map((fir) => (
            <div key={fir.fir} className="border-b border-gray-100 pb-4 last:border-b-0">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-800">{fir.fir}</h4>
                <span className="text-sm text-gray-600">{fir.name}</span>
              </div>
              
              <div className="grid grid-cols-4 gap-3">
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-600">{fir.inbound}</div>
                  <div className="text-xs text-gray-500">Inbound</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-red-600">{fir.outbound}</div>
                  <div className="text-xs text-gray-500">Outbound</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-green-600">{fir.online}</div>
                  <div className="text-xs text-gray-500">Online</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-purple-600">{fir.controllers}</div>
                  <div className="text-xs text-gray-500">ATC</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-100">
        <button
          onClick={fetchIVAOData}
          disabled={isLoading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
        >
          {isLoading ? 'Refreshing...' : 'Refresh Data'}
        </button>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Data from IVAO Whazzup API
        </p>
      </div>
    </div>
  );
};

export default TrafficWidget;
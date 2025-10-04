"use client";

import { useState, useEffect } from "react";

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
    {
      fir: "OJAC",
      name: "Amman Control",
      inbound: 0,
      outbound: 0,
      online: 0,
      controllers: 0,
    },
    {
      fir: "OSDI",
      name: "Baghdad Control",
      inbound: 0,
      outbound: 0,
      online: 0,
      controllers: 0,
    },
    {
      fir: "ORBI",
      name: "Baghdad Control",
      inbound: 0,
      outbound: 0,
      online: 0,
      controllers: 0,
    },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // FIR boundaries (approximate coordinates for Middle East region)
  const firBoundaries = {
    OJAC: { minLat: 29.0, maxLat: 33.0, minLon: 34.0, maxLon: 40.0 },
    OSDI: { minLat: 29.0, maxLat: 37.0, minLon: 38.0, maxLon: 50.0 },
    ORBI: { minLat: 29.0, maxLat: 37.0, minLon: 38.0, maxLon: 50.0 },
  };

  const firConfig = {
    OJAC: { color: 'from-emerald-500 to-emerald-600', icon: '🏔️', country: 'Jordan' },
    OSDI: { color: 'from-amber-500 to-amber-600', icon: '🏛️', country: 'Iraq' },
    ORBI: { color: 'from-green-500 to-green-600', icon: '🌆', country: 'Iraq' }
  };

  const fetchIVAOData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch data from IVAO Whazzup API
      const response = await fetch(
        "https://api.ivao.aero/getdata/whazzup/whazzup.txt",
        {
          method: "GET",
          headers: {
            Accept: "text/plain",
          },
        },
      );

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
      console.error("Error fetching IVAO data:", error);
      setError("Failed to fetch traffic data. Using demo data.");

      // Fallback to demo data
      const demoData: TrafficData[] = [
        {
          fir: "OJAC",
          name: "Amman Control",
          inbound: Math.floor(Math.random() * 15) + 5,
          outbound: Math.floor(Math.random() * 12) + 3,
          online: Math.floor(Math.random() * 8) + 2,
          controllers: Math.floor(Math.random() * 3) + 1,
        },
        {
          fir: "OSDI",
          name: "Baghdad Control",
          inbound: Math.floor(Math.random() * 20) + 8,
          outbound: Math.floor(Math.random() * 18) + 5,
          online: Math.floor(Math.random() * 10) + 3,
          controllers: Math.floor(Math.random() * 4) + 1,
        },
        {
          fir: "ORBI",
          name: "Baghdad Control",
          inbound: Math.floor(Math.random() * 25) + 10,
          outbound: Math.floor(Math.random() * 22) + 7,
          online: Math.floor(Math.random() * 12) + 4,
          controllers: Math.floor(Math.random() * 5) + 2,
        },
      ];
      setTrafficData(demoData);
    } finally {
      setIsLoading(false);
    }
  };

  const parseWhazzupData = (data: string) => {
    const lines = data.split("\n");
    const clients: IVAOData["clients"] = [];

    let inClientsSection = false;

    for (const line of lines) {
      if (line.startsWith("!CLIENTS:")) {
        inClientsSection = true;
        continue;
      }

      if (inClientsSection && line.trim() === "") {
        break;
      }

      if (inClientsSection && line.trim()) {
        const parts = line.split(":");
        if (parts.length >= 10) {
          clients.push({
            callsign: parts[0],
            clientType: parts[1],
            latitude: parseFloat(parts[5]) || 0,
            longitude: parseFloat(parts[6]) || 0,
            altitude: parseInt(parts[7]) || 0,
            groundSpeed: parseInt(parts[8]) || 0,
            heading: parseInt(parts[9]) || 0,
            onGround: parts[10] === "1",
            squawk: parts[11] || "",
          });
        }
      }
    }

    return { clients };
  };

  const processTrafficData = (data: IVAOData) => {
    const firData: TrafficData[] = [
      {
        fir: "OJAC",
        name: "Amman Control",
        inbound: 0,
        outbound: 0,
        online: 0,
        controllers: 0,
      },
      {
        fir: "OSDI",
        name: "Baghdad Control",
        inbound: 0,
        outbound: 0,
        online: 0,
        controllers: 0,
      },
      {
        fir: "ORBI",
        name: "Baghdad Control",
        inbound: 0,
        outbound: 0,
        online: 0,
        controllers: 0,
      },
    ];

    data.clients.forEach((client) => {
      // Check if client is in any of our FIRs
      Object.entries(firBoundaries).forEach(([fir, bounds]) => {
        if (
          client.latitude >= bounds.minLat &&
          client.latitude <= bounds.maxLat &&
          client.longitude >= bounds.minLon &&
          client.longitude <= bounds.maxLon
        ) {
          const firIndex = firData.findIndex((f) => f.fir === fir);
          if (firIndex !== -1) {
            if (client.clientType === "ATC") {
              firData[firIndex].controllers++;
            } else if (client.clientType === "PILOT") {
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
    setIsVisible(true);
    fetchIVAOData();

    // Refresh data every 60 seconds
    const interval = setInterval(fetchIVAOData, 60000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={`glass rounded-3xl p-8 border-l-4 border-green-500 shadow-xl hover-lift transition-all duration-500 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">✈️</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Live Traffic</h3>
            <p className="text-sm text-gray-600">Real-time aviation data</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full shadow-lg ${isLoading ? "bg-yellow-500 animate-pulse" : "bg-green-500"}`}></div>
          <div className="text-right">
            <div className="text-sm font-mono font-bold text-gray-900">
              {formatTime(lastUpdated)}
            </div>
            <div className="text-xs text-gray-500">
              Last updated
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <div className="flex items-center space-x-2">
            <span className="text-yellow-600">⚠️</span>
            <p className="text-sm text-yellow-800">{error}</p>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-2xl"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="h-12 bg-gray-200 rounded-xl"></div>
                <div className="h-12 bg-gray-200 rounded-xl"></div>
                <div className="h-12 bg-gray-200 rounded-xl"></div>
                <div className="h-12 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {trafficData.map((fir, index) => (
            <div
              key={fir.fir}
              className={`group bg-white/50 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/70 transition-all duration-300 hover:scale-105 border border-gray-200/50 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* FIR Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${firConfig[fir.fir as keyof typeof firConfig].color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-xl">{firConfig[fir.fir as keyof typeof firConfig].icon}</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">{fir.fir}</h4>
                    <p className="text-sm text-gray-600">{fir.name}</p>
                    <p className="text-xs text-gray-500">{firConfig[fir.fir as keyof typeof firConfig].country}</p>
                  </div>
                </div>
                
                {/* Status indicator */}
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-600 font-medium">Active</span>
                </div>
              </div>

              {/* Traffic Stats */}
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center group">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 mb-2 group-hover:scale-105 transition-transform duration-300">
                    <div className="text-2xl font-bold text-white">
                      {fir.inbound}
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 font-medium">Inbound</div>
                </div>
                
                <div className="text-center group">
                  <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-4 mb-2 group-hover:scale-105 transition-transform duration-300">
                    <div className="text-2xl font-bold text-white">
                      {fir.outbound}
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 font-medium">Outbound</div>
                </div>
                
                <div className="text-center group">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 mb-2 group-hover:scale-105 transition-transform duration-300">
                    <div className="text-2xl font-bold text-white">
                      {fir.online}
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 font-medium">Online</div>
                </div>
                
                <div className="text-center group">
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 mb-2 group-hover:scale-105 transition-transform duration-300">
                    <div className="text-2xl font-bold text-white">
                      {fir.controllers}
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 font-medium">ATC</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-gray-200/50">
        <button
          onClick={fetchIVAOData}
          disabled={isLoading}
          className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <span className="flex items-center justify-center space-x-2">
            <span>{isLoading ? "🔄" : "🔄"}</span>
            <span>{isLoading ? "Refreshing..." : "Refresh Data"}</span>
          </span>
        </button>
        <p className="text-xs text-gray-500 mt-3 text-center">
          Data powered by IVAO Whazzup API
        </p>
      </div>
    </div>
  );
};

export default TrafficWidget;

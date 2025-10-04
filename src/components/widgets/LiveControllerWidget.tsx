'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';

interface ControllerData {
  id: number;
  callsign: string;
  position: string;
  frequency: number;
  rating: number;
  serverId: string;
  createdAt: string;
  time: number;
  atis?: {
    lines: string[];
    revision: string;
    timestamp: string;
  };
}

interface IVAOData {
  updatedAt: string;
  clients: {
    atc: Array<{
      id: number;
      callsign: string;
      serverId: string;
      rating: number;
      createdAt: string;
      time: number;
      atcSession: {
        frequency: number;
        position: string;
      };
      atis?: {
        lines: string[];
        revision: string;
        timestamp: string;
      };
    }>;
  };
}

const LiveControllerWidget = () => {
  const [controllers, setControllers] = useState<ControllerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  // Display last update time in the UI
  const displayLastUpdate = lastUpdate ? `Last updated: ${lastUpdate}` : 'Never updated';

  // Middle East FIR controller callsigns
  const middleEastControllers = useMemo(() => [
    // Jordan (OJAC FIR)
    'OJAC', 'OJAI', 'OJAM',
    
    // Syria (OSTT FIR)  
    'OSTT', 'OSDI', 'OSLK', 'OSPR',
    
    // Iraq (ORBB FIR)
    'ORBB', 'ORBI', 'ORBM', 'ORBS', 'ORER', 'ORMM', 'ORNI', 'ORSU', 'ORTL',
    
    // Oman (OXMF FIR)
    'OXMF'
  ], []);

  // Main FIR centers that can have CTR positions
  const firCenters = useMemo(() => ['OJAC', 'OSTT', 'ORBB', 'OXMF'], []);

  const fetchControllerData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('https://api.ivao.aero/v2/tracker/whazzup');
      if (!response.ok) {
        throw new Error('Failed to fetch controller data');
      }
      
      const data: IVAOData = await response.json();
      
      // Check if controllers data exists
      if (!data.clients || !data.clients.atc || !Array.isArray(data.clients.atc)) {
        setControllers([]);
        setLastUpdate(new Date().toLocaleTimeString());
        return;
      }
      
      // Filter controllers by Middle East FIR
      const filteredControllers = data.clients.atc
        .filter(controller => {
          if (!controller || !controller.callsign) return false;
          const callsign = controller.callsign.toUpperCase();
          
          // Check if it's a Middle East FIR controller
          const isMiddleEastController = middleEastControllers.some(meController => 
            callsign.includes(meController)
          );
          
          if (!isMiddleEastController) return false;
          
          // Check if it's a FIR center (OJAC, OSTT, ORBB)
          const isFirCenter = firCenters.some(firCenter => 
            callsign.includes(firCenter)
          );
          
          // For FIR centers: allow DEL, GND, TWR, APP, CTR
          // For other airports: only allow DEL, GND, TWR, APP (no CTR)
          const isOperationalPosition = callsign.includes('_DEL') || 
                                       callsign.includes('_GND') || 
                                       callsign.includes('_TWR') || 
                                       callsign.includes('_APP') || 
                                       (isFirCenter && callsign.includes('_CTR'));
          
          return isOperationalPosition;
        })
        .map(controller => ({
          id: controller.id || 0,
          callsign: controller.callsign || 'Unknown',
          position: controller.atcSession?.position || 'Unknown',
          frequency: controller.atcSession?.frequency || 0,
          rating: controller.rating || 0,
          serverId: controller.serverId || 'Unknown',
          createdAt: controller.createdAt || '',
          time: controller.time || 0,
          atis: controller.atis || undefined
        }))
        .sort((a, b) => a.callsign.localeCompare(b.callsign));
      
      setControllers(filteredControllers);
      setLastUpdate(new Date().toLocaleTimeString());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [middleEastControllers, firCenters]);

  useEffect(() => {
    fetchControllerData();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchControllerData, 30000);
    
    return () => clearInterval(interval);
  }, [fetchControllerData]);

  const getPositionColor = (position: string) => {
    switch (position.toLowerCase()) {
      case 'ctr':
        return 'bg-blue-600 text-white';
      case 'app':
        return 'bg-green-600 text-white';
      case 'twr':
        return 'bg-yellow-600 text-white';
      case 'gnd':
        return 'bg-purple-600 text-white';
      case 'del':
        return 'bg-orange-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  const getPositionIcon = (position: string) => {
    switch (position.toLowerCase()) {
      case 'ctr':
        return '🎯';
      case 'app':
        return '📡';
      case 'twr':
        return '🏗️';
      case 'gnd':
        return '🚗';
      case 'del':
        return '📋';
      default:
        return '🎧';
    }
  };

  const getRatingText = (rating: number) => {
    const ratings = [
      'Observer', 'ATC Applicant', 'ATC Trainee', 'ATC Advanced', 
      'ATC Instructor', 'ATC Senior Instructor', 'ATC Supervisor'
    ];
    return ratings[rating] || 'Unknown';
  };

  const formatFrequency = (frequency: number) => {
    if (frequency === 0) return 'N/A';
    return `${frequency.toFixed(3)} MHz`;
  };

  const getSessionDuration = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  if (loading) {
    return (
      <div className="bg-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-700 rounded w-64 mx-auto mb-6"></div>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div className="h-4 bg-gray-600 rounded w-24"></div>
                      <div className="h-4 bg-gray-600 rounded w-32"></div>
                    </div>
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
          <h2 className="text-2xl font-bold text-white mb-2">Live Controllers - Middle East FIR</h2>
          <p className="text-gray-400 text-sm mb-4">
            Active ATC controllers on IVAO network
          </p>
        </div>

        {error ? (
          <div className="text-center">
            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4">
              <p className="text-red-400">⚠️ {error}</p>
              <button
                onClick={fetchControllerData}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        ) : controllers.length === 0 ? (
          <div className="text-center">
            <div className="bg-gray-700 rounded-lg p-8">
              <p className="text-gray-400 text-lg">No controllers online</p>
              <p className="text-gray-500 text-sm mt-2">
                No ATC controllers currently active in Middle East FIR
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {controllers.map((controller) => (
              <div key={controller.id} className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-blue-400">{controller.callsign}</span>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${getPositionColor(controller.position)}`}>
                        {getPositionIcon(controller.position)} {controller.position.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-300">
                      {getRatingText(controller.rating)}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <span className="text-gray-400">Freq:</span>
                      <span className="text-green-400 font-medium">{formatFrequency(controller.frequency)}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <span className="text-gray-400">Online:</span>
                      <span className="text-yellow-400 font-medium">{getSessionDuration(controller.time)}</span>
                    </div>
                    
                    {controller.atis && (
                      <div className="flex items-center space-x-1">
                        <span className="text-gray-400">ATIS:</span>
                        <span className="text-purple-400 font-medium">{controller.atis.revision}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {controller.atis && (
                  <div className="mt-3 pt-3 border-t border-gray-600">
                    <div className="text-xs text-gray-400">
                      <strong>ATIS {controller.atis.revision}:</strong>
                      <div className="mt-1 text-gray-300">
                        {controller.atis.lines.slice(0, 3).map((line, index) => (
                          <div key={index}>{line}</div>
                        ))}
                        {controller.atis.lines.length > 3 && (
                          <div className="text-gray-500">... and {controller.atis.lines.length - 3} more lines</div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">{displayLastUpdate}</p>
        </div>
      </div>
    </div>
  );
};

export default LiveControllerWidget;

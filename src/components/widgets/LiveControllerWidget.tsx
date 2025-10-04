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
}

interface IVAOData {
  updatedAt: string;
  clients: {
    atcs: Array<{
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
    }>;
  };
}

const LiveControllerWidget = () => {
  const [controllers, setControllers] = useState<ControllerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [newControllersCount, setNewControllersCount] = useState(0);

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
    'OXMF', 'OXMF_N_CTR', 'OXMF_E_CTR', 'OXMF_W_CTR', 'OXMF_S_CTR'
  ], []);

  // Main FIR centers that can have CTR positions
  const firCenters = useMemo(() => ['OJAC', 'OSTT', 'ORBB', 'OXMF'], []);

  const fetchControllerData = useCallback(async () => {
    try {
      setLoading(true);
      setIsUpdating(true);
      setError(null);
      
      const response = await fetch('https://api.ivao.aero/v2/tracker/whazzup');
      if (!response.ok) {
        throw new Error('Failed to fetch controller data');
      }
      
      const data: IVAOData = await response.json();
      
      // Check if controllers data exists
      if (!data.clients || !data.clients.atcs || !Array.isArray(data.clients.atcs)) {
        setControllers([]);
        setLastUpdate(new Date().toLocaleTimeString());
        return;
      }
      
      // Filter controllers by Middle East FIR
      const filteredControllers = data.clients.atcs
        .filter(controller => {
          if (!controller || !controller.callsign) return false;
          const callsign = controller.callsign.toUpperCase();
          
          console.log('Checking controller:', callsign);
          
          // Check if it's a Middle East FIR controller
          const isMiddleEastController = middleEastControllers.some(meController => 
            callsign.includes(meController)
          );
          
          console.log('Is Middle East controller:', isMiddleEastController, 'for', callsign);
          
          if (!isMiddleEastController) return false;
          
          // Check if it's a FIR center (OJAC, OSTT, ORBB, OXMF)
          const isFirCenter = firCenters.some(firCenter => 
            callsign.includes(firCenter)
          );
          
          // Allow all operational positions for Middle East FIR controllers
          // This includes DEL, GND, TWR, APP, CTR for all Middle East FIRs
          const isOperationalPosition = callsign.includes('_DEL') || 
                                       callsign.includes('_GND') || 
                                       callsign.includes('_TWR') || 
                                       callsign.includes('_APP') || 
                                       callsign.includes('_CTR');
          
          console.log('Is operational position:', isOperationalPosition, 'for', callsign);
          
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
          time: controller.time || 0
        }))
        .sort((a, b) => a.callsign.localeCompare(b.callsign));
      
      // Smart update: only add new controllers, update existing ones
      const currentControllerIds = new Set(controllers.map(c => c.id));
      const newControllers = filteredControllers.filter(controller => 
        !currentControllerIds.has(controller.id)
      );
      
      // Update existing controllers and add new ones
      const updatedControllers = [...controllers];
      
      // Update existing controllers with new data
      filteredControllers.forEach(newController => {
        const existingIndex = updatedControllers.findIndex(c => c.id === newController.id);
        if (existingIndex !== -1) {
          // Update existing controller
          updatedControllers[existingIndex] = newController;
        } else {
          // Add new controller
          updatedControllers.push(newController);
        }
      });
      
      // Remove controllers that are no longer online
      const newControllerIds = new Set(filteredControllers.map(c => c.id));
      const finalControllers = updatedControllers.filter(controller => 
        newControllerIds.has(controller.id)
      );
      
      if (newControllers.length > 0) {
        setNewControllersCount(newControllers.length);
        // Reset the new controllers count after animation
        setTimeout(() => setNewControllersCount(0), 3000);
      }
      
      setControllers(finalControllers);
      setLastUpdate(new Date().toLocaleTimeString());
      setIsUpdating(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
      setIsUpdating(false);
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
          <div className="flex items-center justify-center space-x-3 mb-2">
            <h2 className="text-2xl font-bold text-white">Live Controllers - Middle East FIR</h2>
            {isUpdating && (
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-blue-400 text-sm">Updating...</span>
              </div>
            )}
            {newControllersCount > 0 && (
              <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-bounce">
                +{newControllersCount} New!
              </div>
            )}
          </div>
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
            {controllers.map((controller, index) => (
              <div 
                key={controller.id} 
                className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                style={{
                  animationDelay: `${index * 50}ms`,
                  animation: 'fadeInUp 0.5s ease-out forwards'
                }}
              >
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
                  </div>
                </div>
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

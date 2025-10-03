'use client';

import { useState, useEffect } from 'react';

const ZuluTimeWidget = () => {
  const [zuluTime, setZuluTime] = useState('');
  const [zuluDate, setZuluDate] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const utcTime = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
      
      // Format time as HH:MM:SS Z
      const timeString = utcTime.toISOString().substr(11, 8);
      setZuluTime(timeString);
      
      // Format date as DD MMM YYYY
      const dateString = utcTime.toISOString().substr(0, 10).split('-').reverse().join(' ');
      const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      const [day, month, year] = dateString.split(' ');
      setZuluDate(`${day} ${monthNames[parseInt(month) - 1]} ${year}`);
    };

    // Update immediately
    updateTime();
    
    // Update every second
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Zulu Time</h3>
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
      </div>
      
      <div className="text-center">
        <div className="text-3xl font-mono font-bold text-blue-600 mb-2">
          {zuluTime}
        </div>
        <div className="text-sm text-gray-600 font-medium">
          {zuluDate}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          UTC (Coordinated Universal Time)
        </div>
      </div>
    </div>
  );
};

export default ZuluTimeWidget;

// components/SensorUnit.tsx
import React from 'react';
import { cn } from '@/lib/utils';

type SensorLocation = 'L' | 'W' | 'R'; // Left, Waist, Right
type LightStatus = 'green' | 'blue' | 'orange' | 'blinking-blue' | 'white-blue' | 'none';

interface SensorUnitProps {
  sensorSet: string; // e.g. "32-A" to "32-H"
  location: SensorLocation;
  lightStatus: LightStatus;
  className?: string;
  onClick?: () => void;
}

export function SensorUnit({
  sensorSet,
  location,
  lightStatus,
  className,
  onClick,
}: SensorUnitProps) {
  // Get appropriate sensor icon based on location
  const getLocationIcon = () => {
    switch (location) {
      case 'L':
        return (
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
            <path d="M18 4v16H6V4h12m1-1H5v18h14V3z" />
            <path d="M13 16h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V6h2v2z" />
          </svg>
        );
      case 'R':
        return (
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
            <path d="M18 4v16H6V4h12m1-1H5v18h14V3z" />
            <path d="M13 16h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V6h2v2z" />
          </svg>
        );
      case 'W':
        return (
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
            <path d="M18 8v8H6V8h12m1-1H5v10h14V7z" />
            <path d="M15 10H9v2h6v-2z" />
          </svg>
        );
    }
  };

  // Get appropriate CSS class for the light indicator
  const getLightStatusClass = () => {
    switch (lightStatus) {
      case 'green':
        return 'bg-green-500';
      case 'blue':
        return 'bg-blue-500';
      case 'orange':
        return 'bg-orange-500';
      case 'blinking-blue':
        return 'bg-blue-500 animate-pulse';
      case 'white-blue':
        return 'bg-sky-200';
      case 'none':
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'relative w-20 h-28 bg-blue-600 text-white rounded border-2 border-gray-300 flex flex-col items-center',
        onClick && 'cursor-pointer',
        className
      )}
    >
      <div className="text-sm font-bold mt-1">{sensorSet}</div>
      <div className="text-lg font-bold">{location}</div>
      
      <div className="flex-grow flex items-center justify-center">
        {getLocationIcon()}
      </div>
      
      {lightStatus !== 'none' && (
        <div className={cn('absolute bottom-2 left-2 w-4 h-4 rounded-full', getLightStatusClass())}></div>
      )}
    </div>
  );
}
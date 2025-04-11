// components/SensorUnit.tsx
import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export type SensorLocation = 'L' | 'W' | 'R'; // Left, Waist, Right
export type LightStatus = 'green' | 'blue' | 'orange' | 'blinking-blue' | 'blinking-red' | 'white-blue' | 'none';
export type SensorSet = '32-A' | '32-B' | '32-C' | '32-D' | '32-E' | '32-F' | '32-G' | '32-H';

interface SensorUnitProps {
  sensorSet: string;
  location: SensorLocation;
  lightStatus: LightStatus;
  className?: string;
  onClick?: () => void;
}

// Mapping sensor sets to background and border colors
const sensorSetStyles: Record<string, { bg: string; border: string }> = {
  '32-A': { bg: '#D0D2D3', border: '#2965B4' },
  '32-B': { bg: '#2965B4', border: '#D0D2D3' },
  '32-C': { bg: '#D0D2D3', border: '#89B1D6' },
  '32-D': { bg: '#89B1D6', border: '#D0D2D3' },
  '32-E': { bg: '#D0D2D3', border: '#EDB159' },
  '32-F': { bg: '#EDB159', border: '#D0D2D3' },
  '32-G': { bg: '#D0D2D3', border: 'black' },
  '32-H': { bg: 'black', border: '#D0D2D3' },
};

export function SensorUnit({
  sensorSet,
  location,
  lightStatus,
  className,
  onClick,
}: SensorUnitProps) {
  // Get colors for the current sensor set
  const styles = sensorSetStyles[sensorSet] || { bg: '#2965B4', border: '#E7E8E7' };
  
  // Get light indicator color
  const getLightColor = () => {
    switch (lightStatus) {
      case 'green': return 'bg-green-500';
      case 'blue': return 'bg-blue-500';
      case 'orange': return 'bg-orange-500';
      case 'blinking-blue': return 'bg-blue-500 animate-pulse';
      case 'blinking-red': return 'bg-red-500 animate-pulse';
      case 'white-blue': return 'bg-sky-200';
      case 'none':
      default: return 'bg-gray-300';
    }
  };

  // Get SVG for each location
  const getLocationSvg = () => {
    switch (location) {
      case 'L': return '/sensor/left.svg';
      case 'R': return '/sensor/right.svg';
      case 'W': return '/sensor/belt.svg';
      default: return '';
    }
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'relative w-20 h-28 text-white rounded-lg flex flex-col items-center',
        'border-4 shadow-md transition-colors',
        onClick && 'cursor-pointer',
        className
      )}
      style={{ 
        backgroundColor: styles.bg,
        borderColor: styles.border,
      }}
    >
      {/* Sensor set name at top-left with location underneath */}
      <div className="absolute top-1 left-2 flex flex-col items-start">
        <div className={cn(
          "text-sm font-bold",
          (styles.bg === '#D0D2D3' || styles.bg === '#E7E8E7') ? "text-blue-800" : "text-white"
        )}>
          {sensorSet}
        </div>
        <div className={cn(
          "text-sm font-bold",
          (styles.bg === '#D0D2D3' || styles.bg === '#E7E8E7') ? "text-black" : "text-white"
        )}>
          {location}
        </div>
      </div>
      
      {/* Light indicator with ring at bottom-left */}
      {lightStatus !== 'none' && (
        <div className="absolute bottom-2 left-2 flex items-center justify-center">
          <div className={cn(
            'w-5 h-5 rounded-full', 
            getLightColor(),
            'ring-2 ring-opacity-80',
            lightStatus === 'green' ? 'ring-green-700' :
            lightStatus === 'blue' || lightStatus === 'blinking-blue' ? 'ring-blue-700' :
            lightStatus === 'orange' ? 'ring-orange-700' :
            lightStatus === 'blinking-red' ? 'ring-red-700' : 'ring-gray-500'
          )}></div>
        </div>
      )}

      {/* SVG image based on location */}
      <div className={cn(
        "absolute",
        location === 'W' ? "inset-0 flex items-center justify-center" : "bottom-0 right-[-6px]"
      )}>
        <div className={cn(
          "relative",
          location === 'W' ? "w-14 h-14" : "w-16 h-16"
        )}>
          <Image 
            src={getLocationSvg()}
            alt={`${location} sensor`}
            width={location === 'W' ? 56 : 64}
            height={location === 'W' ? 56 : 64}
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}
// components/SensorUnit.tsx
import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { LightIndicator, type LightStatus } from './LightIndicator';

export type SensorLocation = 'L' | 'W' | 'R'; // Left, Waist, Right
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
        'relative rounded-lg overflow-hidden',
        'border-4 shadow-md transition-colors',
        onClick && 'cursor-pointer',
        className
      )}
      style={{ 
        backgroundColor: styles.bg,
        borderColor: styles.border,
        width: '5rem',
        height: '7rem',
        ...(!className && { width: '5rem', height: '7rem' })
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
        <div className="absolute bottom-2 left-2">
          <LightIndicator 
            status={lightStatus}
            type="sensor"
            size="md"
          />
        </div>
      )}

      {/* SVG image based on location */}
      {location === 'W' ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 relative">
            <Image 
              src={getLocationSvg()}
              alt={`${location} sensor`}
              width={56}
              height={56}
              className="object-contain"
            />
          </div>
        </div>
      ) : (
        <div className="absolute bottom-0 left-4">
          <div className="relative w-16 h-16">
            <Image 
              src={getLocationSvg()}
              alt={`${location} sensor`}
              width={64}
              height={64}
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
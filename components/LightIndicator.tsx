// components/LightIndicator.tsx
import React from 'react';
import { cn } from '@/lib/utils';

export type LightStatus = 'green' | 'blue' | 'orange' | 'yellow' | 'blinking-blue' | 'blinking-red' | 'white-blue' | 'red' | 'none';
export type LightType = 'sensor' | 'dock';

interface LightIndicatorProps {
  status: LightStatus;
  type: LightType;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

interface StatusInfo {
  color: string;
  ringColor: string;
  animation?: string;
  meaning: string;
}

// Status information for sensor lights
const sensorStatusMap: Record<LightStatus, StatusInfo> = {
  'green': { color: 'bg-green-500', ringColor: 'ring-green-700', meaning: 'The sensor is fully charged' },
  'yellow': { color: 'bg-yellow-400', ringColor: 'ring-yellow-600', meaning: 'The sensor charges' },
  'blue': { color: 'bg-blue-500', ringColor: 'ring-blue-700', meaning: 'Normal status' },
  'orange': { color: 'bg-orange-500', ringColor: 'ring-orange-700', meaning: 'Charging' },
  'blinking-blue': { color: 'bg-blue-500', ringColor: 'ring-blue-700', animation: 'animate-pulse', meaning: 'A measurement is in progress' },
  'blinking-red': { color: 'bg-red-500', ringColor: 'ring-red-700', animation: 'animate-pulse', meaning: 'Synchronisation in progress. Do not start measurement!' },
  'white-blue': { color: 'bg-sky-200', ringColor: 'ring-sky-400', meaning: 'Data transfer' },
  'red': { color: 'bg-red-500', ringColor: 'ring-red-700', meaning: 'Error' },
  'none': { color: 'bg-transparent', ringColor: 'ring-gray-400', meaning: 'No light' }
};

// Status information for dock lights
const dockStatusMap: Record<LightStatus, StatusInfo> = {
  'blue': { color: 'bg-blue-500', ringColor: 'shadow-blue-200/40', meaning: 'Normal status' },
  'white-blue': { 
    color: 'bg-gradient-to-r from-sky-300 to-blue-300', 
    ringColor: 'shadow-blue-400/70', 
    animation: 'animate-pulse', 
    meaning: 'Sensor data transfer in progress' 
  },
  'green': { color: 'bg-green-500', ringColor: 'shadow-green-200/50', meaning: 'Data transfer to USB stick completed' },
  'red': { color: 'bg-red-500', ringColor: 'shadow-red-200/50', animation: 'animate-pulse', meaning: 'Sensor is in the wrong slot' },
  'orange': { color: 'bg-orange-500', ringColor: 'shadow-orange-200/50', meaning: 'Charging' },
  'yellow': { color: 'bg-yellow-400', ringColor: 'shadow-yellow-200/50', meaning: 'Charging' },
  'blinking-blue': { color: 'bg-blue-500', ringColor: 'shadow-blue-200/50', animation: 'animate-pulse', meaning: 'Data transfer in progress' },
  'blinking-red': { color: 'bg-red-500', ringColor: 'shadow-red-200/50', animation: 'animate-pulse', meaning: 'Error' },
  'none': { color: 'bg-transparent', ringColor: 'shadow-gray-200/50', meaning: 'No light' }
};

export function LightIndicator({ 
  status, 
  type, 
  className, 
  size = 'md', 
  showLabel = false 
}: LightIndicatorProps) {
  const statusInfo = type === 'sensor' ? sensorStatusMap[status] : dockStatusMap[status];
  
  // Size classes
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-5 h-5',
    lg: 'w-7 h-7'
  };
  
  // Special treatment for white-blue dock lights (data transfer)
  const isDataTransfer = type === 'dock' && status === 'white-blue';
  
  // Special treatment for "none" status - render as empty circle with border
  const isNone = status === 'none';
  
  // For CSS transition animations instead of animate classes
  const getAnimationStyle = () => {
    if (type === 'dock' && status === 'white-blue') {
      return {
        animation: 'pulse-glow 2s ease-in-out infinite',
        background: 'linear-gradient(90deg, #7dd3fc 0%, #0ea5e9 50%, #7dd3fc 100%)',
        boxShadow: '0 0 6px 3px rgba(56, 189, 248, 0.7)'
      };
    }
    return {};
  };
  
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div 
        className={cn(
          'rounded-full transition-all duration-300', 
          sizeClasses[size],
          !isDataTransfer && !isNone && statusInfo.color,
          !isDataTransfer && statusInfo.animation,
          type === 'sensor' ? 'ring-2 ring-opacity-80' : 'shadow-lg',
          type === 'sensor' ? statusInfo.ringColor : statusInfo.ringColor,
          isDataTransfer && 'data-transfer-glow',
          isNone && 'bg-transparent border border-gray-300'
        )}
        style={isDataTransfer ? getAnimationStyle() : {}}
      ></div>
      
      {showLabel && (
        <span className="text-xs text-gray-700">{statusInfo.meaning}</span>
      )}
    </div>
  );
}
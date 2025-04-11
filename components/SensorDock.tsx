// components/SensorDock.tsx
import React from 'react';
import { SensorUnit } from './SensorUnit';
import { cn } from '@/lib/utils';

type LightStatus = 'green' | 'blue' | 'orange' | 'blinking-blue' | 'white-blue' | 'none';

interface SensorDockProps {
  selectedSet?: string;
  onSelectSet?: (sensorSet: string) => void;
  sensorLightStatus?: LightStatus;
  dockLightStatus?: LightStatus;
  className?: string;
  showLabels?: boolean;
}

export function SensorDock({
  selectedSet,
  onSelectSet,
  sensorLightStatus = 'green',
  dockLightStatus = 'blue',
  className,
  showLabels = true,
}: SensorDockProps) {
  // Create array of all sensor sets
  const sensorSets = ['32-A', '32-B', '32-C', '32-D', '32-E', '32-F', '32-G', '32-H'];
  
  return (
    <div className={cn('p-4 bg-gray-100 rounded-lg', className)}>
      {showLabels && (
        <h3 className="text-center mb-3 font-medium">Sensor Dock</h3>
      )}
      
      <div className="grid grid-cols-4 gap-4">
        {sensorSets.slice(0, 4).map((set) => (
          <div 
            key={set}
            className={cn(
              'flex flex-col items-center', 
              selectedSet === set && 'ring-2 ring-blue-600 rounded-lg p-1'
            )}
            onClick={() => onSelectSet?.(set)}
          >
            <div className="flex gap-1 justify-center mb-1">
              <SensorUnit 
                sensorSet={set} 
                location="L" 
                lightStatus={selectedSet === set ? sensorLightStatus : 'none'} 
                className="w-14 h-20 text-xs"
              />
              <SensorUnit 
                sensorSet={set} 
                location="W" 
                lightStatus={selectedSet === set ? sensorLightStatus : 'none'} 
                className="w-14 h-20 text-xs"
              />
              <SensorUnit 
                sensorSet={set} 
                location="R" 
                lightStatus={selectedSet === set ? sensorLightStatus : 'none'} 
                className="w-14 h-20 text-xs"
              />
            </div>
            {selectedSet === set && (
              <div className={cn(
                'h-2 w-2 rounded-full mb-1',
                dockLightStatus === 'blue' ? 'bg-blue-500' : 
                dockLightStatus === 'white-blue' ? 'bg-sky-200' : 'bg-gray-300'
              )}></div>
            )}
            <div className="text-xs font-semibold">{set}</div>
          </div>
        ))}
        
        {sensorSets.slice(4, 8).map((set) => (
          <div 
            key={set}
            className={cn(
              'flex flex-col items-center', 
              selectedSet === set && 'ring-2 ring-blue-600 rounded-lg p-1'
            )}
            onClick={() => onSelectSet?.(set)}
          >
            <div className="flex gap-1 justify-center mb-1">
              <SensorUnit 
                sensorSet={set} 
                location="L" 
                lightStatus={selectedSet === set ? sensorLightStatus : 'none'} 
                className="w-14 h-20 text-xs"
              />
              <SensorUnit 
                sensorSet={set} 
                location="W" 
                lightStatus={selectedSet === set ? sensorLightStatus : 'none'} 
                className="w-14 h-20 text-xs"
              />
              <SensorUnit 
                sensorSet={set} 
                location="R" 
                lightStatus={selectedSet === set ? sensorLightStatus : 'none'} 
                className="w-14 h-20 text-xs"
              />
            </div>
            {selectedSet === set && (
              <div className={cn(
                'h-2 w-2 rounded-full mb-1',
                dockLightStatus === 'blue' ? 'bg-blue-500' : 
                dockLightStatus === 'white-blue' ? 'bg-sky-200' : 'bg-gray-300'
              )}></div>
            )}
            <div className="text-xs font-semibold">{set}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
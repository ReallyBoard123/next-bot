// components/SensorDock.tsx
import React from 'react';
import { SensorUnit, type SensorSet } from './SensorUnit';
import { LightIndicator, type LightStatus } from './LightIndicator';
import { cn } from '@/lib/utils';

interface SensorDockProps {
  selectedSet?: string;
  onSelectSet?: (sensorSet: SensorSet) => void;
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
  // Define sensor sets for left and right sides
  const leftSensorSets: SensorSet[] = ['32-A', '32-B', '32-C', '32-D'];
  const rightSensorSets: SensorSet[] = ['32-E', '32-F', '32-G', '32-H'];
  
  return (
    <div className={cn('p-6 bg-gray-200 rounded-3xl shadow-inner', className)}>
      {showLabels && (
        <h3 className="text-center mb-4 font-medium">Sensor Dock</h3>
      )}
      
      <div className="grid grid-cols-7 gap-2">
        {/* Left side - Sets A-D */}
        <div className="col-span-3 grid grid-rows-4 gap-4">
          {leftSensorSets.map((set) => (
            <div 
              key={set}
              className={cn(
                'flex justify-center gap-2',
                selectedSet === set && 'ring-2 ring-blue-600 rounded-lg p-1 bg-blue-50'
              )}
              onClick={() => onSelectSet?.(set)}
            >
              <SensorUnit 
                sensorSet={set} 
                location="L" 
                lightStatus={selectedSet === set ? sensorLightStatus : 'none'} 
              />
              <SensorUnit 
                sensorSet={set} 
                location="W" 
                lightStatus={selectedSet === set ? sensorLightStatus : 'none'} 
              />
              <SensorUnit 
                sensorSet={set} 
                location="R" 
                lightStatus={selectedSet === set ? sensorLightStatus : 'none'} 
              />
            </div>
          ))}
        </div>
        
        {/* Middle - Dock lights */}
        <div className="col-span-1 flex flex-col justify-around items-center">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="flex flex-row items-center gap-2">
              {/* Special staggered animation for white-blue data transfer */}
              {dockLightStatus === 'white-blue' ? (
                <>
                  <div className={`animate-delay-${index * 150}`}>
                    <LightIndicator
                      status={dockLightStatus}
                      type="dock"
                    />
                  </div>
                  <div className={`animate-delay-${(index * 150 + 300) % 1200}`}>
                    <LightIndicator
                      status={dockLightStatus}
                      type="dock"
                    />
                  </div>
                </>
              ) : (
                <>
                  <LightIndicator
                    status={dockLightStatus}
                    type="dock"
                  />
                  <LightIndicator
                    status={dockLightStatus}
                    type="dock"
                  />
                </>
              )}
            </div>
          ))}
        </div>
        
        {/* Right side - Sets E-H */}
        <div className="col-span-3 grid grid-rows-4 gap-4">
          {rightSensorSets.map((set) => (
            <div 
              key={set}
              className={cn(
                'flex justify-center gap-2',
                selectedSet === set && 'ring-2 ring-blue-600 rounded-lg p-1 bg-blue-50'
              )}
              onClick={() => onSelectSet?.(set)}
            >
              <SensorUnit 
                sensorSet={set} 
                location="L" 
                lightStatus={selectedSet === set ? sensorLightStatus : 'none'} 
              />
              <SensorUnit 
                sensorSet={set} 
                location="W" 
                lightStatus={selectedSet === set ? sensorLightStatus : 'none'} 
              />
              <SensorUnit 
                sensorSet={set} 
                location="R" 
                lightStatus={selectedSet === set ? sensorLightStatus : 'none'} 
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
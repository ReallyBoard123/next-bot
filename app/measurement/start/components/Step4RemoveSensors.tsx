// app/measurement/start/components/Step4RemoveSensors.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { SensorDock } from '@/components/SensorDock';
import { SensorUnit } from '@/components/SensorUnit';
import { LightStatus } from '@/components/LightIndicator';
import { Check, AlertCircle } from 'lucide-react';

type AnimationState = 'docked' | 'animating' | 'removed';

interface Person {
  id: number;
  name: string;
  sensorSet: string;
}

interface Step4RemoveSensorsProps {
  selectedPerson: Person;
  sensorLightStatus: LightStatus;
  onStepComplete: () => void;
}

export default function Step4RemoveSensors({ 
  selectedPerson, 
  sensorLightStatus,
  onStepComplete 
}: Step4RemoveSensorsProps) {
  const [animationState, setAnimationState] = useState<AnimationState>('docked');
  const [sensorsBlinking, setSensorsBlinking] = useState<boolean | null>(null);
  const [animationOffsets, setAnimationOffsets] = useState({ y: 0, scale: 1 });
  
  // Start animation when component mounts
  useEffect(() => {
    const animationSequence = async () => {
      // Short delay before starting animation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Start animation
      setAnimationState('animating');
      
      // Animation steps
      for (let i = 0; i < 20; i++) {
        setAnimationOffsets({
          y: -5 * i,
          scale: 1 - (i * 0.01)
        });
        await new Promise(resolve => setTimeout(resolve, 30));
      }
      
      // Complete animation
      setAnimationState('removed');
    };
    
    animationSequence();
  }, []);
  
  // Handle blinking status check
  const handleBlinkingCheck = (isBlinking: boolean) => {
    setSensorsBlinking(isBlinking);
  };
  
  const handleContinue = () => {
    if (sensorsBlinking === true) {
      onStepComplete();
    }
  };
  
  return (
    <div className="h-full flex flex-col">
      <h2 className="text-xl font-medium mb-4">
        Remove sensors from the dock
      </h2>
      
      <div className="flex-1 relative overflow-hidden">
        {animationState === 'docked' && (
          <div className="flex-1">
            <SensorDock 
              selectedSet={selectedPerson.sensorSet}
              sensorLightStatus={sensorLightStatus}
              showLabels={false}
            />
          </div>
        )}
        
        {animationState === 'animating' && (
          <div className="flex flex-col">
            {/* Other sensor sets (grayed out) */}
            <div className="opacity-20 mb-4">
              <SensorDock 
                selectedSet={selectedPerson.sensorSet}
                sensorLightStatus="none" 
                showLabels={false}
              />
            </div>
            
            {/* Animating sensors */}
            <div 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out"
              style={{ 
                transform: `translate(-50%, calc(-50% + ${animationOffsets.y}px)) scale(${animationOffsets.scale})`,
                opacity: animationOffsets.scale < 0.5 ? 0 : 1
              }}
            >
              <div className="flex gap-6">
                <SensorUnit 
                  sensorSet={selectedPerson.sensorSet} 
                  location="L" 
                  lightStatus={sensorLightStatus} 
                />
                <SensorUnit 
                  sensorSet={selectedPerson.sensorSet} 
                  location="W" 
                  lightStatus={sensorLightStatus} 
                />
                <SensorUnit 
                  sensorSet={selectedPerson.sensorSet} 
                  location="R" 
                  lightStatus={sensorLightStatus} 
                />
              </div>
            </div>
          </div>
        )}
        
        {animationState === 'removed' && (
          <div className="flex flex-col items-center">
            <div className="flex gap-6 mb-8">
              <SensorUnit 
                sensorSet={selectedPerson.sensorSet} 
                location="L" 
                lightStatus="blinking-blue" 
              />
              <SensorUnit 
                sensorSet={selectedPerson.sensorSet} 
                location="W" 
                lightStatus="blinking-blue" 
              />
              <SensorUnit 
                sensorSet={selectedPerson.sensorSet} 
                location="R" 
                lightStatus="blinking-blue" 
              />
            </div>
            
            <div className="text-center">
              <h3 className="text-lg font-medium mb-4">Are the sensors blinking blue?</h3>
              <div className="flex gap-4 justify-center">
                <Button 
                  variant={sensorsBlinking === true ? "default" : "outline"}
                  onClick={() => handleBlinkingCheck(true)}
                  className="w-32"
                >
                  Yes
                </Button>
                <Button
                  variant={sensorsBlinking === false ? "default" : "outline"}
                  onClick={() => handleBlinkingCheck(false)}
                  className="w-32"
                >
                  No
                </Button>
              </div>
            </div>
            
            {sensorsBlinking === false && (
              <div className="p-4 mt-4 rounded-md bg-amber-50 text-amber-700 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Sensors not ready</p>
                  <p className="text-sm">Please return sensors to the dock and try again. If sensors show orange after removing, that's also acceptable.</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="mt-4">
        <Button 
          onClick={handleContinue}
          disabled={animationState !== 'removed' || sensorsBlinking !== true}
          className="w-full"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
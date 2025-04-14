// app/measurement/start/components/Step4RemoveSensors.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { SensorDock } from '@/components/SensorDock';
import { SensorSet, SensorUnit } from '@/components/SensorUnit';
import { LightStatus } from '@/components/LightIndicator';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { DraggableSensorUnit } from '@/components/DraggableSensorUnit';

interface Person {
  id: number;
  name: string;
  sensorSet: string;
}

interface Step4RemoveSensorsProps {
  selectedPerson: Person;
  sensorLightStatus: LightStatus;
  onStepComplete: () => void;
  onStepBack: () => void;
}

export default function Step4RemoveSensors({ 
  selectedPerson, 
  sensorLightStatus,
  onStepComplete,
  onStepBack
}: Step4RemoveSensorsProps) {
  // Track which sensors have been dragged
  const [draggedSensors, setDraggedSensors] = useState({
    L: false,
    W: false,
    R: false
  });
  
  const [sensorsBlinking, setSensorsBlinking] = useState<boolean | null>(null);
  const [showSensorLightQuestion, setShowSensorLightQuestion] = useState(false);
  
  // Check if all sensors have been dragged
  const allSensorsDragged = draggedSensors.L && draggedSensors.W && draggedSensors.R;
  
  // Show sensor light question when all sensors have been dragged
  useEffect(() => {
    if (allSensorsDragged && !showSensorLightQuestion) {
      // Add a small delay to show the question after all sensors are dragged
      const timer = setTimeout(() => {
        setShowSensorLightQuestion(true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [allSensorsDragged, showSensorLightQuestion]);
  
  // Handle completing a sensor drag
  const handleSensorDragComplete = (location: 'L' | 'W' | 'R') => {
    setDraggedSensors(prev => ({
      ...prev,
      [location]: true
    }));
  };
  
  // Handle blinking status check
  const handleBlinkingCheck = (isBlinking: boolean) => {
    setSensorsBlinking(isBlinking);
  };
  
  // Handle continue button
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
        {/* Display dock with sensors if none have been dragged yet */}
        {!draggedSensors.L && !draggedSensors.W && !draggedSensors.R && (
          <div className="flex-1">
            <SensorDock 
              selectedSet={selectedPerson.sensorSet}
              sensorLightStatus={sensorLightStatus}
              showLabels={false}
            />
          </div>
        )}
        
        {/* Display the draggable sensors */}
        {(!allSensorsDragged || !showSensorLightQuestion) && (
          <div className="flex flex-col mt-4">
            {/* The dock background (grayed out) */}
            {(draggedSensors.L || draggedSensors.W || draggedSensors.R) && (
              <div className="opacity-20 mb-4">
                <SensorDock 
                  selectedSet={selectedPerson.sensorSet}
                  sensorLightStatus="none" 
                  showLabels={false}
                />
              </div>
            )}
            
            {/* Draggable sensors */}
            <div className="flex justify-center gap-6 my-6">
              {!draggedSensors.L && (
                <DraggableSensorUnit
                  sensorSet={selectedPerson.sensorSet as SensorSet}
                  location="L"
                  lightStatus={sensorLightStatus}
                  onDragComplete={() => handleSensorDragComplete('L')}
                />
              )}
              
              {!draggedSensors.W && (
                <DraggableSensorUnit
                  sensorSet={selectedPerson.sensorSet as SensorSet}
                  location="W"
                  lightStatus={sensorLightStatus}
                  onDragComplete={() => handleSensorDragComplete('W')}
                />
              )}
              
              {!draggedSensors.R && (
                <DraggableSensorUnit
                  sensorSet={selectedPerson.sensorSet as SensorSet}
                  location="R"
                  lightStatus={sensorLightStatus}
                  onDragComplete={() => handleSensorDragComplete('R')}
                />
              )}
            </div>
            
            {/* Instructions */}
            {!allSensorsDragged && (
              <div className="text-center mt-4 text-muted-foreground">
                <p>Drag each sensor upward to remove it from the dock</p>
              </div>
            )}
          </div>
        )}
        
        {/* Once all sensors are dragged, show the blinking blue question */}
        {showSensorLightQuestion && (
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
                  <p className="text-sm">Please return sensors to the dock and try again. If sensors show orange after removing, that&apos;s also acceptable.</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="mt-4 flex justify-between">
        <Button 
          variant="outline" 
          onClick={onStepBack}
          className="flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        
        <Button 
          onClick={handleContinue}
          disabled={!showSensorLightQuestion || sensorsBlinking !== true}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
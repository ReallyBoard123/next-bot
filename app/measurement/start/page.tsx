// app/measurement/start/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { StepType } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { Check, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { SensorDock } from '@/components/SensorDock';
import { SensorUnit } from '@/components/SensorUnit';

// Step definitions for the start workflow
const steps = [
  {
    id: StepType.START_DECK_LIGHT,
    title: 'Check Dock Lights',
    description: 'Verify that the light on the sensor dock is blue',
  },
  {
    id: StepType.START_SENSOR_SELECTION,
    title: 'Select Sensor Set',
    description: 'Choose a sensor set with green lights',
  },
  {
    id: StepType.START_REMOVE_SENSORS,
    title: 'Remove Sensors',
    description: 'Take out the left, waist, and right sensors',
  },
  {
    id: StepType.START_PLACE_SENSORS,
    title: 'Place Sensors',
    description: 'Place sensors on the correct body positions',
  },
];

export default function StartMeasurement() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedSensorSet, setSelectedSensorSet] = useState('');
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initiate a new measurement session
  const startSession = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/measurements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'start',
          sensorSet: selectedSensorSet,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to start session');
      }

      setSessionId(data.session.id);
      return data.session.id;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start session');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Record a step completion
  const recordStep = async (stepId: StepType, feedback?: string) => {
    // If no session yet, create one first
    let activeSessionId = sessionId;
    if (!activeSessionId && currentStep >= 1) {
      activeSessionId = await startSession();
      if (!activeSessionId) return false;
    }

    if (!activeSessionId) return true; // Skip for first step where we don't need a session yet

    try {
      setLoading(true);
      
      const response = await fetch('/api/measurements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'recordStep',
          sessionId: activeSessionId,
          stepNumber: currentStep + 1,
          stepType: stepId,
          feedback,
        }),
      });

      const data = await response.json();
      return data.success;
    } catch (err) {
      console.error('Failed to record step:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Handle next step
  const handleNext = async () => {
    // Record current step
    const stepId = steps[currentStep].id;
    await recordStep(stepId);

    // Move to next step or complete
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Session complete!
      router.push('/measurement/start/complete');
    }
  };

  // Handle going back to previous step
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      router.push('/');
    }
  };

  // Render the content for the current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Check dock lights
        return (
          <div className="space-y-4">
            <div className="bg-gray-100 rounded-lg p-6 flex justify-center">
              {/* This would be replaced with a proper illustration */}
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="w-16 h-16 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
                <p className="text-sm text-muted-foreground">Blue light on sensor dock</p>
              </div>
            </div>
            <p className="text-sm">
              Make sure the light on the sensor dock is blue before proceeding.
            </p>
          </div>
        );
        
      case 1: // Select sensor set
        return (
          <div className="space-y-4">
            <p className="text-sm mb-4">
              Select which sensor set you'll be using. Make sure the lights on the 
              sensor units are <span className="text-green-500 font-medium">green</span>.
            </p>
            
            <SensorDock 
              selectedSet={selectedSensorSet}
              onSelectSet={setSelectedSensorSet}
              sensorLightStatus="green"
            />
            
            {!selectedSensorSet && (
              <p className="text-sm text-amber-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                Please select a sensor set to continue
              </p>
            )}
          </div>
        );
        
      case 2: // Remove sensors
        return (
          <div className="space-y-4">
            <p className="text-sm mb-4">
              Remove the three sensor units from the dock. The lights on each 
              sensor should change to <span className="text-blue-500 font-medium animate-pulse">blinking blue</span>.
            </p>
            
            <div className="flex justify-center gap-4 py-4">
              <SensorUnit 
                sensorSet={selectedSensorSet} 
                location="L" 
                lightStatus="blinking-blue" 
              />
              <SensorUnit 
                sensorSet={selectedSensorSet} 
                location="W" 
                lightStatus="blinking-blue" 
              />
              <SensorUnit 
                sensorSet={selectedSensorSet} 
                location="R" 
                lightStatus="blinking-blue" 
              />
            </div>
            
            <p className="text-sm text-muted-foreground">
              This indicates that the sensors are active and ready to collect data.
            </p>
          </div>
        );
        
      case 3: // Place sensors
        return (
          <div className="space-y-4">
            <p className="text-sm mb-4">
              Place each sensor in its correct position:
            </p>
            
            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col items-center">
                <div className="mb-2">
                  <SensorUnit 
                    sensorSet={selectedSensorSet} 
                    location="L" 
                    lightStatus="blinking-blue" 
                    className="w-16 h-24"
                  />
                </div>
                <p className="text-xs font-medium">Left Arm Band</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="mb-2">
                  <SensorUnit 
                    sensorSet={selectedSensorSet} 
                    location="W" 
                    lightStatus="blinking-blue" 
                    className="w-16 h-24"
                  />
                </div>
                <p className="text-xs font-medium">Waist Belt</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="mb-2">
                  <SensorUnit 
                    sensorSet={selectedSensorSet} 
                    location="R" 
                    lightStatus="blinking-blue" 
                    className="w-16 h-24"
                  />
                </div>
                <p className="text-xs font-medium">Right Arm Band</p>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Ensure the sensors are securely attached in the correct orientation.
            </p>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">Start Measurement</h1>
          <p className="text-muted-foreground">
            {selectedSensorSet ? `Sensor Set: ${selectedSensorSet}` : 'Select a sensor set'}
          </p>
        </div>
        
        {/* Progress steps */}
        <div className="mb-6">
          <div className="flex items-center">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`
                  flex items-center justify-center w-8 h-8 rounded-full border-2
                  ${index === currentStep 
                    ? 'border-blue-600 bg-blue-50 text-blue-600' 
                    : index < currentStep
                      ? 'border-green-500 bg-green-500 text-white'
                      : 'border-gray-300 text-gray-400'}
                `}>
                  {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-1 ${
                    index < currentStep ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <div className="text-xs">{steps[0].title}</div>
            <div className="text-xs">{steps[steps.length - 1].title}</div>
          </div>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-800 rounded-md text-sm">
            {error}
          </div>
        )}
        
        {/* Content */}
        <Card className="mb-6">
          <div className="p-4 border-b">
            <h2 className="font-semibold">{steps[currentStep].title}</h2>
            <p className="text-sm text-muted-foreground">{steps[currentStep].description}</p>
          </div>
          
          <div className="p-6">
            {renderStepContent()}
          </div>
        </Card>
        
        {/* Navigation */}
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handleBack}
            disabled={loading}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <Button 
            onClick={handleNext}
            disabled={loading || (currentStep === 1 && !selectedSensorSet)}
          >
            {loading ? 'Loading...' : currentStep === steps.length - 1 ? 'Complete' : 'Next'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
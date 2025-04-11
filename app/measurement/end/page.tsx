// app/measurement/end/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { StepType, MeasurementStatus } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SensorDock } from '@/components/SensorDock';
import { SensorUnit } from '@/components/SensorUnit';
import { Check, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';

// Step definitions for the end workflow
const steps = [
  {
    id: StepType.END_REMOVE_SENSORS,
    title: 'Remove Sensors',
    description: 'Take out the sensors from your body',
  },
  {
    id: StepType.END_RETURN_SENSORS,
    title: 'Return Sensors',
    description: 'Place sensors back in their correct slots',
  },
  {
    id: StepType.END_CHECK_LIGHTS,
    title: 'Check Lights',
    description: 'Verify the lights have changed color',
  }
];

export default function EndMeasurement() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedSensorSet, setSelectedSensorSet] = useState('');
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Record a step completion
  const recordStep = async (stepId: StepType, feedback?: string) => {
    if (!sessionId && currentStep >= 0) {
      // Create a new session ID for this end process
      // In a real app, you might want to look up the active session instead
      try {
        setLoading(true);
        
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
          throw new Error(data.error || 'Failed to start end session');
        }
        
        setSessionId(data.session.id);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to start end session');
        return false;
      } finally {
        setLoading(false);
      }
    }
    
    try {
      setLoading(true);
      
      const response = await fetch('/api/measurements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'recordStep',
          sessionId: sessionId,
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

  // Complete the measurement session
  const completeSession = async () => {
    if (!sessionId) return false;
    
    try {
      setLoading(true);
      
      const response = await fetch('/api/measurements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'complete',
          sessionId: sessionId,
          status: MeasurementStatus.COMPLETED,
          dataUploaded: true,
        }),
      });
      
      const data = await response.json();
      return data.success;
    } catch (err) {
      console.error('Failed to complete session:', err);
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
      // Complete the session
      await completeSession();
      router.push('/measurement/end/complete');
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
      case 0: // Remove sensors from body
        return (
          <div className="space-y-4">
            <p className="text-sm mb-2">
              Remove the three sensor units from your body. The sensors should still be 
              <span className="text-blue-500 font-medium animate-pulse"> blinking blue</span>.
            </p>
            
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="mb-4">
                <p className="text-sm mb-2">Which sensor set are you using?</p>
                <div className="grid grid-cols-4 gap-2">
                  {['32-A', '32-B', '32-C', '32-D', '32-E', '32-F', '32-G', '32-H'].map((set) => (
                    <Button 
                      key={set}
                      variant={selectedSensorSet === set ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setSelectedSensorSet(set)}
                      className="text-xs"
                    >
                      {set}
                    </Button>
                  ))}
                </div>
              </div>
              
              {selectedSensorSet && (
                <div className="flex justify-center gap-4 py-2">
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
              )}
            </div>
            
            {!selectedSensorSet && (
              <p className="text-sm text-amber-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                Please select a sensor set to continue
              </p>
            )}
          </div>
        );
        
      case 1: // Return sensors to dock
        return (
          <div className="space-y-4">
            <p className="text-sm mb-4">
              Return each sensor to its correct slot in the dock:
            </p>
            
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="flex flex-col items-center">
                <div className="mb-2">
                  <SensorUnit 
                    sensorSet={selectedSensorSet} 
                    location="L" 
                    lightStatus="blinking-blue" 
                    className="w-16 h-24"
                  />
                </div>
                <p className="text-xs font-medium">Left Slot (L)</p>
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
                <p className="text-xs font-medium">Middle Slot (W)</p>
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
                <p className="text-xs font-medium">Right Slot (R)</p>
              </div>
            </div>
            
            <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-sm text-blue-800">
                Make sure to place each sensor in its correct position to ensure proper data upload.
              </p>
            </div>
          </div>
        );
        
      case 2: // Check lights
        return (
          <div className="space-y-4">
            <p className="text-sm mb-4">
              After inserting the sensors back into the dock, check that:
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-md">
                <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                <p className="text-sm">
                  <span className="font-medium">Sensors:</span> Light turns orange (charging)
                </p>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-md">
                <div className="w-4 h-4 rounded-full bg-sky-200"></div>
                <p className="text-sm">
                  <span className="font-medium">Dock:</span> Light turns white-bluish (data uploading)
                </p>
              </div>
            </div>
            
            <div className="flex justify-center py-4">
              <SensorDock 
                selectedSet={selectedSensorSet}
                sensorLightStatus="orange"
                dockLightStatus="white-blue"
                className="w-full max-w-xs"
              />
            </div>
            
            <p className="text-sm text-muted-foreground">
              The data will upload automatically. This process takes about 5 minutes.
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
          <h1 className="text-2xl font-bold mb-1">End Measurement</h1>
          <p className="text-muted-foreground">
            {selectedSensorSet ? `Sensor Set: ${selectedSensorSet}` : 'Select your sensor set'}
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
                    ? 'border-orange-600 bg-orange-50 text-orange-600' 
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
            disabled={loading || (currentStep === 0 && !selectedSensorSet)}
            className={currentStep === steps.length - 1 ? 'bg-orange-600 hover:bg-orange-700' : ''}
          >
            {loading ? 'Loading...' : currentStep === steps.length - 1 ? 'Complete' : 'Next'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
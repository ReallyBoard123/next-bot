// app/measurement/start/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { StepType } from '@prisma/client';
import { Check, ChevronLeft, AlertCircle } from 'lucide-react';
import { LightStatus } from '@/components/LightIndicator';

// Import step components
import Step1Name from './components/Step1Name';
import Step2DockLight from './components/Step2DockLight';
import Step3SensorLight from './components/Step3SensorLight';
import Step4RemoveSensors from './components/Step4RemoveSensors';
import Step5Placement from './components/Step5Placement';

// Step definitions
const steps = [
  {
    id: StepType.START_SELECT_PERSON,
    title: 'Select Person',
    description: 'Choose your name',
  },
  {
    id: StepType.START_DECK_LIGHT,
    title: 'Check Dock Lights',
    description: 'Verify dock light color',
  },
  {
    id: StepType.START_SENSOR_LIGHT,
    title: 'Check Sensor Lights',
    description: 'Verify sensor light color',
  },
  {
    id: StepType.START_REMOVE_SENSORS,
    title: 'Remove Sensors',
    description: 'Take out all three sensors',
  },
  {
    id: StepType.START_PLACE_SENSORS,
    title: 'Place Sensors',
    description: 'Attach to correct positions',
  },
];

type Person = {
  id: number;
  name: string;
  sensorSet: string;
};

export default function StartMeasurement() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [sensorLightStatus, setSensorLightStatus] = useState<LightStatus>('green');
  const [error, setError] = useState<string | null>(null);
  
  // Handle person selection
  const handlePersonSelect = (person: Person) => {
    setSelectedPerson(person);
  };
  
  // Handle step completion and move to next step
  const handleStepComplete = async () => {
    // When name selection is complete, create session in database
    if (currentStep === 0 && selectedPerson) {
      try {
        const response = await fetch('/api/measurements', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'start',
            sensorSet: selectedPerson.sensorSet,
            personId: selectedPerson.id
          }),
        });
        
        const data = await response.json();
        if (data.success) {
          setSessionId(data.session.id);
        } else {
          setError('Failed to create measurement session');
          return;
        }
      } catch (err) {
        setError('Network error when creating session');
        return;
      }
    }
    
    // Record step completion if we have a session ID
    if (sessionId) {
      try {
        await fetch('/api/measurements', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'recordStep',
            sessionId: sessionId,
            stepNumber: currentStep + 1,
            stepType: steps[currentStep].id,
          }),
        });
      } catch (err) {
        console.error('Error recording step:', err);
        // Continue anyway - non-critical error
      }
    }
    
    // Move to next step or complete
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.push('/measurement/start/complete');
    }
  };
  
  // Handle going back to previous step
  const handleStepBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      router.push('/');
    }
  };

  // Render step content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Step1Name
            onPersonSelect={handlePersonSelect}
            onStepComplete={handleStepComplete}
          />
        );
      case 1:
        return (
          <Step2DockLight
            onStepComplete={handleStepComplete}
            onStepBack={handleStepBack}
          />
        );
      case 2:
        return selectedPerson ? (
          <Step3SensorLight
            selectedPerson={selectedPerson}
            onStepComplete={() => {
              setSensorLightStatus('green'); // Save the light status
              handleStepComplete();
            }}
            onStepBack={handleStepBack}
          />
        ) : null;
      case 3:
        return selectedPerson ? (
          <Step4RemoveSensors
            selectedPerson={selectedPerson}
            sensorLightStatus={sensorLightStatus}
            onStepComplete={handleStepComplete}
            onStepBack={handleStepBack}
          />
        ) : null;
      case 4:
        return selectedPerson ? (
          <Step5Placement
            selectedPerson={selectedPerson}
            onStepComplete={handleStepComplete}
            onStepBack={handleStepBack}
          />
        ) : null;
      default:
        return null;
    }
  };
  
  return (
    <div className="h-screen flex flex-col">
      <div className="flex items-center p-2 border-b">
        <Link href="/" className="flex items-center text-sm text-muted-foreground">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Dashboard
        </Link>
        <div className="flex-1 flex justify-end">
          <p className="text-sm text-muted-foreground">
            {selectedPerson ? `${selectedPerson.name} - Set: ${selectedPerson.sensorSet}` : ''}
          </p>
        </div>
      </div>
      
      <div className="flex-1 p-3 grid grid-cols-12 gap-3">
        {/* Left sidebar - steps */}
        <div className="col-span-4 bg-white rounded-lg border p-3">
          {steps.map((step, index) => (
            <div 
              key={step.id} 
              className={`flex items-start mb-2 ${
                index === currentStep 
                  ? 'text-blue-600 bg-blue-50 p-2 rounded-md' 
                  : index < currentStep 
                    ? 'text-green-600 p-2' 
                    : 'text-gray-500 p-2'
              }`}
              onClick={() => {
                // Allow clicking on completed steps to go back
                if (index < currentStep) {
                  setCurrentStep(index);
                }
              }}
              style={{ 
                cursor: index < currentStep ? 'pointer' : 'default' 
              }}
            >
              <div className={`
                flex items-center justify-center w-7 h-7 rounded-full
                ${index === currentStep 
                  ? 'border-2 border-blue-600 bg-blue-50 text-blue-600' 
                  : index < currentStep
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-500 border border-gray-300'}
              `}>
                {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
              </div>
              <div className="ml-2">
                <p className="text-sm font-medium">{step.title}</p>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Main content area */}
        <div className="col-span-8 bg-white rounded-lg border flex flex-col overflow-hidden">
          {/* Display error if any */}
          {error && (
            <div className="p-3 m-2 bg-red-50 text-red-800 rounded-md text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          {/* Content */}
          <div className="flex-1 p-4">
            {renderStepContent()}
          </div>
          
          {/* Action hints */}
          <div className="border-t p-2 bg-gray-50">
            <p className="text-xs text-muted-foreground">
              {currentStep === 0 && "Select your name from the list to get started."}
              {currentStep === 1 && "Check the color of the light on your sensor dock."}
              {currentStep === 2 && "Verify the color of the lights on your assigned sensors."}
              {currentStep === 3 && "Drag each sensor upward to remove it from the dock."}
              {currentStep === 4 && "Attach each sensor to the correct position on your body."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
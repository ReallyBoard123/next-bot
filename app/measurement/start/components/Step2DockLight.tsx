// app/measurement/start/components/Step2DockLight.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LightIndicator, type LightStatus } from '@/components/LightIndicator';
import { Check, AlertCircle, Clock, ArrowLeft } from 'lucide-react';

type LightCheckStatus = 'unchecked' | 'correct' | 'incorrect';

interface Step2DockLightProps {
  onStepComplete: () => void;
  onStepBack: () => void;
}

export default function Step2DockLight({ onStepComplete, onStepBack }: Step2DockLightProps) {
  // Default to blue light status instead of none
  const [dockLightStatus, setDockLightStatus] = useState<LightStatus>('blue');
  const [lightCheckStatus, setLightCheckStatus] = useState<LightCheckStatus>('unchecked');
  const [message, setMessage] = useState('');
  const [waitCountdown, setWaitCountdown] = useState(0);
  
  // Countdown timer for waiting periods
  useEffect(() => {
    if (waitCountdown > 0) {
      const timer = setTimeout(() => {
        setWaitCountdown(waitCountdown - 1);
        
        // When countdown reaches zero, allow proceeding if it was red
        if (waitCountdown === 1 && dockLightStatus === 'red') {
          setMessage('You may proceed now or replug the dock if needed.');
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [waitCountdown, dockLightStatus]);
  
  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handler for dock light status check
  const handleDockLightCheck = (status: LightStatus) => {
    setDockLightStatus(status);
    
    if (status === 'blue') {
      setLightCheckStatus('correct');
      setMessage('Dock is ready for operation');
      setWaitCountdown(0);
    } else if (status === 'red') {
      setLightCheckStatus('incorrect');
      setMessage('Dock is indicating an error. Please wait 2 minutes...');
      setWaitCountdown(120); // 2 minutes
    } else if (status === 'white-blue') {
      setLightCheckStatus('incorrect');
      setMessage('Data upload in progress. Please wait for completion.');
      setWaitCountdown(60); // 1 minute as example
    } else if (status === 'green') {
      setLightCheckStatus('incorrect');
      setMessage('Data upload via pendrive successful. Please remove pendrive.');
      setWaitCountdown(0);
    } else if (status === 'none') {
      setLightCheckStatus('incorrect');
      setMessage('No light detected. Please check if the dock is powered on.');
      setWaitCountdown(0);
    } else {
      setLightCheckStatus('incorrect');
      setMessage('Unknown dock status. Please check the connection.');
      setWaitCountdown(0);
    }
  };
  
  const handleContinue = () => {
    if (dockLightStatus === 'blue' || (dockLightStatus === 'red' && waitCountdown === 0)) {
      onStepComplete();
    }
  };
  
  return (
    <div className="h-full flex flex-col">
      <h2 className="text-xl font-medium mb-4">What color is the light on the sensor dock?</h2>
      
      <div className="mb-6 flex justify-center">
        <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
          <LightIndicator 
            status={dockLightStatus} 
            type="dock" 
            size="lg"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { status: 'blue', label: 'Blue' },
          { status: 'red', label: 'Red' },
          { status: 'white-blue', label: 'White-Blue' },
          { status: 'green', label: 'Green' },
          { status: 'none', label: 'No Light' },
        ].map((item) => (
          <button
            key={item.status}
            className={`flex flex-col items-center p-3 rounded-lg border-2 ${
              dockLightStatus === item.status 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleDockLightCheck(item.status as LightStatus)}
            disabled={waitCountdown > 0}
          >
            <LightIndicator 
              status={item.status as LightStatus} 
              type="dock" 
              size="md"
            />
            <span className="mt-2 text-sm">{item.label}</span>
          </button>
        ))}
      </div>
      
      {lightCheckStatus !== 'unchecked' && (
        <div className={`p-4 rounded-md w-full flex items-start gap-3 mb-6 ${
          lightCheckStatus === 'correct' ? 'bg-green-50' : 'bg-amber-50'
        }`}>
          {lightCheckStatus === 'correct' ? (
            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          )}
          <div>
            <p className={`text-base font-medium ${
              lightCheckStatus === 'correct' ? 'text-green-700' : 'text-amber-700'
            }`}>
              {lightCheckStatus === 'correct' ? 'Dock is ready' : 'Action required'}
            </p>
            <p className={`text-sm ${
              lightCheckStatus === 'correct' ? 'text-green-600' : 'text-amber-600'
            }`}>
              {message}
            </p>
            
            {waitCountdown > 0 && (
              <div className="mt-2 flex items-center text-amber-600">
                <Clock className="w-4 h-4 mr-2" />
                <span>Please wait: {formatTime(waitCountdown)}</span>
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="mt-auto flex justify-between">
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
          disabled={
            lightCheckStatus === 'unchecked' || 
            (lightCheckStatus === 'incorrect' && waitCountdown > 0 && dockLightStatus !== 'green')
          }
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
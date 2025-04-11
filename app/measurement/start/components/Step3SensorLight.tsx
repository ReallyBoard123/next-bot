// app/measurement/start/components/Step3SensorLight.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { SensorUnit } from '@/components/SensorUnit';
import { LightIndicator, type LightStatus } from '@/components/LightIndicator';
import { Check, AlertCircle, Clock } from 'lucide-react';

type LightCheckStatus = 'unchecked' | 'correct' | 'incorrect';

interface Person {
  id: number;
  name: string;
  sensorSet: string;
}

interface Step3SensorLightProps {
  selectedPerson: Person;
  onStepComplete: () => void;
}

export default function Step3SensorLight({ selectedPerson, onStepComplete }: Step3SensorLightProps) {
  const [sensorLightStatus, setSensorLightStatus] = useState<LightStatus>('none');
  const [lightCheckStatus, setLightCheckStatus] = useState<LightCheckStatus>('unchecked');
  const [message, setMessage] = useState('');
  const [waitCountdown, setWaitCountdown] = useState(0);
  
  // Countdown timer for waiting periods
  useEffect(() => {
    if (waitCountdown > 0) {
      const timer = setTimeout(() => {
        setWaitCountdown(waitCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [waitCountdown]);
  
  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handler for sensor light status check
  const handleSensorLightCheck = (status: LightStatus) => {
    setSensorLightStatus(status);
    
    if (status === 'green') {
      setLightCheckStatus('correct');
      setMessage('Sensors fully charged and ready for measurement');
      setWaitCountdown(0);
    } else if (status === 'orange') {
      setLightCheckStatus('correct');
      setMessage('Sensors charging but can be used for measurement');
      setWaitCountdown(0);
    } else if (status === 'red') {
      setLightCheckStatus('incorrect');
      setMessage('Sensors are in the wrong slot. Please rearrange them correctly.');
      setWaitCountdown(0);
    } else if (status === 'blinking-blue') {
      setLightCheckStatus('incorrect');
      setMessage('Sensors are still recording from last session. Return them to the dock and try again.');
      setWaitCountdown(0);
    } else if (status === 'none') {
      setLightCheckStatus('incorrect');
      setMessage('Sensors have no battery. Please charge for at least 2 hours.');
      setWaitCountdown(30); // Demo: 30s instead of 2h
    } else {
      setLightCheckStatus('incorrect');
      setMessage('Unknown status. Please check sensors and dock connection.');
      setWaitCountdown(0);
    }
  };
  
  const handleContinue = () => {
    if (lightCheckStatus === 'correct') {
      onStepComplete();
    }
  };
  
  return (
    <div className="h-full flex flex-col">
      <h2 className="text-xl font-medium mb-4">
        What color are the lights on the sensors?
      </h2>
      
      <div className="mb-4 flex justify-center">
        <div className="flex gap-6">
          <SensorUnit 
            sensorSet={selectedPerson.sensorSet} 
            location="L" 
            lightStatus={sensorLightStatus !== 'none' ? sensorLightStatus : 'green'} 
          />
          <SensorUnit 
            sensorSet={selectedPerson.sensorSet} 
            location="W" 
            lightStatus={sensorLightStatus !== 'none' ? sensorLightStatus : 'green'} 
          />
          <SensorUnit 
            sensorSet={selectedPerson.sensorSet} 
            location="R" 
            lightStatus={sensorLightStatus !== 'none' ? sensorLightStatus : 'green'} 
          />
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { status: 'green', label: 'Green' },
          { status: 'orange', label: 'Orange' },
          { status: 'red', label: 'Red' },
          { status: 'blinking-blue', label: 'Blinking Blue' },
          { status: 'none', label: 'No Light' },
        ].map((item) => (
          <button
            key={item.status}
            className={`flex flex-col items-center p-3 rounded-lg border-2 ${
              sensorLightStatus === item.status 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleSensorLightCheck(item.status as LightStatus)}
            disabled={waitCountdown > 0}
          >
            <LightIndicator 
              status={item.status as LightStatus} 
              type="sensor" 
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
              {lightCheckStatus === 'correct' ? 'Sensors are ready' : 'Action required'}
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
      
      <div className="mt-auto">
        <Button 
          onClick={handleContinue}
          disabled={lightCheckStatus !== 'correct' || waitCountdown > 0}
          className="w-full"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
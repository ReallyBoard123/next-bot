// app/measurement/start/components/Step5Placement.tsx
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { SensorUnit } from '@/components/SensorUnit';
import { ArrowLeft } from 'lucide-react';

interface Person {
  id: number;
  name: string;
  sensorSet: string;
}

interface Step5PlacementProps {
  selectedPerson: Person;
  onStepComplete: () => void;
  onStepBack: () => void;
}

export default function Step5Placement({ 
  selectedPerson, 
  onStepComplete, 
  onStepBack 
}: Step5PlacementProps) {
  return (
    <div className="h-full flex flex-col">
      <h2 className="text-xl font-medium mb-4">
        Attach each sensor to its correct position
      </h2>
      
      <div className="flex-1 grid grid-cols-3 gap-6">
        <div className="flex flex-col items-center">
          <SensorUnit 
            sensorSet={selectedPerson.sensorSet} 
            location="L" 
            lightStatus="blinking-blue" 
            className="w-24 h-32 mb-3"
          />
          <div className="text-center">
            <h3 className="font-medium">Left Arm</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Attach to left arm band
            </p>
            <div className="h-48 w-48 relative">
              <Image 
                src="/sensor/left.png" 
                alt="Left arm placement" 
                width={192}
                height={192}
                className="object-contain"
              />
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          <SensorUnit 
            sensorSet={selectedPerson.sensorSet} 
            location="W" 
            lightStatus="blinking-blue" 
            className="w-24 h-32 mb-3"
          />
          <div className="text-center">
            <h3 className="font-medium">Waist</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Attach to waist belt
            </p>
            <div className="h-48 w-48 relative">
              <Image 
                src="/sensor/waist.png" 
                alt="Waist placement" 
                width={192}
                height={192}
                className="object-contain"
              />
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          <SensorUnit 
            sensorSet={selectedPerson.sensorSet} 
            location="R" 
            lightStatus="blinking-blue" 
            className="w-24 h-32 mb-3"
          />
          <div className="text-center">
            <h3 className="font-medium">Right Arm</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Attach to right arm band
            </p>
            <div className="h-48 w-48 relative">
              <Image 
                src="/sensor/right.png" 
                alt="Right arm placement" 
                width={192}
                height={192}
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 bg-blue-50 p-4 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-2">Important:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Ensure sensors are securely attached to avoid movement</li>
          <li>• All sensors should be blinking blue during measurement</li>
          <li>• Keep sensors away from water and excessive heat</li>
        </ul>
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
          onClick={onStepComplete}
        >
          Complete Setup
        </Button>
      </div>
    </div>
  );
}
// app/measurement/check/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SensorDock } from '@/components/SensorDock';
import { CheckCircle2, XCircle, RotateCw, Clock } from 'lucide-react';

type CheckStatus = 'idle' | 'checking' | 'success' | 'error';

export default function CheckStatus() {
  const router = useRouter();
  const [selectedSensorSet, setSelectedSensorSet] = useState('');
  const [checkStatus, setCheckStatus] = useState<CheckStatus>('idle');
  const [lastChecked, setLastChecked] = useState<string | null>(null);
  
  // All sensor sets
  const sensorSets = ['32-A', '32-B', '32-C', '32-D', '32-E', '32-F', '32-G', '32-H'];
  
  // Check data upload status
  const checkDataStatus = async () => {
    if (!selectedSensorSet) return;
    
    setCheckStatus('checking');
    
    try {
      // In a real app, this would call your API with the sensor set
      // Simulate API call for demo
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock result - 80% chance of success
      const success = Math.random() > 0.2;
      setCheckStatus(success ? 'success' : 'error');
      
      // Record time of check
      const now = new Date();
      setLastChecked(`${now.toLocaleDateString()} ${now.toLocaleTimeString()}`);
    } catch (error) {
      setCheckStatus('error');
    }
  };
  
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">Check Data Status</h1>
          <p className="text-muted-foreground">
            Verify if data was successfully uploaded
          </p>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Select Sensor Set</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sensor-set">Sensor Set</Label>
              <Select
                value={selectedSensorSet}
                onValueChange={setSelectedSensorSet}
              >
                <SelectTrigger id="sensor-set" className="w-full">
                  <SelectValue placeholder="Select a sensor set" />
                </SelectTrigger>
                <SelectContent>
                  {sensorSets.map((set) => (
                    <SelectItem key={set} value={set}>
                      {set}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedSensorSet && (
              <div className="pt-2">
                <SensorDock 
                  selectedSet={selectedSensorSet}
                  className="border rounded-md"
                  sensorLightStatus="none"
                  showLabels={false}
                />
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => router.push('/')}
            >
              Back to Dashboard
            </Button>
            
            <Button
              onClick={checkDataStatus}
              disabled={!selectedSensorSet || checkStatus === 'checking'}
            >
              {checkStatus === 'checking' ? (
                <>
                  <RotateCw className="w-4 h-4 mr-2 animate-spin" />
                  Checking...
                </>
              ) : (
                'Check Status'
              )}
            </Button>
          </CardFooter>
        </Card>
        
        {checkStatus !== 'idle' && (
          <Card className="bg-gray-50">
            <CardHeader className="border-b bg-white">
              <CardTitle className="text-lg">
                Status Report
                {lastChecked && <span className="text-xs text-muted-foreground block mt-1">
                  Last checked: {lastChecked}
                </span>}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="pt-6">
              {checkStatus === 'checking' ? (
                <div className="flex items-center justify-center py-4">
                  <Clock className="w-10 h-10 text-blue-500 animate-pulse" />
                  <p className="ml-4 text-lg font-medium">Checking data status...</p>
                </div>
              ) : checkStatus === 'success' ? (
                <div className="space-y-4">
                  <div className="flex items-center">
                    <CheckCircle2 className="w-8 h-8 text-green-500 mr-4" />
                    <div>
                      <h3 className="font-medium">Data Upload Successful</h3>
                      <p className="text-sm text-muted-foreground">
                        The data from {selectedSensorSet} was successfully uploaded to the database.
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-md">
                    <h4 className="text-sm font-medium text-green-800 mb-2">Data Available:</h4>
                    <ul className="text-sm text-green-700 space-y-1 pl-5 list-disc">
                      <li>Raw sensor readings</li>
                      <li>Processed measurement data</li>
                      <li>Calibration metrics</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center">
                    <XCircle className="w-8 h-8 text-red-500 mr-4" />
                    <div>
                      <h3 className="font-medium">Data Upload Failed</h3>
                      <p className="text-sm text-muted-foreground">
                        No data was found for {selectedSensorSet} or the upload was incomplete.
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-red-50 p-4 rounded-md">
                    <h4 className="text-sm font-medium text-red-800 mb-2">Troubleshooting:</h4>
                    <ul className="text-sm text-red-700 space-y-1 pl-5 list-disc">
                      <li>Ensure sensors were returned to the correct slots</li>
                      <li>Verify the dock was connected to power</li>
                      <li>Check that the upload process completed (5 minutes)</li>
                      <li>Try ending the measurement process again</li>
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
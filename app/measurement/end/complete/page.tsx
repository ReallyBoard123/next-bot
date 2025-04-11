// app/measurement/end/complete/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Clock, RotateCw, XCircle } from 'lucide-react';

export default function EndComplete() {
  const router = useRouter();
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes in seconds
  const [dataUploaded, setDataUploaded] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);
  
  // Countdown timer for data upload
  useEffect(() => {
    if (timeRemaining > 0 && dataUploaded === null) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [timeRemaining, dataUploaded]);
  
  // Format time remaining as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Check data upload status
  const checkDataStatus = async () => {
    setChecking(true);
    
    // Simulate API call - in a real app, you would call your API with the session ID
    setTimeout(() => {
      // 80% chance of success for demo purposes
      const success = Math.random() > 0.2;
      setDataUploaded(success);
      setChecking(false);
    }, 1500);
  };
  
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-md mx-auto">
        <Card className="text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              {dataUploaded === null ? (
                <div className="rounded-full bg-blue-100 p-3">
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
              ) : dataUploaded ? (
                <div className="rounded-full bg-green-100 p-3">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
              ) : (
                <div className="rounded-full bg-red-100 p-3">
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
              )}
            </div>
            
            <CardTitle className="text-xl">
              {dataUploaded === null 
                ? 'Uploading Data...' 
                : dataUploaded 
                  ? 'Data Upload Complete!' 
                  : 'Data Upload Failed'}
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            {dataUploaded === null ? (
              <>
                <p className="mb-6">
                  Your sensors are now charging and uploading data. This process takes 
                  approximately 5 minutes to complete.
                </p>
                
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${((300 - timeRemaining) / 300) * 100}%` }}
                  ></div>
                </div>
                
                <p className="text-2xl font-medium mb-6">{formatTime(timeRemaining)}</p>
                
                <div className="bg-blue-50 p-4 rounded-md mb-4 text-left">
                  <h3 className="font-medium text-blue-800 mb-2">Status:</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li className="flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Sensors returned to dock
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Sensors charging (orange light)
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Data upload in progress (blue-white light)
                    </li>
                  </ul>
                </div>
              </>
            ) : dataUploaded ? (
              <>
                <p className="mb-6">
                  Your measurement data has been successfully uploaded to the database. 
                  The sensors are now ready for the next measurement session.
                </p>
                
                <div className="bg-green-50 p-4 rounded-md mb-4 text-left">
                  <h3 className="font-medium text-green-800 mb-2">Status:</h3>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li className="flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Data upload complete
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Sensors charging
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Ready for next session
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <p className="mb-6">
                  There was a problem uploading your measurement data. Please check 
                  that the sensors are properly connected and try again.
                </p>
                
                <div className="bg-red-50 p-4 rounded-md mb-4 text-left">
                  <h3 className="font-medium text-red-800 mb-2">Troubleshooting:</h3>
                  <ul className="text-sm text-red-700 space-y-1 pl-5 list-disc">
                    <li>Ensure sensors are properly seated in the dock</li>
                    <li>Check that all three sensors are in their correct slots</li>
                    <li>Verify the dock is connected to power</li>
                    <li>Contact technical support if the issue persists</li>
                  </ul>
                </div>
              </>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col gap-4">
            {dataUploaded === null ? (
              <Button 
                onClick={checkDataStatus}
                disabled={checking || timeRemaining > 270} // Only allow checking after ~30 seconds
                className="w-full"
              >
                {checking ? (
                  <>
                    <RotateCw className="w-4 h-4 mr-2 animate-spin" />
                    Checking...
                  </>
                ) : timeRemaining > 270 ? (
                  `Check Data (available in ${formatTime(timeRemaining - 270)})`
                ) : (
                  'Check Data Status'
                )}
              </Button>
            ) : (
              <Button 
                onClick={() => router.push('/')}
                className="w-full"
              >
                Return to Dashboard
              </Button>
            )}
            
            {dataUploaded === false && (
              <Button 
                variant="outline"
                onClick={() => setDataUploaded(null)}
                className="w-full"
              >
                Try Again
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
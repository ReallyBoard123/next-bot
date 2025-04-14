// app/measurement/start/complete/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

export default function StartComplete() {
  const router = useRouter();
  
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-md mx-auto">
        <Card className="text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-xl">Measurement Started!</CardTitle>
          </CardHeader>
          
          <CardContent>
            <p className="mb-6">
              Your sensors are now active and collecting data. Keep them in place 
              until you&apos;re ready to end the measurement session.
            </p>
            
            <div className="bg-blue-50 p-4 rounded-md mb-4 text-left">
              <h3 className="font-medium text-blue-800 mb-2">Reminder:</h3>
              <ul className="text-sm text-blue-700 space-y-1 pl-5 list-disc">
                <li>Left sensor should be on the left arm band</li>
                <li>Waist sensor should be on the waist belt</li>
                <li>Right sensor should be on the right arm band</li>
                <li>All sensors should be blinking blue</li>
              </ul>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-4">
            <Button 
              onClick={() => router.push('/measurement/end')}
              className="w-full"
            >
              End Measurement
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => router.push('/')}
              className="w-full"
            >
              Return to Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
// app/page.tsx
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center">Sensor Deck Dashboard</h1>
        <p className="text-center text-muted-foreground mb-8">
          Manage your sensor measurement workflow
        </p>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Start Measurement</CardTitle>
              <CardDescription>
                Begin a new measurement session with a sensor set
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Guides you through selecting a sensor set, removing sensors, 
                and placing them correctly to start data collection.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/measurement/start" className="w-full">
                <Button className="w-full">Start Process</Button>
              </Link>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>End Measurement</CardTitle>
              <CardDescription>
                Complete an active measurement session
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Guides you through removing sensors, returning them to the dock,
                and ensuring data is uploaded properly.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/measurement/end" className="w-full">
                <Button className="w-full" variant="outline">End Process</Button>
              </Link>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Check Status</CardTitle>
              <CardDescription>
                Check data upload status for a sensor set
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Verify if data from a recent measurement session was 
                successfully uploaded to the database.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/measurement/check" className="w-full">
                <Button className="w-full" variant="secondary">Check Data</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
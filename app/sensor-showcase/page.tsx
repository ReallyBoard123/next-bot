// app/sensor-showcase/page.tsx
'use client';

import React, { useState } from 'react';
import { SensorUnit, SensorSet, SensorLocation, LightStatus } from '@/components/SensorUnit';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export default function SensorShowcase() {
  const [selectedSensorSet, setSelectedSensorSet] = useState<SensorSet>('32-A');
  const [lightStatus, setLightStatus] = useState<LightStatus>('green');

  // All available sensor sets
  const sensorSets: SensorSet[] = ['32-A', '32-B', '32-C', '32-D', '32-E', '32-F', '32-G', '32-H'];
  
  // All available light statuses
  const lightStatuses: { value: LightStatus; label: string }[] = [
    { value: 'green', label: 'Green' },
    { value: 'blue', label: 'Blue' },
    { value: 'orange', label: 'Orange' },
    { value: 'blinking-blue', label: 'Blinking Blue' },
    { value: 'blinking-red', label: 'Blinking Red' },
    { value: 'white-blue', label: 'White-Blue' },
    { value: 'none', label: 'None' }
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center">Sensor Unit Showcase</h1>
        <p className="text-center text-muted-foreground mb-8">
          Redesigned sensor units with updated visual indicators
        </p>
        
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Sensor Set Selection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-4 gap-2">
                {sensorSets.map((set) => (
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
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Light Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="light-status">Light Indicator</Label>
                <Select
                  value={lightStatus}
                  onValueChange={(value) => setLightStatus(value as LightStatus)}
                >
                  <SelectTrigger id="light-status" className="w-full">
                    <SelectValue placeholder="Select a light status" />
                  </SelectTrigger>
                  <SelectContent>
                    {lightStatuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Sensor Set: {selectedSensorSet}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap justify-center gap-6 py-6">
                <SensorUnit 
                  sensorSet={selectedSensorSet} 
                  location="L" 
                  lightStatus={lightStatus} 
                />
                <SensorUnit 
                  sensorSet={selectedSensorSet} 
                  location="W" 
                  lightStatus={lightStatus} 
                />
                <SensorUnit 
                  sensorSet={selectedSensorSet} 
                  location="R" 
                  lightStatus={lightStatus} 
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mb-4">
          <h2 className="text-2xl font-bold mb-4">All Sensor Sets</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sensorSets.map((set) => (
              <Card key={set}>
                <CardHeader>
                  <CardTitle className="text-lg">{set}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center gap-2">
                    <SensorUnit 
                      sensorSet={set} 
                      location="L" 
                      lightStatus={lightStatus} 
                      className="w-16 h-24 text-xs"
                    />
                    <SensorUnit 
                      sensorSet={set} 
                      location="W" 
                      lightStatus={lightStatus} 
                      className="w-16 h-24 text-xs"
                    />
                    <SensorUnit 
                      sensorSet={set} 
                      location="R" 
                      lightStatus={lightStatus} 
                      className="w-16 h-24 text-xs"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
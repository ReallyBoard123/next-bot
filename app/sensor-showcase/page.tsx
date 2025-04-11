// app/sensor-showcase/page.tsx
'use client';

import React, { useState } from 'react';
import { SensorUnit, type SensorSet } from '@/components/SensorUnit';
import { LightIndicator, type LightStatus } from '@/components/LightIndicator';
import { SensorDock } from '@/components/SensorDock';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';


export default function SensorShowcase() {
  const [selectedSensorSet, setSelectedSensorSet] = useState<SensorSet>('32-A');
  const [sensorLightStatus, setSensorLightStatus] = useState<LightStatus>('green');
  const [dockLightStatus, setDockLightStatus] = useState<LightStatus>('blue');

  // All available sensor sets
  const sensorSets: SensorSet[] = ['32-A', '32-B', '32-C', '32-D', '32-E', '32-F', '32-G', '32-H'];
  
  // Sensor light statuses with meanings
  const sensorLightStatuses: { value: LightStatus; label: string, meaning: string }[] = [
    { value: 'green', label: 'Green', meaning: 'The sensor is fully charged' },
    { value: 'yellow', label: 'Yellow', meaning: 'The sensor charges' },
    { value: 'blinking-blue', label: 'Flashing Blue', meaning: 'A measurement is in progress' },
    { value: 'blinking-red', label: 'Flashing Red', meaning: 'Synchronisation in progress. Do not start measurement!' },
    { value: 'orange', label: 'Orange', meaning: 'Charging' },
    { value: 'none', label: 'None', meaning: 'No indicator' }
  ];

  // Dock light statuses with meanings
  const dockLightStatuses: { value: LightStatus; label: string, meaning: string }[] = [
    { value: 'blue', label: 'Blue', meaning: 'Normal status' },
    { value: 'white-blue', label: 'White', meaning: 'Sensor data transfer in progress' },
    { value: 'green', label: 'Green', meaning: 'Data transfer to USB stick completed' },
    { value: 'red', label: 'Red', meaning: 'Sensor is in the wrong slot' }
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center">Sensor Dock Visualization</h1>
        <p className="text-center text-muted-foreground mb-8">
          Interactive visualization of the sensor dock and units
        </p>
        
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Sensor Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sensor-set">Selected Sensor Set</Label>
                <Select
                  value={selectedSensorSet}
                  onValueChange={(value) => setSelectedSensorSet(value as SensorSet)}
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
              
              <div className="space-y-2">
                <Label htmlFor="sensor-light">Sensor Light Status</Label>
                <Select
                  value={sensorLightStatus}
                  onValueChange={(value) => setSensorLightStatus(value as LightStatus)}
                >
                  <SelectTrigger id="sensor-light" className="w-full">
                    <SelectValue placeholder="Select a light status" />
                  </SelectTrigger>
                  <SelectContent>
                    {sensorLightStatuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        <div className="flex items-center gap-2">
                          <LightIndicator status={status.value} type="sensor" size="sm" />
                          <span>{status.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dock-light">Dock Light Status</Label>
                <Select
                  value={dockLightStatus}
                  onValueChange={(value) => setDockLightStatus(value as LightStatus)}
                >
                  <SelectTrigger id="dock-light" className="w-full">
                    <SelectValue placeholder="Select dock light status" />
                  </SelectTrigger>
                  <SelectContent>
                    {dockLightStatuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        <div className="flex items-center gap-2">
                          <LightIndicator status={status.value} type="dock" size="sm" />
                          <span>{status.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Selected Sensor Set: {selectedSensorSet}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap justify-center gap-6 py-6">
                <SensorUnit 
                  sensorSet={selectedSensorSet} 
                  location="L" 
                  lightStatus={sensorLightStatus} 
                />
                <SensorUnit 
                  sensorSet={selectedSensorSet} 
                  location="W" 
                  lightStatus={sensorLightStatus} 
                />
                <SensorUnit 
                  sensorSet={selectedSensorSet} 
                  location="R" 
                  lightStatus={sensorLightStatus} 
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Complete Sensor Dock</CardTitle>
            </CardHeader>
            <CardContent>
              <SensorDock 
                selectedSet={selectedSensorSet}
                onSelectSet={setSelectedSensorSet}
                sensorLightStatus={sensorLightStatus}
                dockLightStatus={dockLightStatus}
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Sensor LED Colors Reference</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="bg-blue-100">
                    <tr>
                      <th className="border p-2 text-left">Color</th>
                      <th className="border p-2 text-left">Meaning</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sensorLightStatuses.filter(s => s.value !== 'none').map((status, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="border p-2">
                          <div className="flex items-center gap-2">
                            <LightIndicator status={status.value} type="sensor" />
                            <span>{status.label}</span>
                          </div>
                        </td>
                        <td className="border p-2">{status.meaning}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Dock LED Colors Reference</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="bg-blue-100">
                    <tr>
                      <th className="border p-2 text-left">Color</th>
                      <th className="border p-2 text-left">Meaning</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dockLightStatuses.map((status, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="border p-2">
                          <div className="flex items-center gap-2">
                            <LightIndicator status={status.value} type="dock" />
                            <span>{status.label}</span>
                          </div>
                        </td>
                        <td className="border p-2">{status.meaning}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
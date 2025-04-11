// app/list/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from "sonner";
import { ChevronLeft, PlusCircle, Trash2, Loader2 } from 'lucide-react';

type Person = {
  id: number;
  name: string;
  sensorSet: string;
};

const initialPeople: Person[] = [
  { id: 1, name: 'Chirag', sensorSet: '32-A' },
  { id: 2, name: 'Alireza', sensorSet: '32-B' },
  { id: 3, name: 'Kevin', sensorSet: '32-C' },
  { id: 4, name: 'Chris', sensorSet: '32-D' },
  { id: 5, name: 'Klara', sensorSet: '32-E' },
  { id: 6, name: 'Jessica', sensorSet: '32-F' },
  { id: 7, name: 'Utz', sensorSet: '32-G' },
  { id: 8, name: 'Thomas', sensorSet: '32-H' },
];

export default function PersonListPage() {
  const [people, setPeople] = useState<Person[]>([]);
  const [newPerson, setNewPerson] = useState({ name: '', sensorSet: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Available sensor sets
  const sensorSets = ['32-A', '32-B', '32-C', '32-D', '32-E', '32-F', '32-G', '32-H'];
  
  // Load people from database
  useEffect(() => {
    const fetchPeople = async () => {
      try {
        // In a real app, this would fetch from your API
        const response = await fetch('/api/people');
        
        if (response.ok) {
          const data = await response.json();
          setPeople(data);
        } else {
          // For demo purposes, use initial data if API fails
          setPeople(initialPeople);
        }
      } catch (error) {
        console.error('Error fetching people:', error);
        setPeople(initialPeople);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPeople();
  }, []);
  
  // Handle adding a new person
  const handleAddPerson = async () => {
    if (!newPerson.name || !newPerson.sensorSet) {
      toast.error("Please enter a name and select a sensor set");
      return;
    }
    
    // Check if the sensor set is already assigned
    const existingAssignment = people.find(p => p.sensorSet === newPerson.sensorSet);
    if (existingAssignment) {
      toast.error(`Sensor set ${newPerson.sensorSet} is already assigned to ${existingAssignment.name}`);
      return;
    }
    
    setSaving(true);
    
    try {
      // In a real app, this would call your API
      const newId = Math.max(0, ...people.map(p => p.id)) + 1;
      const newPersonWithId = { ...newPerson, id: newId };
      
      // Add to state
      setPeople([...people, newPersonWithId]);
      setNewPerson({ name: '', sensorSet: '' });
      
      toast.success("Person added successfully");
    } catch (error) {
      console.error('Error adding person:', error);
      toast.error("Failed to add person");
    } finally {
      setSaving(false);
    }
  };
  
  // Handle updating a person
  const handleUpdatePerson = async (updatedPerson: Person) => {
    // Check for duplicate sensor set
    const duplicateSensorSet = people.find(
      p => p.sensorSet === updatedPerson.sensorSet && p.id !== updatedPerson.id
    );
    
    if (duplicateSensorSet) {
      toast.error(`Sensor set ${updatedPerson.sensorSet} is already assigned to ${duplicateSensorSet.name}`);
      return;
    }
    
    setSaving(true);
    
    try {
      // In a real app, this would call your API
      const updatedPeople = people.map(p => 
        p.id === updatedPerson.id ? updatedPerson : p
      );
      
      setPeople(updatedPeople);
      
      toast.success("Person updated successfully");
    } catch (error) {
      console.error('Error updating person:', error);
      toast.error("Failed to update person");
    } finally {
      setSaving(false);
    }
  };
  
  // Handle deleting a person
  const handleDeletePerson = async (id: number) => {
    setSaving(true);
    
    try {
      // In a real app, this would call your API
      const updatedPeople = people.filter(p => p.id !== id);
      setPeople(updatedPeople);
      
      toast.success("Person deleted successfully");
    } catch (error) {
      console.error('Error deleting person:', error);
      toast.error("Failed to delete person");
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex items-center mb-6">
        <Link href="/" className="flex items-center text-sm font-medium text-muted-foreground mr-4">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold">Person to Sensor Set Assignment</h1>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add New Person</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Person Name"
                value={newPerson.name}
                onChange={(e) => setNewPerson({ ...newPerson, name: e.target.value })}
              />
            </div>
            <div className="w-[200px]">
              <Select
                value={newPerson.sensorSet}
                onValueChange={(value) => setNewPerson({ ...newPerson, sensorSet: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Sensor Set" />
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
            <Button onClick={handleAddPerson} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add Person
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Current Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Sensor Set</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {people.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                      No assignments found
                    </TableCell>
                  </TableRow>
                ) : (
                  people.map((person) => (
                    <TableRow key={person.id}>
                      <TableCell>
                        <Input
                          value={person.name}
                          onChange={(e) => handleUpdatePerson({ ...person, name: e.target.value })}
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          value={person.sensorSet}
                          onValueChange={(value) => handleUpdatePerson({ ...person, sensorSet: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Sensor Set" />
                          </SelectTrigger>
                          <SelectContent>
                            {sensorSets.map((set) => (
                              <SelectItem key={set} value={set}>
                                {set}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeletePerson(person.id)}
                          disabled={saving}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
// app/measurement/start/components/Step1Name.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, Loader2 } from 'lucide-react';

interface Person {
  id: number;
  name: string;
  sensorSet: string;
}

interface Step1NameProps {
  onPersonSelect: (person: Person) => void;
  onStepComplete: () => void;
}

export default function Step1Name({ onPersonSelect, onStepComplete }: Step1NameProps) {
  const [people, setPeople] = useState<Person[]>([]);
  const [selectedPersonId, setSelectedPersonId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchPeople = async () => {
      try {
        setLoading(true);
        
        const response = await fetch('/api/people');
        
        if (response.ok) {
          const data = await response.json();
          setPeople(data);
          
          if (data.length === 0) {
            setError('No people found. Please add some people in the list page first.');
          }
        } else {
          throw new Error('Failed to fetch people data');
        }
      } catch (error) {
        console.error('Error fetching people:', error);
        setError('Could not load names from database. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPeople();
  }, []);
  
  const handleNameSelect = (person: Person) => {
    setSelectedPersonId(person.id);
    onPersonSelect(person);
  };
  
  const handleContinue = () => {
    if (selectedPersonId) {
      const selectedPerson = people.find(p => p.id === selectedPersonId);
      if (selectedPerson) {
        onStepComplete();
      }
    }
  };
  
  // Creates rows with 4 people per row for the grid layout
  const peopleRows = [];
  for (let i = 0; i < people.length; i += 4) {
    peopleRows.push(people.slice(i, i + 4));
  }
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  return (
    <div className="h-full flex flex-col">
      <h2 className="text-xl font-medium mb-4">Hello, who are you?</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-amber-50 text-amber-700 rounded-md text-sm flex items-start">
          <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
      
      {people.length === 0 ? (
        <div className="flex-1 flex justify-center items-center">
          <div className="text-center">
            <p className="mb-4 text-muted-foreground">No people found in the database.</p>
            <a 
              href="/list" 
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Go to List Page to Add People
            </a>
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-auto">
        {peopleRows.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-4 gap-3 mb-3">
        {row
          .sort((a, b) => a.sensorSet.localeCompare(b.sensorSet))
          .map((person) => (
        <Card 
          key={person.id}
          className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
        selectedPersonId === person.id ? 'bg-blue-50 border-blue-500' : ''
          }`}
          onClick={() => handleNameSelect(person)}
        >
          <div className="text-center">
        <div className="font-medium text-lg">{person.name}</div>
        <div className="text-xs text-muted-foreground">Set: {person.sensorSet}</div>
          </div>
        </Card>
          ))}
          </div>
        ))}
          </div>
          
          <div className="mt-4">
            <Button 
              onClick={handleContinue}
              disabled={!selectedPersonId}
              className="w-full"
            >
              Continue
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
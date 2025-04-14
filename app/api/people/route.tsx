// app/api/people/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/people - Get all people
export async function GET() {
  try {
    const people = await prisma.person.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    
    return NextResponse.json(people);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch people' },
      { status: 500 }
    );
  }
}

// POST /api/people - Create a new person
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { name, sensorSet } = data;
    
    if (!name || !sensorSet) {
      return NextResponse.json(
        { success: false, error: 'Name and sensor set are required' },
        { status: 400 }
      );
    }
    
    // Check if sensor set is already assigned
    const existingPerson = await prisma.person.findFirst({
      where: {
        sensorSet: sensorSet,
      },
    });
    
    if (existingPerson) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Sensor set ${sensorSet} is already assigned to ${existingPerson.name}` 
        },
        { status: 400 }
      );
    }
    
    // Create the new person
    const person = await prisma.person.create({
      data: {
        name,
        sensorSet,
      },
    });
    
    return NextResponse.json({ success: true, person });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create person' },
      { status: 500 }
    );
  }
}

// PUT /api/people - Update a person
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { id, name, sensorSet } = data;
    
    if (!id || !name || !sensorSet) {
      return NextResponse.json(
        { success: false, error: 'ID, name, and sensor set are required' },
        { status: 400 }
      );
    }
    
    // Check if sensor set is already assigned to someone else
    const existingPerson = await prisma.person.findFirst({
      where: {
        sensorSet: sensorSet,
        NOT: {
          id: id,
        },
      },
    });
    
    if (existingPerson) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Sensor set ${sensorSet} is already assigned to ${existingPerson.name}` 
        },
        { status: 400 }
      );
    }
    
    // Update the person
    const person = await prisma.person.update({
      where: {
        id: id,
      },
      data: {
        name,
        sensorSet,
      },
    });
    
    return NextResponse.json({ success: true, person });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update person' },
      { status: 500 }
    );
  }
}

// DELETE /api/people - Delete a person
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 }
      );
    }
    
    // Delete the person
    await prisma.person.delete({
      where: {
        id: parseInt(id),
      },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete person' },
      { status: 500 }
    );
  }
}
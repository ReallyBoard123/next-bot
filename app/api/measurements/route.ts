// app/api/measurements/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { MeasurementStatus, StepType } from '@prisma/client';
import { 
  createMeasurementSession, 
  recordMeasurementStep, 
  completeMeasurementSession,
  getMeasurementSession,
  getLatestSessionBySensorSet,
  checkDataUploadStatus
} from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { action } = data;

    switch (action) {
      case 'start': {
        const { sensorSet } = data;
        if (!sensorSet) {
          return NextResponse.json(
            { success: false, error: 'Sensor set is required' },
            { status: 400 }
          );
        }

        const session = await createMeasurementSession(sensorSet);
        return NextResponse.json({ success: true, session });
      }
      
      case 'recordStep': {
        const { sessionId, stepNumber, stepType, feedback } = data;
        if (!sessionId || stepNumber === undefined || !stepType) {
          return NextResponse.json(
            { success: false, error: 'Session ID, step number, and step type are required' },
            { status: 400 }
          );
        }

        const step = await recordMeasurementStep(
          sessionId, 
          stepNumber, 
          stepType as StepType, 
          true, 
          feedback
        );
        return NextResponse.json({ success: true, step });
      }
      
      case 'complete': {
        const { sessionId, status, dataUploaded } = data;
        if (!sessionId) {
          return NextResponse.json(
            { success: false, error: 'Session ID is required' },
            { status: 400 }
          );
        }

        const session = await completeMeasurementSession(
          sessionId, 
          status as MeasurementStatus || MeasurementStatus.COMPLETED, 
          dataUploaded || true
        );
        return NextResponse.json({ success: true, session });
      }
      
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action');

    switch (action) {
      case 'getSession': {
        const sessionId = searchParams.get('sessionId');
        if (!sessionId) {
          return NextResponse.json(
            { success: false, error: 'Session ID is required' },
            { status: 400 }
          );
        }

        const session = await getMeasurementSession(parseInt(sessionId));
        if (!session) {
          return NextResponse.json(
            { success: false, error: 'Session not found' },
            { status: 404 }
          );
        }

        return NextResponse.json({ success: true, session });
      }
      
      case 'getLatestBySet': {
        const sensorSet = searchParams.get('sensorSet');
        if (!sensorSet) {
          return NextResponse.json(
            { success: false, error: 'Sensor set is required' },
            { status: 400 }
          );
        }

        const session = await getLatestSessionBySensorSet(sensorSet);
        if (!session) {
          return NextResponse.json(
            { success: false, error: 'No sessions found for this sensor set' },
            { status: 404 }
          );
        }

        return NextResponse.json({ success: true, session });
      }
      
      case 'checkDataUpload': {
        const sessionId = searchParams.get('sessionId');
        if (!sessionId) {
          return NextResponse.json(
            { success: false, error: 'Session ID is required' },
            { status: 400 }
          );
        }

        const uploaded = await checkDataUploadStatus(parseInt(sessionId));
        return NextResponse.json({ success: true, dataUploaded: uploaded });
      }
      
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
// lib/db.ts
import { PrismaClient, MeasurementStatus, StepType } from '@prisma/client';

// Prevent multiple instances of Prisma Client in development
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

export interface MeasurementSessionWithSteps {
  id: number;
  sensorSet: string;
  startedAt: Date;
  endedAt: Date | null;
  status: MeasurementStatus;
  dataUploaded: boolean;
  steps: {
    id: number;
    stepNumber: number;
    stepType: StepType;
    completed: boolean;
    completedAt: Date | null;
    feedback: string | null;
  }[];
}

/**
 * Create a new measurement session
 */
export async function createMeasurementSession(sensorSet: string) {
  return await prisma.measurementSession.create({
    data: {
      sensorSet,
      status: MeasurementStatus.IN_PROGRESS,
    },
  });
}

/**
 * Record a completed step in a measurement session
 */
export async function recordMeasurementStep(
  sessionId: number,
  stepNumber: number,
  stepType: StepType,
  completed: boolean = true,
  feedback?: string
) {
  return await prisma.measurementStep.create({
    data: {
      sessionId,
      stepNumber,
      stepType,
      completed,
      completedAt: completed ? new Date() : null,
      feedback,
    },
  });
}

/**
 * Complete a measurement session
 */
export async function completeMeasurementSession(
  sessionId: number,
  status: MeasurementStatus = MeasurementStatus.COMPLETED,
  dataUploaded: boolean = true
) {
  return await prisma.measurementSession.update({
    where: {
      id: sessionId,
    },
    data: {
      endedAt: new Date(),
      status,
      dataUploaded,
    },
  });
}

/**
 * Get a measurement session with all its steps
 */
export async function getMeasurementSession(id: number): Promise<MeasurementSessionWithSteps | null> {
  return await prisma.measurementSession.findUnique({
    where: {
      id,
    },
    include: {
      steps: true,
    },
  });
}

/**
 * Get the latest measurement session for a sensor set
 */
export async function getLatestSessionBySensorSet(sensorSet: string): Promise<MeasurementSessionWithSteps | null> {
  return await prisma.measurementSession.findFirst({
    where: {
      sensorSet,
    },
    orderBy: {
      startedAt: 'desc',
    },
    include: {
      steps: true,
    },
  });
}

/**
 * Check data upload status for a measurement session
 */
export async function checkDataUploadStatus(sessionId: number): Promise<boolean> {
  const session = await prisma.measurementSession.findUnique({
    where: {
      id: sessionId,
    },
  });
  
  // In a real application, you would check an actual data API
  // This is a mock implementation that returns true 80% of the time
  return session ? Math.random() > 0.2 : false;
}
// components/DraggableSensorUnit.tsx
import React, { useState, useRef, useEffect } from 'react';
import { SensorUnit, type SensorSet, type SensorLocation } from '@/components/SensorUnit';
import { LightStatus } from '@/components/LightIndicator';
import { cn } from '@/lib/utils';

interface DraggableSensorUnitProps {
  sensorSet: SensorSet;
  location: SensorLocation;
  lightStatus: LightStatus;
  className?: string;
  onDragComplete?: () => void;
}

export function DraggableSensorUnit({
  sensorSet,
  location,
  lightStatus,
  className,
  onDragComplete
}: DraggableSensorUnitProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragComplete, setIsDragComplete] = useState(false);
  const sensorRef = useRef<HTMLDivElement>(null);
  const initialPosition = useRef({ x: 0, y: 0 });
  const dragStartPosition = useRef({ x: 0, y: 0 });

  // Reset position when component mounts
  useEffect(() => {
    setPosition({ x: 0, y: 0 });
    setIsDragComplete(false);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isDragComplete) return;
    
    setIsDragging(true);
    initialPosition.current = position;
    dragStartPosition.current = { x: e.clientX, y: e.clientY };
    
    // Prevent text selection during drag
    e.preventDefault();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isDragComplete) return;
    
    setIsDragging(true);
    initialPosition.current = position;
    dragStartPosition.current = { 
      x: e.touches[0].clientX, 
      y: e.touches[0].clientY 
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const newX = initialPosition.current.x + (e.clientX - dragStartPosition.current.x);
      const newY = initialPosition.current.y + (e.clientY - dragStartPosition.current.y);
      
      setPosition({ x: newX, y: newY });
      
      // Check if dragged up by at least 20px
      if (newY < -20 && !isDragComplete) {
        setIsDragComplete(true);
        onDragComplete?.();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      
      const newX = initialPosition.current.x + (e.touches[0].clientX - dragStartPosition.current.x);
      const newY = initialPosition.current.y + (e.touches[0].clientY - dragStartPosition.current.y);
      
      setPosition({ x: newX, y: newY });
      
      // Check if dragged up by at least 20px
      if (newY < -20 && !isDragComplete) {
        setIsDragComplete(true);
        onDragComplete?.();
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      
      // If not dragged enough, snap back to original position
      if (!isDragComplete) {
        setPosition({ x: 0, y: 0 });
      } else {
        // If dragged enough, move it further up and out of the way
        setPosition(prev => ({ x: prev.x, y: -100 }));
      }
    };

    const handleTouchEnd = handleMouseUp;

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, isDragComplete, onDragComplete]);

  return (
    <div 
      ref={sensorRef}
      className={cn(
        'relative cursor-grab transition-transform duration-150', 
        isDragging && 'cursor-grabbing shadow-lg z-10',
        isDragComplete && 'opacity-50',
        className
      )}
      style={{ 
        transform: `translate(${position.x}px, ${position.y}px)`,
        touchAction: 'none' // Prevents scrolling on touch devices while dragging
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <SensorUnit
        sensorSet={sensorSet}
        location={location}
        lightStatus={lightStatus}
        className={cn(isDragComplete && 'opacity-75')}
      />
      {!isDragComplete && (
        <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-xs text-blue-500 whitespace-nowrap">
          Drag sensor up ↑
        </div>
      )}
    </div>
  );
}
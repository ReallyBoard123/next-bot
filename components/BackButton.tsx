// components/BackButton.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

interface BackButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export function BackButton({ onClick, disabled = false, className = '' }: BackButtonProps) {
  return (
    <Button 
      variant="outline" 
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      <ChevronLeft className="w-4 h-4 mr-2" />
      Back
    </Button>
  );
}
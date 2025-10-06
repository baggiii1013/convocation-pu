import { cn } from '@/lib/utils';
import React from 'react';

interface SeatProps {
  number: number;
  isSelected?: boolean;
  isReserved?: boolean;
  isInActiveRow?: boolean;
  onClick?: () => void;
  className?: string;
}

export function Seat({
  number,
  isSelected = false,
  isReserved = false,
  isInActiveRow = false,
  onClick,
  className
}: SeatProps) {
  return (
    <button
      onClick={onClick}
      disabled={isReserved}
      className={cn(
        'relative flex flex-col items-center justify-center transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-1',
        !isReserved && 'hover:scale-110 cursor-pointer',
        isReserved && 'cursor-not-allowed opacity-60',
        className
      )}
      aria-label={`Seat ${number}`}
    >
      {/* Seat SVG - Theater style like District.in */}
      <div className="relative w-10 h-10 sm:w-12 sm:h-12">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={cn(
            'w-full h-full transition-colors duration-200',
            isSelected && 'drop-shadow-lg'
          )}
        >
          {/* Seat back (rounded rectangle) */}
          <rect
            x="4"
            y="6"
            width="16"
            height="12"
            rx="3"
            className={cn(
              isSelected && 'fill-red-500 stroke-red-600',
              isReserved && 'fill-gray-400 stroke-gray-500',
              !isSelected && !isReserved && isInActiveRow && 'fill-blue-100 stroke-blue-400',
              !isSelected && !isReserved && !isInActiveRow && 'fill-gray-200 stroke-gray-400'
            )}
            strokeWidth="1"
          />
          
          {/* Seat cushion */}
          <rect
            x="4"
            y="15"
            width="16"
            height="5"
            rx="2"
            className={cn(
              isSelected && 'fill-red-600',
              isReserved && 'fill-gray-500',
              !isSelected && !isReserved && isInActiveRow && 'fill-blue-200',
              !isSelected && !isReserved && !isInActiveRow && 'fill-gray-300'
            )}
          />
          
          {/* Armrests */}
          <rect
            x="2"
            y="12"
            width="2"
            height="6"
            rx="1"
            className={cn(
              isSelected && 'fill-red-700',
              isReserved && 'fill-gray-600',
              !isSelected && !isReserved && isInActiveRow && 'fill-blue-300',
              !isSelected && !isReserved && !isInActiveRow && 'fill-gray-400'
            )}
          />
          <rect
            x="20"
            y="12"
            width="2"
            height="6"
            rx="1"
            className={cn(
              isSelected && 'fill-red-700',
              isReserved && 'fill-gray-600',
              !isSelected && !isReserved && isInActiveRow && 'fill-blue-300',
              !isSelected && !isReserved && !isInActiveRow && 'fill-gray-400'
            )}
          />
        </svg>
        
        {/* Seat number */}
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center text-xs font-semibold',
            isSelected && 'text-white',
            isReserved && 'text-gray-700',
            !isSelected && !isReserved && 'text-gray-700'
          )}
        >
          {number}
        </div>
      </div>
    </button>
  );
}

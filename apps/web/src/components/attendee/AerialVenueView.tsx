'use client';

import { cn } from '@/lib/utils';
import { MapPin, Maximize2, ZoomIn, ZoomOut } from 'lucide-react';
import React, { useRef, useState } from 'react';

interface Enclosure {
  id?: string;
  letter: string;
  name?: string;
  allocatedFor: string;
  positionX?: number;
  positionY?: number;
  width?: number;
  height?: number;
  color?: string;
  totalSeats?: number;
}

interface AerialVenueViewProps {
  enclosures: Enclosure[];
  activeEnclosure?: string;
  onEnclosureClick?: (letter: string) => void;
  onEnclosurePositionChange?: (letter: string, position: { x: number; y: number }) => void;
  editMode?: boolean; // Enable drag-to-reposition
  className?: string;
  showControls?: boolean;
}

export function AerialVenueView({
  enclosures,
  activeEnclosure,
  onEnclosureClick,
  onEnclosurePositionChange,
  editMode = false,
  className,
  showControls = true
}: AerialVenueViewProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [draggingEnclosure, setDraggingEnclosure] = useState<string | null>(null);
  const [enclosurePositions, setEnclosurePositions] = useState<Record<string, { x: number; y: number }>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle zoom
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));
  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Handle pan/drag
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      const touch = e.touches[0];
      setDragStart({ x: touch.clientX - pan.x, y: touch.clientY - pan.y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && e.touches.length === 1) {
      const touch = e.touches[0];
      setPan({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Handle enclosure dragging (Edit Mode)
  const handleEnclosureMouseDown = (e: React.MouseEvent, letter: string) => {
    if (!editMode) return;
    e.stopPropagation();
    setDraggingEnclosure(letter);
  };

  const handleEnclosureDrag = (e: React.MouseEvent) => {
    if (!draggingEnclosure || !containerRef.current || !editMode) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Clamp values between 10% and 90% to keep enclosures visible
    const clampedX = Math.max(10, Math.min(90, x));
    const clampedY = Math.max(15, Math.min(85, y));
    
    setEnclosurePositions(prev => ({
      ...prev,
      [draggingEnclosure]: { x: clampedX, y: clampedY }
    }));
  };

  const handleEnclosureMouseUp = () => {
    if (draggingEnclosure && editMode) {
      const position = enclosurePositions[draggingEnclosure];
      if (position && onEnclosurePositionChange) {
        onEnclosurePositionChange(draggingEnclosure, position);
      }
      setDraggingEnclosure(null);
    }
  };

  // Default enclosure positions if not set
  const getEnclosureStyle = (enclosure: Enclosure, index: number) => {
    const defaultPositions = [
      { x: 20, y: 30 }, // Top-left
      { x: 42.5, y: 30 }, // Top-center-left
      { x: 65, y: 30 }, // Top-right
      { x: 20, y: 55 }, // Bottom-left
      { x: 42.5, y: 55 }, // Bottom-center-left
      { x: 65, y: 55 }, // Bottom-right
    ];

    const position = defaultPositions[index % defaultPositions.length];
    
    // Use dragged position if available, otherwise use enclosure position or default
    const draggedPosition = enclosurePositions[enclosure.letter];
    const x = draggedPosition?.x ?? enclosure.positionX ?? position.x;
    const y = draggedPosition?.y ?? enclosure.positionY ?? position.y;
    const width = enclosure.width ?? 15;
    const height = enclosure.height ?? 15;
    const color = enclosure.color ?? '#3B82F6';

    return {
      position: 'absolute' as const,
      left: `${x}%`,
      top: `${y}%`,
      width: `${width}%`,
      height: `${height}%`,
      backgroundColor: color,
      transform: 'translate(-50%, -50%)'
    };
  };

  return (
    <div className={cn('relative w-full min-h-[600px] h-[600px] bg-gradient-to-b from-green-50 to-green-100 rounded-xl overflow-hidden shadow-2xl border-4 border-gray-300', className)}>
      {/* Edit Mode Indicator */}
      {editMode && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg text-sm font-semibold flex items-center gap-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          Edit Mode: Drag enclosures to reposition
        </div>
      )}
      
      {/* Control Buttons */}
      {showControls && (
        <div className="absolute top-4 right-4 z-50 flex flex-col gap-2 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
          <button
            onClick={handleZoomIn}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-5 h-5 text-gray-700" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-5 h-5 text-gray-700" />
          </button>
          <button
            onClick={handleResetView}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="Reset View"
          >
            <Maximize2 className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      )}

      {/* Zoom Level Indicator */}
      {showControls && (
        <div className="absolute bottom-4 right-4 z-50 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 shadow-lg text-sm font-medium text-gray-700">
          {Math.round(zoom * 100)}%
        </div>
      )}

      {/* Main Venue Container */}
      <div
        ref={containerRef}
        className={cn(
          'w-full h-full relative',
          editMode ? 'cursor-default' : (isDragging ? 'cursor-grabbing' : 'cursor-grab')
        )}
        onMouseDown={editMode ? undefined : handleMouseDown}
        onMouseMove={editMode ? handleEnclosureDrag : handleMouseMove}
        onMouseUp={editMode ? handleEnclosureMouseUp : handleMouseUp}
        onMouseLeave={editMode ? handleEnclosureMouseUp : handleMouseUp}
        onTouchStart={editMode ? undefined : handleTouchStart}
        onTouchMove={editMode ? undefined : handleTouchMove}
        onTouchEnd={editMode ? undefined : handleTouchEnd}
      >
        <div
          className="w-full h-full relative transition-transform duration-200 ease-out"
          style={{
            transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`
          }}
        >
          {/* Stage - Top Center */}
          <div className="absolute top-[8%] left-1/2 transform -translate-x-1/2 z-10">
            <div className="bg-gradient-to-b from-gray-800 to-gray-900 text-white px-12 py-6 rounded-lg shadow-2xl border-4 border-yellow-400">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-xl font-bold uppercase tracking-wider">Main Stage</span>
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              </div>
              <div className="text-center text-xs text-gray-300 mt-2">Convocation Ceremony</div>
            </div>
            {/* Stage lights */}
            <div className="absolute -top-2 left-0 right-0 flex justify-around">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-2 h-2 bg-yellow-400 rounded-full shadow-lg"></div>
              ))}
            </div>
          </div>

          {/* Enclosures */}
          {enclosures.map((enclosure, index) => {
            const isActive = enclosure.letter === activeEnclosure;
            const isDraggingThis = draggingEnclosure === enclosure.letter;
            const style = getEnclosureStyle(enclosure, index);

            return (
              <button
                key={enclosure.letter}
                style={style}
                onMouseDown={(e) => {
                  if (editMode) {
                    handleEnclosureMouseDown(e, enclosure.letter);
                  }
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!editMode) {
                    onEnclosureClick?.(enclosure.letter);
                  }
                }}
                className={cn(
                  'group relative rounded-lg shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2',
                  editMode ? 'cursor-move' : 'cursor-pointer hover:scale-105 hover:shadow-2xl',
                  isDraggingThis ? 'scale-110 opacity-70 z-40' : 'z-20',
                  isActive && !editMode && 'ring-4 ring-yellow-400 ring-offset-2 scale-105 z-30',
                  !isActive && !editMode && 'hover:ring-2 hover:ring-white',
                  editMode && 'ring-2 ring-blue-400'
                )}
              >
                {/* Enclosure Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-2 bg-gradient-to-br from-black/20 to-black/40 rounded-lg">
                  {/* Letter Badge */}
                  <div className={cn(
                    "text-5xl md:text-6xl font-black mb-1 drop-shadow-lg",
                    isActive && "text-yellow-300"
                  )}>
                    {enclosure.letter}
                  </div>
                  
                  {/* Name */}
                  {enclosure.name && (
                    <div className="text-xs md:text-sm font-bold uppercase tracking-wide drop-shadow">
                      {enclosure.name}
                    </div>
                  )}
                  
                  {/* Type */}
                  <div className="text-[10px] md:text-xs font-medium opacity-90 mt-1">
                    {enclosure.allocatedFor}
                  </div>

                  {/* Seat Count */}
                  {enclosure.totalSeats && (
                    <div className="absolute bottom-2 left-2 right-2 text-center text-[10px] bg-black/50 rounded px-2 py-1">
                      {enclosure.totalSeats} seats
                    </div>
                  )}

                  {/* Active Indicator */}
                  {isActive && (
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full border-4 border-white shadow-lg flex items-center justify-center animate-bounce">
                      <MapPin className="w-4 h-4 text-gray-800" />
                    </div>
                  )}
                </div>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/20 rounded-lg transition-colors duration-300"></div>
              </button>
            );
          })}

          {/* Ground Decorations - Entry Gates */}
          <div className="absolute top-[50%] left-[5%] transform -translate-y-1/2">
            <div className="bg-gray-700 text-white px-3 py-2 rounded-r-lg shadow-lg text-xs font-semibold">
              ← West Entry
            </div>
          </div>
          <div className="absolute top-[50%] right-[5%] transform -translate-y-1/2">
            <div className="bg-gray-700 text-white px-3 py-2 rounded-l-lg shadow-lg text-xs font-semibold">
              East Entry →
            </div>
          </div>

          {/* Pathways - Visual guides */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Horizontal center path */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-400/30 transform -translate-y-1/2"></div>
            {/* Vertical center path */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-400/30 transform -translate-x-1/2"></div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-50 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg max-w-xs">
        <h4 className="text-xs font-bold text-gray-800 mb-2">Legend</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-400 rounded border-2 border-white"></div>
            <span className="text-gray-700">Your Enclosure</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-gray-700">Other Enclosures</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-800 rounded"></div>
            <span className="text-gray-700">Main Stage</span>
          </div>
        </div>
        <div className="mt-2 pt-2 border-t border-gray-200 text-[10px] text-gray-600">
          💡 Click enclosure to view seats
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { AerialVenueView } from './AerialVenueView';
import { EnclosureDetailModal } from './EnclosureDetailModal';

interface Row {
  id?: string;
  letter: string;
  startSeat: number;
  endSeat: number;
  reservedSeats: string;
  displayOrder?: number;
}

interface Enclosure {
  id?: string;
  letter: string;
  name?: string;
  allocatedFor: string;
  entryDirection: string;
  positionX?: number;
  positionY?: number;
  width?: number;
  height?: number;
  color?: string;
  totalSeats?: number;
  rows?: Row[];
}

interface SeatAllocation {
  row: string;
  seat: number;
  enrollmentId: string;
  name?: string;
}

interface AerialVenueWrapperProps {
  enclosures: Enclosure[];
  activeEnclosure?: string;
  userAllocation?: {
    enclosureLetter: string;
    rowLetter: string;
    seatNumber: number;
  };
  editMode?: boolean;
  onEnclosurePositionChange?: (letter: string, position: { x: number; y: number }) => void;
  className?: string;
}

export function AerialVenueWrapper({
  enclosures,
  activeEnclosure,
  userAllocation,
  editMode = false,
  onEnclosurePositionChange,
  className
}: AerialVenueWrapperProps) {
  const [selectedEnclosure, setSelectedEnclosure] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [seatAllocations, setSeatAllocations] = useState<SeatAllocation[]>([]);
  const [loadingAllocations, setLoadingAllocations] = useState(false);

  const handleEnclosureClick = async (letter: string) => {
    setSelectedEnclosure(letter);
    setIsModalOpen(true);
    
    // Fetch seat allocations for this enclosure
    setLoadingAllocations(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/allocations/enclosure/${letter}`,
        {
          credentials: 'include',
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Extract seat allocations from the response
        const allocations: SeatAllocation[] = [];
        if (data.data?.rows) {
          data.data.rows.forEach((row: any) => {
            row.attendees?.forEach((attendee: any) => {
              allocations.push({
                row: row.row,
                seat: attendee.seat,
                enrollmentId: attendee.enrollmentId,
                name: attendee.name,
              });
            });
          });
        }
        setSeatAllocations(allocations);
      } else {
        // If allocation data not available, set empty array
        setSeatAllocations([]);
      }
    } catch (error) {
      console.error('Failed to fetch seat allocations:', error);
      setSeatAllocations([]);
    } finally {
      setLoadingAllocations(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSeatAllocations([]);
    setTimeout(() => setSelectedEnclosure(null), 300);
  };

  // Find the selected enclosure with full details
  const selectedEnclosureData = enclosures.find(
    (e) => e.letter === selectedEnclosure
  );

  // Prepare user allocation for the modal
  const modalUserAllocation =
    userAllocation && selectedEnclosure === userAllocation.enclosureLetter
      ? {
          rowLetter: userAllocation.rowLetter,
          seatNumber: userAllocation.seatNumber
        }
      : undefined;

  return (
    <>
      <AerialVenueView
        enclosures={enclosures}
        activeEnclosure={activeEnclosure || userAllocation?.enclosureLetter}
        onEnclosureClick={handleEnclosureClick}
        editMode={editMode}
        onEnclosurePositionChange={onEnclosurePositionChange}
        className={className}
      />

      {selectedEnclosureData && (
        <EnclosureDetailModal
          enclosure={{
            letter: selectedEnclosureData.letter,
            name: selectedEnclosureData.name,
            allocatedFor: selectedEnclosureData.allocatedFor,
            entryDirection: selectedEnclosureData.entryDirection,
            totalSeats: selectedEnclosureData.totalSeats,
            rows: selectedEnclosureData.rows || []
          }}
          seatAllocations={seatAllocations}
          loadingAllocations={loadingAllocations}
          userAllocation={modalUserAllocation}
          onClose={handleCloseModal}
          isOpen={isModalOpen}
        />
      )}
    </>
  );
}

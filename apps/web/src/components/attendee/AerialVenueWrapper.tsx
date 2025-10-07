'use client';

import React, { useState } from 'react';
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

  const handleEnclosureClick = async (letter: string) => {
    setSelectedEnclosure(letter);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
          userAllocation={modalUserAllocation}
          onClose={handleCloseModal}
          isOpen={isModalOpen}
        />
      )}
    </>
  );
}

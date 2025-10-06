'use client';

import React, { useState } from 'react';
import { VenueMap } from './VenueMap';

interface Enclosure {
  letter: string;
  name?: string;
  allocatedFor: string;
}

interface VenueMapWrapperProps {
  enclosures: Enclosure[];
  activeEnclosure: string;
}

export function VenueMapWrapper({
  enclosures,
  activeEnclosure
}: VenueMapWrapperProps) {
  const [selectedEnclosure, setSelectedEnclosure] = useState(activeEnclosure);

  return (
    <div className="space-y-4">
      <VenueMap
        enclosures={enclosures}
        activeEnclosure={selectedEnclosure}
        onEnclosureClick={setSelectedEnclosure}
      />
      
      {selectedEnclosure !== activeEnclosure && (
        <div className="text-center">
          <button
            onClick={() => setSelectedEnclosure(activeEnclosure)}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Return to your enclosure ({activeEnclosure})
          </button>
        </div>
      )}
    </div>
  );
}

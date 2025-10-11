'use client';

import { AerialVenueWrapper } from '@/components/attendee/AerialVenueWrapper';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { AlertCircle, CheckCircle, RefreshCw, Save } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface Enclosure {
  id: string;
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
  rows: Array<{
    letter: string;
    startSeat: number;
    endSeat: number;
    reservedSeats: string;
    displayOrder: number;
  }>;
}

export default function AerialViewEditorPage() {
  const [enclosures, setEnclosures] = useState<Enclosure[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<Map<string, { x: number; y: number }>>(new Map());

  useEffect(() => {
    fetchEnclosures();
  }, []);

  const fetchEnclosures = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/enclosures`, {
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Failed to fetch enclosures');
      }

      const data = await res.json();
      setEnclosures(data.data || data || []);
    } catch (err) {
      console.error('Error fetching enclosures:', err);
      setError('Failed to load enclosures. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePositionChange = (letter: string, position: { x: number; y: number }) => {
    console.log(`Position changed for ${letter}:`, position);
    
    // Track pending changes
    const newPendingChanges = new Map(pendingChanges);
    newPendingChanges.set(letter, position);
    setPendingChanges(newPendingChanges);
    
    // Update local state optimistically
    setEnclosures(prev =>
      prev.map(enc =>
        enc.letter === letter
          ? { ...enc, positionX: position.x, positionY: position.y }
          : enc
      )
    );
  };

  const handleSaveLayout = async () => {
    if (pendingChanges.size === 0) {
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSaveSuccess(false);

      console.log('Saving layout changes:', pendingChanges);

      // Save each changed enclosure
      const savePromises = Array.from(pendingChanges.entries()).map(async ([letter, position]) => {
        const enclosure = enclosures.find(e => e.letter === letter);
        if (!enclosure) {
          console.warn(`Enclosure ${letter} not found`);
          return { ok: false };
        }

        console.log(`Saving ${letter} (${enclosure.id}):`, position);
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/enclosures/${enclosure.id}/layout`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            positionX: position.x,
            positionY: position.y,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          console.error(`Failed to save ${letter}:`, response.status, errorData);
        } else {
          const result = await response.json();
          console.log(`Successfully saved ${letter}:`, result);
        }

        return response;
      });

      const results = await Promise.all(savePromises);
      
      // Check if all requests succeeded
      const allSucceeded = results.every(res => res?.ok);
      
      if (!allSucceeded) {
        const failedCount = results.filter(res => !res?.ok).length;
        throw new Error(`${failedCount} enclosure(s) failed to save. Check console for details.`);
      }

      // Clear pending changes and refresh data from server
      setPendingChanges(new Map());
      setSaveSuccess(true);
      
      // Refetch enclosures to ensure we have the latest data from database
      await fetchEnclosures();
      
      // Hide success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
      
      console.log('Layout saved successfully!');
    } catch (err) {
      console.error('Error saving layout:', err);
      setError(err instanceof Error ? err.message : 'Failed to save layout. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDiscardChanges = () => {
    setPendingChanges(new Map());
    fetchEnclosures(); // Reload original positions
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Loading enclosures...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Aerial View Layout Editor
              </h1>
              <p className="text-gray-600">
                Manage the convocation ground layout and enclosure positions
              </p>
            </div>
            <div className="flex items-center gap-3">
              {pendingChanges.size > 0 && (
                <span className="text-sm text-amber-600 font-medium">
                  {pendingChanges.size} unsaved change{pendingChanges.size > 1 ? 's' : ''}
                </span>
              )}
              <Button
                onClick={() => setEditMode(!editMode)}
                variant={editMode ? 'default' : 'outline'}
                className="min-w-[120px]"
              >
                {editMode ? 'Exit Edit Mode' : 'Enter Edit Mode'}
              </Button>
            </div>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {saveSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span>Layout saved successfully!</span>
            </div>
          )}
        </div>

        {/* Instructions */}
        {editMode && (
          <Card className="mb-6 border-blue-200 bg-blue-50">
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 rounded-full p-2 flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900 mb-1">Edit Mode Active</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Click and drag enclosures to reposition them</li>
                    <li>• Enclosures are highlighted with a blue border when hovering</li>
                    <li>• Changes are tracked but not saved until you click &quot;Save Layout&quot;</li>
                    <li>• Click &quot;Discard Changes&quot; to reset to the last saved positions</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Aerial View */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">Convocation Ground - Aerial View</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              {editMode 
                ? 'Drag enclosures to reposition them'
                : 'Click on any enclosure to view detailed seat layout'}
            </p>
          </CardHeader>
          <CardContent>
            <AerialVenueWrapper
              enclosures={enclosures}
              editMode={editMode}
              onEnclosurePositionChange={handlePositionChange}
            />
          </CardContent>
        </Card>

        {/* Action Buttons */}
        {pendingChanges.size > 0 && (
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">Unsaved Changes</p>
                  <p className="text-sm text-gray-600">
                    You have {pendingChanges.size} enclosure{pendingChanges.size > 1 ? 's' : ''} with modified positions
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={handleDiscardChanges}
                    variant="outline"
                    disabled={saving}
                  >
                    Discard Changes
                  </Button>
                  <Button
                    onClick={handleSaveLayout}
                    disabled={saving}
                    className="min-w-[140px]"
                  >
                    {saving ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Layout
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enclosure List */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Enclosures Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {enclosures.map((enc) => (
                <div
                  key={enc.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  style={{ borderColor: enc.color || '#3B82F6' }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="text-2xl font-bold"
                      style={{ color: enc.color || '#3B82F6' }}
                    >
                      {enc.letter}
                    </span>
                    {pendingChanges.has(enc.letter) && (
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">
                        Modified
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    {enc.name || `Enclosure ${enc.letter}`}
                  </p>
                  <p className="text-xs text-gray-600 mb-2">{enc.allocatedFor}</p>
                  <p className="text-xs text-gray-500">
                    Position: ({(enc.positionX || 0).toFixed(1)}%, {(enc.positionY || 0).toFixed(1)}%)
                  </p>
                  <p className="text-xs text-gray-500">
                    {enc.totalSeats || 0} seats
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

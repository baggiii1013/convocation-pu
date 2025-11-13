'use client';

import { AerialVenueWrapper } from '@/components/attendee/AerialVenueWrapper';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { AlertCircle, CheckCircle, Download, RefreshCw, RotateCcw, Save, Search } from 'lucide-react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

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

interface AerialViewEditorClientProps {
  initialEnclosures: Enclosure[];
}

/**
 * Client Component: Aerial View Editor
 * 
 * Interactive canvas editor for managing enclosure positions:
 * - Toggle edit mode for dragging enclosures
 * - Track pending position changes
 * - Save layout to server
 * - Discard unsaved changes
 * - Visual feedback for modified enclosures
 * - Overview of all enclosures with positions
 * 
 * Uses AerialVenueWrapper component for the interactive canvas.
 * 
 * @component
 */
export function AerialViewEditorClient({ initialEnclosures }: AerialViewEditorClientProps) {
  const [enclosures, setEnclosures] = useState<Enclosure[]>(initialEnclosures);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<Map<string, { x: number; y: number }>>(new Map());
  const [searchQuery, setSearchQuery] = useState('');

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
      toast.success('Enclosures refreshed');
    } catch (err) {
      console.error('Error fetching enclosures:', err);
      setError('Failed to load enclosures. Please try again.');
      toast.error('Failed to refresh enclosures');
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
      
      toast.success('Layout saved successfully!');
      console.log('Layout saved successfully!');
    } catch (err) {
      console.error('Error saving layout:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to save layout. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleDiscardChanges = () => {
    setPendingChanges(new Map());
    fetchEnclosures(); // Reload original positions
    toast.success('Changes discarded');
  };

  const handleResetAllPositions = async () => {
    if (!confirm('Reset all enclosure positions to center (50%, 50%)? This will save immediately and cannot be undone.')) {
      return;
    }

    try {
      setSaving(true);
      setError(null);

      // Reset all enclosures to center position
      const resetPromises = enclosures.map(async (enclosure) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/enclosures/${enclosure.id}/layout`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            positionX: 50,
            positionY: 50,
          }),
        });

        return response;
      });

      const results = await Promise.all(resetPromises);
      const allSucceeded = results.every(res => res?.ok);
      
      if (!allSucceeded) {
        const failedCount = results.filter(res => !res?.ok).length;
        throw new Error(`${failedCount} enclosure(s) failed to reset.`);
      }

      setPendingChanges(new Map());
      await fetchEnclosures();
      toast.success('All positions reset to center');
    } catch (err) {
      console.error('Error resetting positions:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to reset positions';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleExportLayout = () => {
    if (enclosures.length === 0) {
      toast.error('No enclosures to export');
      return;
    }

    try {
      // Create CSV content
      const headers = ['Letter', 'Name', 'Allocated For', 'Position X (%)', 'Position Y (%)', 'Width', 'Height', 'Color', 'Total Seats'];
      const csvContent = [
        headers.join(','),
        ...enclosures.map(e => [
          e.letter,
          `"${e.name || ''}"`,
          e.allocatedFor,
          (e.positionX || 0).toFixed(2),
          (e.positionY || 0).toFixed(2),
          e.width || 0,
          e.height || 0,
          e.color || '',
          e.totalSeats || 0
        ].join(','))
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `aerial-view-layout-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Layout exported successfully');
    } catch (err) {
      console.error('Export failed:', err);
      toast.error('Failed to export layout');
    }
  };

  // Filter enclosures based on search query
  const filteredEnclosures = enclosures.filter(e => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      e.letter.toLowerCase().includes(query) ||
      (e.name && e.name.toLowerCase().includes(query)) ||
      e.allocatedFor.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark-bg py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Aerial View Layout Editor
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage the convocation ground layout and enclosure positions
              </p>
            </div>
            <div className="flex items-center gap-3">
              {pendingChanges.size > 0 && (
                <span className="text-sm text-amber-600 dark:text-amber-500 font-medium">
                  {pendingChanges.size} unsaved change{pendingChanges.size > 1 ? 's' : ''}
                </span>
              )}
              <Button
                onClick={fetchEnclosures}
                variant="outline"
                size="sm"
                disabled={loading || saving}
                className="gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                onClick={handleExportLayout}
                variant="outline"
                size="sm"
                disabled={enclosures.length === 0}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Button
                onClick={handleResetAllPositions}
                variant="outline"
                size="sm"
                disabled={saving || loading}
                className="gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset All
              </Button>
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
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {saveSuccess && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span>Layout saved successfully!</span>
            </div>
          )}
        </div>

        {/* Instructions */}
        {editMode && (
          <Card className="mb-6 border-blue-300 dark:border-blue-800 bg-blue-100 dark:bg-blue-900/30">
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-600 rounded-full p-2 flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Edit Mode Active</h3>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
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
        <Card className="mb-6 bg-gray-50 dark:bg-dark-card border border-gray-200 dark:border-dark-border">
          <CardHeader className="bg-blue-50 dark:bg-gray-800/50 border-b border-blue-100 dark:border-dark-border mb-8">
            <CardTitle className="text-xl text-gray-900 dark:text-white">Convocation Ground - Aerial View</CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
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
          <Card className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Unsaved Changes</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
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
                    className="min-w-[140px] bg-blue-600 hover:bg-blue-700"
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
        <Card className="mt-6 bg-gray-50 dark:bg-dark-card border border-gray-200 dark:border-dark-border">
          <CardHeader className="bg-blue-50 dark:bg-gray-800/50 border-b border-blue-100 dark:border-dark-border mb-[32px]">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-gray-900 dark:text-white">Enclosures Overview</CardTitle>
              {enclosures.length > 0 && (
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {filteredEnclosures.length} of {enclosures.length} enclosures
                </span>
              )}
            </div>
            {enclosures.length > 0 && (
              <div className="relative mt-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search enclosures by letter, name, or allocation..."
                  className="pl-10 border-2 border-gray-200 focus:border-blue-500"
                />
              </div>
            )}
          </CardHeader>
          <CardContent>
            {filteredEnclosures.length === 0 && searchQuery ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-2">No matching enclosures</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">Try adjusting your search query</p>
              </div>
            ) : filteredEnclosures.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">No enclosures available</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredEnclosures.map((enc) => (
                  <div
                    key={enc.id}
                    className="border-2 rounded-lg p-4 hover:shadow-md transition-shadow bg-gray-100 dark:bg-gray-800"
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
                        <span className="text-xs bg-amber-200 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 px-2 py-1 rounded font-semibold">
                          Modified
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                      {enc.name || `Enclosure ${enc.letter}`}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{enc.allocatedFor}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      Position: ({(enc.positionX || 0).toFixed(1)}%, {(enc.positionY || 0).toFixed(1)}%)
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {enc.totalSeats || 0} seats
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

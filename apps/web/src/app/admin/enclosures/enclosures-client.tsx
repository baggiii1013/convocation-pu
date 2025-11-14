'use client';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Copy, Download, Edit, Plus, RefreshCw, Search, Trash2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { EnclosureForm } from './enclosure-form.client';

interface Row {
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
  displayOrder: number;
  rows: Row[];
  totalSeats?: number;
  allocatedSeats?: number;
}

interface EnclosuresClientProps {
  initialEnclosures: Enclosure[];
}

export function EnclosuresClient({ initialEnclosures }: EnclosuresClientProps) {
  const router = useRouter();
  const [enclosures, setEnclosures] = useState<Enclosure[]>(initialEnclosures);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEnclosure, setCurrentEnclosure] = useState<Enclosure | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEnclosures, setSelectedEnclosures] = useState<Set<string>>(new Set());

  const fetchEnclosures = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/enclosures`, {
        credentials: 'include',
      });
      const data = await res.json();
      setEnclosures(data);
    } catch (error) {
      console.error('Failed to load enclosures:', error);
      toast.error('Failed to load enclosures');
    }
  };

  const handleCreateOrUpdate = async (enclosure: Enclosure) => {
    setLoading(true);
    try {
      const url = enclosure.id
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1/enclosures/${enclosure.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/v1/enclosures`;
      const method = enclosure.id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enclosure),
        credentials: 'include',
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error);
      }

      toast.success(enclosure.id ? 'Enclosure updated' : 'Enclosure created');
      await fetchEnclosures();
      setIsEditing(false);
      setCurrentEnclosure(null);
      router.refresh(); // Refresh server component data
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Operation failed';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure? This cannot be undone.')) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/enclosures/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error);
      }
      toast.success('Enclosure deleted');
      await fetchEnclosures();
      router.refresh(); // Refresh server component data
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete';
      toast.error(errorMessage);
    }
  };

  const handleEdit = (enclosure: Enclosure) => {
    setCurrentEnclosure(enclosure);
    setIsEditing(true);
  };

  const handleCreate = () => {
    setCurrentEnclosure({
      letter: '',
      name: '',
      allocatedFor: 'STUDENTS',
      entryDirection: 'NORTH',
      displayOrder: enclosures.length,
      rows: [{ letter: 'A', startSeat: 1, endSeat: 50, reservedSeats: '', displayOrder: 0 }],
    });
    setIsEditing(true);
  };

  const handleDuplicate = (enclosure: Enclosure) => {
    // Create a copy with a new letter
    const newEnclosure = {
      ...enclosure,
      id: undefined,
      letter: '', // User will fill this
      name: `${enclosure.name} (Copy)`,
      displayOrder: enclosures.length,
      allocatedSeats: 0,
    };
    setCurrentEnclosure(newEnclosure);
    setIsEditing(true);
    toast.success('Duplicating enclosure - update the letter');
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      await fetchEnclosures();
      toast.success('Enclosures refreshed');
    } catch (error) {
      toast.error(`Failed to refresh : ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedEnclosures.size === 0) {
      toast.error('No enclosures selected');
      return;
    }

    if (!confirm(`Delete ${selectedEnclosures.size} selected enclosure(s)? This cannot be undone.`)) {
      return;
    }

    setLoading(true);
    try {
      const deletePromises = Array.from(selectedEnclosures).map(id =>
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/enclosures/${id}`, {
          method: 'DELETE',
          credentials: 'include',
        })
      );

      const results = await Promise.allSettled(deletePromises);
      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      if (failed > 0) {
        toast.error(`Deleted ${successful}, failed ${failed}`);
      } else {
        toast.success(`Successfully deleted ${successful} enclosure(s)`);
      }

      setSelectedEnclosures(new Set());
      await fetchEnclosures();
      router.refresh();
    } catch (error) {
      console.error('Bulk delete failed:', error);
      toast.error('Failed to delete selected enclosures');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAll = async () => {
    if (enclosures.length === 0) {
      toast.error('No enclosures to delete');
      return;
    }

    if (!confirm('Delete ALL enclosures? This will permanently delete all enclosures and cannot be undone!')) {
      return;
    }

    setLoading(true);
    try {
      const deletePromises = enclosures.map(enc =>
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/enclosures/${enc.id}`, {
          method: 'DELETE',
          credentials: 'include',
        })
      );

      await Promise.all(deletePromises);
      toast.success('All enclosures deleted');
      setEnclosures([]);
      setSelectedEnclosures(new Set());
      router.refresh();
    } catch (error) {
      console.error('Delete all failed:', error);
      toast.error('Failed to delete all enclosures');
      await fetchEnclosures();
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (enclosures.length === 0) {
      toast.error('No enclosures to export');
      return;
    }

    try {
      // Create CSV content
      const headers = ['Letter', 'Name', 'Allocated For', 'Entry Direction', 'Total Seats', 'Allocated Seats', 'Rows', 'Display Order'];
      const csvContent = [
        headers.join(','),
        ...enclosures.map(e => [
          e.letter,
          `"${e.name || ''}"`,
          e.allocatedFor,
          e.entryDirection,
          e.totalSeats || 0,
          e.allocatedSeats || 0,
          e.rows?.length || 0,
          e.displayOrder
        ].join(','))
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `enclosures-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Enclosures exported successfully');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export enclosures');
    }
  };

  const toggleSelectEnclosure = (id: string) => {
    const newSelected = new Set(selectedEnclosures);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedEnclosures(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedEnclosures.size === filteredEnclosures.length) {
      setSelectedEnclosures(new Set());
    } else {
      setSelectedEnclosures(new Set(filteredEnclosures.map(e => e.id!).filter(Boolean)));
    }
  };

  // Filter enclosures based on search query
  const filteredEnclosures = enclosures.filter(e => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      e.letter.toLowerCase().includes(query) ||
      (e.name && e.name.toLowerCase().includes(query)) ||
      e.allocatedFor.toLowerCase().includes(query) ||
      e.entryDirection.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Enclosure Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Configure venue enclosures and seating arrangements
          </p>
        </div>
        <Button 
          onClick={handleCreate} 
          className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-5 h-5" />
          New Enclosure
        </Button>
      </div>

      {/* Action Bar */}
      <Card className="border-0 shadow-lg bg-white dark:bg-dark-card">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 w-full lg:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by letter, name, or allocation..."
                className="pl-10 border-2 border-gray-200 focus:border-indigo-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                disabled={loading}
                className="gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                onClick={handleExport}
                variant="outline"
                size="sm"
                disabled={enclosures.length === 0}
                className="gap-2 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
              {selectedEnclosures.size > 0 && (
                <Button
                  onClick={handleDeleteSelected}
                  variant="danger"
                  size="sm"
                  disabled={loading}
                  className="gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Selected ({selectedEnclosures.size})
                </Button>
              )}
              <Button
                onClick={handleDeleteAll}
                variant="danger"
                size="sm"
                disabled={loading || enclosures.length === 0}
                className="gap-2 disabled:opacity-50"
              >
                <X className="w-4 h-4" />
                Clear All
              </Button>
            </div>
          </div>

          {/* Selection Info */}
          {filteredEnclosures.length > 0 && (
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-200">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedEnclosures.size === filteredEnclosures.length && filteredEnclosures.length > 0}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Select All
                </span>
              </label>
              <span className="text-sm text-gray-600">
                {searchQuery && (
                  <>Showing {filteredEnclosures.length} of {enclosures.length} • </>
                )}
                {selectedEnclosures.size > 0 && `${selectedEnclosures.size} selected`}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enclosure List */}
      <div className="grid gap-6">
        {filteredEnclosures.map((enclosure) => (
          <Card key={enclosure.id} className="border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden bg-white dark:bg-dark-card">
            {/* Decorative top border */}
            {/* <div className="h-1 bg-blue-600"></div> */}
              
              <CardHeader className="bg-gray-50/50 dark:bg-gray-800/50">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {/* Selection Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedEnclosures.has(enclosure.id!)}
                      onChange={() => toggleSelectEnclosure(enclosure.id!)}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                      aria-label={`Select enclosure ${enclosure.letter}`}
                    />
                    <div className="w-16 h-16 bg-blue-600 text-white rounded-xl flex items-center justify-center text-3xl font-bold shadow-md">
                      {enclosure.letter}
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                        {enclosure.name || `Enclosure ${enclosure.letter}`}
                      </CardTitle>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900 dark:text-blue-200">
                          {enclosure.allocatedFor}
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-200 dark:bg-gray-800 dark:text-gray-200">
                          Entry: {enclosure.entryDirection}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDuplicate(enclosure)}
                      className="gap-2"
                    >
                      <Copy className="w-4 h-4" />
                      Duplicate
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(enclosure)}
                      className="gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(enclosure.id!)}
                      className="gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-5 bg-blue-50 rounded-lg border border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {enclosure.totalSeats || 0}
                    </div>
                    <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mt-1">Total Seats</div>
                  </div>
                  <div className="text-center p-5 bg-green-50 rounded-lg border border-green-200 dark:bg-green-900/20 dark:border-green-800">
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                      {enclosure.allocatedSeats || 0}
                    </div>
                    <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mt-1">Allocated</div>
                  </div>
                  <div className="text-center p-5 bg-gray-50 rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                    <div className="text-3xl font-bold text-gray-700 dark:text-gray-300">
                      {enclosure.rows?.length || 0}
                    </div>
                    <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mt-1">Rows</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-1 bg-blue-600 rounded-full"></div>
                    <h4 className="font-bold text-gray-900 dark:text-white">Row Configuration</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {enclosure.rows?.map((row) => (
                      <div 
                        key={row.letter} 
                        className="p-3 bg-white border border-gray-200 rounded-lg text-sm hover:border-blue-300 hover:shadow-sm transition-all duration-200 dark:bg-gray-800 dark:border-gray-700"
                      >
                        <div className="font-bold text-gray-900 dark:text-white">Row {row.letter}</div>
                        <div className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                          Seats: {row.startSeat}-{row.endSeat}
                        </div>
                        {row.reservedSeats && (
                          <div className="text-red-600 dark:text-red-400 font-semibold text-xs mt-1">
                            Reserved: {row.reservedSeats}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Empty States */}
          {filteredEnclosures.length === 0 && enclosures.length > 0 && (
            <Card className="text-center py-16 border-2 border-dashed border-gray-300 bg-white dark:bg-dark-card rounded-xl">
              <CardContent>
                <div className="flex flex-col items-center gap-4">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                    <Search className="w-10 h-10 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Matching Enclosures</p>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">Try adjusting your search query</p>
                  </div>
                  <Button 
                    onClick={() => setSearchQuery('')}
                    variant="outline"
                    className="gap-2"
                  >
                    <X className="w-5 h-5" />
                    Clear Search
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {enclosures.length === 0 && (
            <Card className="text-center py-16 border-2 border-dashed border-gray-300 bg-white dark:bg-dark-card rounded-xl">
              <CardContent>
                <div className="flex flex-col items-center gap-4">
                  <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                    <Plus className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Enclosures Found</p>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">Create your first enclosure to get started</p>
                  </div>
                  <Button 
                    onClick={handleCreate}
                    className="gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Plus className="w-5 h-5" />
                    Create First Enclosure
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Enclosure Form Modal */}
      {/* Enclosure Form Modal */}
      {isEditing && currentEnclosure && (
        <EnclosureForm
          enclosure={currentEnclosure}
          onSave={handleCreateOrUpdate}
          onCancel={() => {
            setIsEditing(false);
            setCurrentEnclosure(null);
          }}
          loading={loading}
        />
      )}
    </div>
  );
}

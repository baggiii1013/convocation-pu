"use client";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import {
    AlertCircle,
    ChevronDown,
    ChevronUp,
    MapPin,
    RefreshCw,
    Search,
    Users
} from "lucide-react";
import React, { useEffect, useState } from "react";

interface Attendee {
  enrollmentId: string;
  name: string;
  course: string;
  school: string;
  degree: string;
  seat: number;
}

interface RowData {
  row: string;
  startSeat: number;
  endSeat: number;
  totalSeats: number;
  allocatedSeats: number;
  attendees: Attendee[];
}

interface Enclosure {
  letter: string;
  name: string | null;
  allocatedFor: string;
  entryDirection: string;
}

interface EnclosureData {
  enclosure: Enclosure;
  rows: RowData[];
  totalAllocations: number;
}

export default function AerialViewPage() {
  const [enclosures, setEnclosures] = useState<Enclosure[]>([]);
  const [selectedEnclosure, setSelectedEnclosure] = useState<string>("");
  const [enclosureData, setEnclosureData] = useState<EnclosureData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [highlightedAttendee, setHighlightedAttendee] = useState<string | null>(null);

  useEffect(() => {
    fetchEnclosures();
  }, []);

  useEffect(() => {
    if (selectedEnclosure) {
      fetchEnclosureData(selectedEnclosure);
    }
  }, [selectedEnclosure]);

  const fetchEnclosures = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/enclosures`, {
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to fetch enclosures");
      
      const data = await res.json();
      setEnclosures(data.data || []);
      
      if (data.data && data.data.length > 0) {
        setSelectedEnclosure(data.data[0].letter);
      }
    } catch (error) {
      console.error("Error fetching enclosures:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEnclosureData = async (enclosureLetter: string) => {
    try {
      setLoadingData(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/allocations/enclosure/${enclosureLetter}`, {
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to fetch enclosure data");
      
      const data = await res.json();
      setEnclosureData(data.data);
    } catch (error) {
      console.error("Error fetching enclosure data:", error);
      setEnclosureData(null);
    } finally {
      setLoadingData(false);
    }
  };

  const toggleRow = (rowLetter: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(rowLetter)) {
      newExpanded.delete(rowLetter);
    } else {
      newExpanded.add(rowLetter);
    }
    setExpandedRows(newExpanded);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setHighlightedAttendee(null);

    if (!term || !enclosureData) return;

    // Find the attendee in the data
    for (const row of enclosureData.rows) {
      const foundAttendee = row.attendees.find(
        (a) =>
          a.enrollmentId.toLowerCase().includes(term.toLowerCase()) ||
          a.name.toLowerCase().includes(term.toLowerCase())
      );

      if (foundAttendee) {
        // Expand the row and highlight the attendee
        setExpandedRows(new Set([row.row]));
        setHighlightedAttendee(foundAttendee.enrollmentId);
        
        // Scroll to the row
        setTimeout(() => {
          const element = document.getElementById(`row-${row.row}`);
          element?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
        break;
      }
    }
  };

  const filteredRows = enclosureData?.rows.filter((row) => {
    if (!searchTerm) return true;
    
    return row.attendees.some(
      (a) =>
        a.enrollmentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 dark:text-gray-400">Loading enclosures...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Aerial View - Seat Allocations
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          View and search seat allocations across all enclosures
        </p>
      </div>

      {/* Enclosure Selector & Search */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Enclosure Tabs */}
        <Card className="border-0 shadow-xl bg-white dark:bg-dark-card overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
          <CardHeader className="bg-gradient-to-r from-blue-50/50 to-cyan-50/50 dark:from-blue-900/20 dark:to-cyan-900/20">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              Select Enclosure
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
              <div className="flex flex-wrap gap-3">
                {enclosures.map((enc) => (
                  <Button
                    key={enc.letter}
                    onClick={() => setSelectedEnclosure(enc.letter)}
                    className={`min-w-[80px] transition-all duration-300 font-semibold ${
                      selectedEnclosure === enc.letter 
                        ? "bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg hover:shadow-xl" 
                        : "bg-white border-2 border-gray-300 text-gray-700 hover:border-blue-400 hover:shadow-md"
                    }`}
                  >
                    {enc.letter}
                    <span className="ml-2 text-xs opacity-75">
                      ({enc.allocatedFor})
                    </span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Search */}
          <Card className="border-0 shadow-xl bg-white overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-cyan-500 to-teal-500"></div>
            <CardHeader className="bg-gradient-to-r from-cyan-50/50 to-teal-50/50">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-lg">
                  <Search className="w-5 h-5 text-white" />
                </div>
                Search Attendee
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by name or enrollment ID..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-12 py-6 border-2 border-gray-200 focus:border-cyan-500 rounded-xl text-lg transition-colors"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enclosure Details */}
        {enclosureData && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Enclosure</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {enclosureData.enclosure.letter}
                  </p>
                  <p className="text-sm text-gray-500">
                    {enclosureData.enclosure.name || "No name"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Category</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {enclosureData.enclosure.allocatedFor}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Rows</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {enclosureData.rows.length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Allocated</p>
                  <p className="text-2xl font-bold text-green-600">
                    {enclosureData.totalAllocations}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {loadingData && (
          <div className="flex justify-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        )}

        {/* Row Data */}
        {!loadingData && filteredRows && filteredRows.length > 0 && (
          <div className="space-y-3">
            {filteredRows.map((row) => {
              const isExpanded = expandedRows.has(row.row);
              const occupancyRate = (row.allocatedSeats / row.totalSeats) * 100;

              return (
                <Card 
                  key={row.row} 
                  id={`row-${row.row}`}
                  className="overflow-hidden"
                >
                  {/* Row Header */}
                  <button
                    onClick={() => toggleRow(row.row)}
                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-lg">
                        {row.row}
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-gray-900">
                          Row {row.row}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Seats {row.startSeat} - {row.endSeat} • {row.allocatedSeats} allocated
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      {/* Occupancy Bar */}
                      <div className="hidden md:flex items-center gap-3">
                        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all"
                            style={{ width: `${occupancyRate}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700 w-12">
                          {occupancyRate.toFixed(0)}%
                        </span>
                      </div>

                      {/* Expand Icon */}
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Attendee List */}
                  {isExpanded && (
                    <div className="border-t border-gray-200 bg-gray-50">
                      {row.attendees.length > 0 ? (
                        <div className="p-4">
                          <div className="grid gap-2">
                            {row.attendees.map((attendee) => (
                              <div
                                key={attendee.enrollmentId}
                                className={`bg-white rounded-lg p-3 border ${
                                  highlightedAttendee === attendee.enrollmentId
                                    ? "border-yellow-400 bg-yellow-50"
                                    : "border-gray-200"
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center font-semibold text-sm">
                                        {attendee.seat}
                                      </div>
                                      <div>
                                        <p className="font-semibold text-gray-900">
                                          {attendee.name}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                          {attendee.enrollmentId}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-right text-sm text-gray-600">
                                    <p>{attendee.course}</p>
                                    <p className="text-xs">{attendee.school}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="p-8 text-center text-gray-500">
                          <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p>No attendees allocated to this row yet</p>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}

        {/* Empty State */}
      {!loadingData && filteredRows && filteredRows.length === 0 && (
        <Card className="p-12 text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No attendees found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm
              ? "Try adjusting your search term"
              : "No seat allocations in this enclosure yet"}
          </p>
        </Card>
      )}
    </div>
  );
}

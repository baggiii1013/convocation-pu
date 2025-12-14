"use client";

import Ticket from "@/components/ticket/Ticket";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { AlertCircle, Loader2, Search } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface SeatAllocation {
  enclosure: string;
  row: string;
  seat: number;
  allocatedAt: string;
}

interface AttendeeData {
  enrollmentId: string;
  name: string;
  course: string;
  school: string;
  degree: string;
  convocationEligible: boolean;
  convocationRegistered: boolean;
  crr: string; // Added CRR field
  allocation: SeatAllocation | null;
  hasVerificationToken: boolean; // Instead of direct verificationToken
  verificationToken?: string; // Add direct token field
}

export default function SearchSeatPage() {
  const [searchValue, setSearchValue] = useState("");
  const [searchType, setSearchType] = useState<"enrollment" | "crr">("enrollment");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attendeeData, setAttendeeData] = useState<AttendeeData | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchValue.trim()) {
      setError(`Please enter your ${searchType === "enrollment" ? "enrollment number" : "CRR number"}`);
      return;
    }

    setLoading(true);
    setError(null);
    setAttendeeData(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/attendees/public/search-by/${searchValue.trim()}`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || `No record found for this ${searchType === "enrollment" ? "enrollment number" : "CRR number"}`);
        return;
      }

      const attendeeInfo = data.data;
      
      // If attendee has a verification token, fetch it using CRR
      if (attendeeInfo.hasVerificationToken && attendeeInfo.crr) {
        try {
          const tokenResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/attendees/public/verify-crr`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                enrollmentId: attendeeInfo.enrollmentId,
                crr: attendeeInfo.crr
              })
            }
          );

          const tokenData = await tokenResponse.json();
          
          if (tokenResponse.ok && tokenData.success) {
            attendeeInfo.verificationToken = tokenData.data.verificationToken;
          }
        } catch (err) {
          console.error("Failed to fetch verification token:", err);
        }
      }

      setAttendeeData(attendeeInfo);
    } catch (err) {
      setError("Failed to search. Please try again later.");
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchValue("");
    setError(null);
    setAttendeeData(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-700 to-primary-500 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
      
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -100, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-20 left-20 w-96 h-96 bg-primary-400 rounded-full blur-3xl opacity-30"
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Find Your Seat
            </h1>
            <p className="text-lg text-white/90">
              Enter your enrollment number or CRR to view your seat allocation
            </p>
          </motion.div>

          {/* Search Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-8 border border-white/20"
          >
            <form onSubmit={handleSearch} className="space-y-6">
              {/* Search Type Toggle */}
              <div className="flex justify-center gap-4 mb-4">
                <button
                  type="button"
                  onClick={() => setSearchType("enrollment")}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    searchType === "enrollment"
                      ? "bg-white text-primary-600"
                      : "bg-white/20 text-white hover:bg-white/30"
                  }`}
                >
                  Enrollment Number
                </button>
                <button
                  type="button"
                  onClick={() => setSearchType("crr")}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    searchType === "crr"
                      ? "bg-white text-primary-600"
                      : "bg-white/20 text-white hover:bg-white/30"
                  }`}
                >
                  CRR Number
                </button>
              </div>

              <div>
                <label
                  htmlFor="searchValue"
                  className="block text-white font-medium mb-2"
                >
                  {searchType === "enrollment" ? "Enrollment Number" : "CRR Number"}
                </label>
                <input
                  id="searchValue"
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value.toUpperCase())}
                  placeholder={`Enter your ${searchType === "enrollment" ? "enrollment number" : "CRR number"}`}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                  disabled={loading}
                />
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-white text-primary-600 hover:bg-white/90"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-5 w-5" />
                      Search
                    </>
                  )}
                </Button>

                {attendeeData && (
                  <Button
                    type="button"
                    onClick={handleReset}
                    variant="outline"
                    className="border-white text-white hover:bg-white/10"
                    size="lg"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </form>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/20 backdrop-blur-md border border-red-500/50 rounded-xl p-6 mb-8"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-200 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-red-100 font-semibold mb-1">
                    Search Failed
                  </h3>
                  <p className="text-red-200">{error}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Results */}
          {attendeeData && !error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Attendee Info Card */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Student Information
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-white/70 text-sm">Name</p>
                    <p className="text-white font-semibold text-lg">
                      {attendeeData.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">Enrollment ID</p>
                    <p className="text-white font-semibold text-lg">
                      {attendeeData.enrollmentId}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">CRR Number</p>
                    <p className="text-white font-semibold text-lg">
                      {attendeeData.crr}
                    </p>
                  </div>
                  {/* <div>
                    <p className="text-white/70 text-sm">Course</p>
                    <p className="text-white font-semibold">
                      {attendeeData.course}
                    </p>
                  </div> */}
                  <div>
                    <p className="text-white/70 text-sm">University</p>
                    <p className="text-white font-semibold">
                      {attendeeData.school}
                    </p>
                  </div>
                  {/* <div>
                    <p className="text-white/70 text-sm">Degree</p>
                    <p className="text-white font-semibold">
                      {attendeeData.degree}
                    </p>
                  </div> */}
                  <div>
                    <p className="text-white/70 text-sm">Status</p>
                    <div className="flex gap-2 mt-1">
                      {attendeeData.convocationEligible && (
                        <span className="px-3 py-1 bg-green-500/30 text-green-100 text-xs rounded-full border border-green-500/50">
                          Eligible
                        </span>
                      )}
                      {attendeeData.convocationRegistered && (
                        <span className="px-3 py-1 bg-blue-500/30 text-blue-100 text-xs rounded-full border border-blue-500/50">
                          Registered
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Seat Allocation */}
              {attendeeData.allocation ? (
                <>
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                    <h2 className="text-2xl font-bold text-white mb-6">
                      Seat Allocation
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                      <div className="text-center">
                        <p className="text-white/70 text-sm mb-2">Enclosure</p>
                        <p className="text-4xl font-bold text-white">
                          {attendeeData.allocation.enclosure}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-white/70 text-sm mb-2">Row</p>
                        <p className="text-4xl font-bold text-white">
                          {attendeeData.allocation.row}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-white/70 text-sm mb-2">Seat</p>
                        <p className="text-4xl font-bold text-white">
                          {attendeeData.allocation.seat}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/*food instructions */}
                  <div className="bg-black/50 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                    <h2 className="text-2xl font-bold text-accent-red mb-6">
                      All students and parents are requested to have dinner strictly in their allotted phase (Phase 1 or Phase 2) and only in their assigned zone as mentioned on the coupon (Red Zone, Blue Zone, or Purple Zone). This phase-wise arrangement is to ensure smooth management and avoid overcrowding.
                    </h2>
                    <div className="relative w-full overflow-hidden rounded-lg">
                      <Image
                        src="/Dinner_instructions.jpeg"
                        alt="Dinner Instructions"
                        width={1200}
                        height={800}
                        className="w-full h-auto"
                        priority
                      />
                    </div>
                  </div>
                  {/* Convocation Layout */}
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                    <h2 className="text-2xl font-bold text-white mb-6">
                      Venue Layout
                    </h2>
                    <div className="relative w-full overflow-hidden rounded-lg">
                      <Image
                        src="/Convocation Layout Final-1.png"
                        alt="Convocation Venue Layout"
                        width={1200}
                        height={800}
                        className="w-full h-auto"
                        priority
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-yellow-500/20 backdrop-blur-md border border-yellow-500/50 rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-6 h-6 text-yellow-200 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-yellow-100 font-semibold mb-1">
                        No Seat Allocated Yet
                      </h3>
                      <p className="text-yellow-200">
                        Your seat has not been allocated yet. Please check back
                        later or contact the administration.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { Html5Qrcode } from "html5-qrcode";
import { AlertCircle, Camera, CheckCircle, Loader2, QrCode, User, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface VerificationResult {
  success: boolean;
  message: string;
  attendee?: {
    enrollmentId: string;
    name: string;
    course: string;
    school: string;
    allocation: {
      enclosure: string;
      row: string;
      seat: number;
    };
    attendanceMarked: boolean;
    attendanceMarkedAt: string;
  };
  alreadyMarked?: boolean;
  verified?: boolean; // Whether token is verified but attendance not yet marked
}

export default function VerifyTicketPage() {
  const [token, setToken] = useState("");
  const [enrollmentId, setEnrollmentId] = useState("");
  const [verificationMethod, setVerificationMethod] = useState<'token' | 'enrollment'>('token');
  const [loading, setLoading] = useState(false);
  const [confirmingAttendance, setConfirmingAttendance] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState<string>("");
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const scannerDivId = "qr-reader";
  const isProcessingRef = useRef(false);

  const handleVerifyByEnrollment = async (enrollmentIdToVerify: string) => {
    if (!enrollmentIdToVerify.trim()) {
      setResult({
        success: false,
        message: "Please enter an enrollment ID"
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/attendees/verify-by-enrollment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ enrollmentId: enrollmentIdToVerify, verifyOnly: true })
        }
      );

      const data = await response.json();
      
      console.log("Enrollment Verification API Response:", data);
      
      if (data.success && data.data) {
        setResult({
          success: data.success,
          message: data.message,
          attendee: data.data.attendee,
          alreadyMarked: data.data.alreadyMarked,
          verified: true
        });
      } else {
        setResult(data);
      }
    } catch (err) {
      setResult({
        success: false,
        message: "Verification failed. Please try again."
      });
      console.error("Enrollment verification error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (verificationToken: string) => {
    if (!verificationToken.trim()) {
      setResult({
        success: false,
        message: "Please enter a verification token"
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/attendees/verify-ticket`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ token: verificationToken, verifyOnly: true })
        }
      );

      const data = await response.json();
      
      console.log("Verification API Response:", data);
      
      // API returns data wrapped in a 'data' object, so we need to extract it
      if (data.success && data.data) {
        setResult({
          success: data.success,
          message: data.message,
          attendee: data.data.attendee,
          alreadyMarked: data.data.alreadyMarked
        });
      } else {
        setResult(data);
      }
    } catch (err) {
      setResult({
        success: false,
        message: "Verification failed. Please try again."
      });
      console.error("Verification error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAttendanceByEnrollment = async () => {
    if (!enrollmentId.trim()) {
      return;
    }

    setConfirmingAttendance(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/attendees/verify-by-enrollment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ enrollmentId: enrollmentId, verifyOnly: false })
        }
      );

      const data = await response.json();
      
      console.log("Confirm Attendance by Enrollment API Response:", data);
      
      if (data.success && data.data) {
        setResult({
          success: data.success,
          message: data.message,
          attendee: data.data.attendee,
          alreadyMarked: data.data.alreadyMarked
        });
      } else {
        setResult(data);
      }
    } catch (err) {
      setResult({
        success: false,
        message: "Failed to mark attendance. Please try again."
      });
      console.error("Attendance marking error:", err);
    } finally {
      setConfirmingAttendance(false);
    }
  };

  const handleConfirmAttendance = async () => {
    if (!token.trim()) {
      return;
    }

    setConfirmingAttendance(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/attendees/verify-ticket`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ token: token, verifyOnly: false })
        }
      );

      const data = await response.json();
      
      console.log("Confirm Attendance API Response:", data);
      
      // API returns data wrapped in a 'data' object, so we need to extract it
      if (data.success && data.data) {
        setResult({
          success: data.success,
          message: data.message,
          attendee: data.data.attendee,
          alreadyMarked: data.data.alreadyMarked
        });
      } else {
        setResult(data);
      }
    } catch (err) {
      setResult({
        success: false,
        message: "Failed to mark attendance. Please try again."
      });
      console.error("Attendance marking error:", err);
    } finally {
      setConfirmingAttendance(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationMethod === 'token') {
      handleVerify(token);
    } else {
      handleVerifyByEnrollment(enrollmentId);
    }
  };

  const startScanning = async () => {
    try {
      setScanError("");
      
      // First set scanning to true to render the div
      setScanning(true);
      
      // Wait for DOM to update
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Check if element exists
      const element = document.getElementById(scannerDivId);
      if (!element) {
        throw new Error("Scanner element not found. Please try again.");
      }
      
      // Initialize Html5Qrcode if not already done
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode(scannerDivId);
      }

      const qrCodeScanner = html5QrCodeRef.current;

      // Start scanning
      await qrCodeScanner.start(
        { facingMode: "environment" }, // Use back camera on mobile
        {
          fps: 5, // Scans per second
          qrbox: { width: 250, height: 250 }, // Scanning box size
        },
        (decodedText) => {
          // Successfully decoded QR code
          // Prevent multiple scans while processing
          if (isProcessingRef.current) {
            return;
          }
          
          isProcessingRef.current = true;
          console.log("QR Code scanned:", decodedText);
          setToken(decodedText);
          
          // Stop scanning first
          stopScanning().then(() => {
            // Then verify the scanned token
            handleVerify(decodedText);
            // Reset processing flag after a delay
            setTimeout(() => {
              isProcessingRef.current = false;
            }, 1000);
          });
        },
        (errorMessage) => {
          // Handle scan failure (most are just "No QR code found")
          // We can ignore these as they happen continuously while scanning
        }
      );
    } catch (err: any) {
      console.error("Error starting QR scanner:", err);
      setScanError(err?.message || "Unable to access camera. Please check permissions.");
      setScanning(false);
    }
  };

  const stopScanning = async () => {
    try {
      if (html5QrCodeRef.current) {
        const state = await html5QrCodeRef.current.getState();
        if (state === 2) { // Scanner is running (state 2 means scanning)
          await html5QrCodeRef.current.stop();
        }
      }
    } catch (err) {
      console.error("Error stopping scanner:", err);
    }
    setScanning(false);
  };

  useEffect(() => {
    // Cleanup function to stop scanner on unmount
    return () => {
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.stop().catch(() => {
          // Ignore errors during cleanup
        });
      }
    };
  }, []);

  const handleReset = () => {
    setToken("");
    setEnrollmentId("");
    setResult(null);
    setVerificationMethod('token');
    stopScanning();
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
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
              <QrCode className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Verify Ticket & Mark Attendance
            </h1>
            <p className="text-lg text-white/90">
              Scan QR code, enter verification token, or use enrollment ID to mark attendance
            </p>
          </motion.div>

          {/* Verification Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-8 border border-white/20"
          >
            {/* Method Selection */}
            <div className="mb-6">
              <p className="text-white font-medium mb-3">Choose Verification Method:</p>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setVerificationMethod('token');
                    setResult(null);
                  }}
                  className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                    verificationMethod === 'token'
                      ? 'border-white bg-white/20 text-white'
                      : 'border-white/30 text-white/70 hover:border-white/50 hover:text-white/90'
                  }`}
                >
                  <QrCode className="w-5 h-5 mx-auto mb-1" />
                  <div className="text-sm font-medium">QR Code / Token</div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setVerificationMethod('enrollment');
                    setResult(null);
                  }}
                  className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                    verificationMethod === 'enrollment'
                      ? 'border-white bg-white/20 text-white'
                      : 'border-white/30 text-white/70 hover:border-white/50 hover:text-white/90'
                  }`}
                >
                  <User className="w-5 h-5 mx-auto mb-1" />
                  <div className="text-sm font-medium">Enrollment ID</div>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {verificationMethod === 'token' ? (
                <div>
                  <label
                    htmlFor="token"
                    className="block text-white font-medium mb-2"
                  >
                    Verification Token
                  </label>
                  <input
                    id="token"
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Enter verification token"
                    className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 font-mono text-sm"
                    disabled={loading || scanning}
                  />
                </div>
              ) : (
                <div>
                  <label
                    htmlFor="enrollmentId"
                    className="block text-white font-medium mb-2"
                  >
                    Enrollment Number
                  </label>
                  <input
                    id="enrollmentId"
                    type="text"
                    value={enrollmentId}
                    onChange={(e) => setEnrollmentId(e.target.value.toUpperCase())}
                    placeholder="Enter enrollment number (e.g., PU22CS001)"
                    className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                    disabled={loading}
                  />
                </div>
              )}

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={loading || scanning}
                  className="flex-1 bg-white text-primary-600 hover:bg-white/90"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Verify
                    </>
                  )}
                </Button>

                {verificationMethod === 'token' && (
                  <Button
                    type="button"
                    onClick={scanning ? stopScanning : startScanning}
                    variant="outline"
                    className="border-white text-white hover:bg-white/10"
                    size="lg"
                    disabled={loading}
                  >
                    <Camera className="mr-2 h-5 w-5" />
                    {scanning ? "Stop Scan" : "Scan QR"}
                  </Button>
                )}

                {result && (
                  <Button
                    type="button"
                    onClick={handleReset}
                    variant="outline"
                    className="border-white text-white hover:bg-white/10"
                    size="lg"
                  >
                    Reset
                  </Button>
                )}
              </div>
            </form>

            {/* QR Scanner - Only show in token mode */}
            {scanning && verificationMethod === 'token' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6"
              >
                <div className="relative">
                  <div 
                    id={scannerDivId} 
                    className="w-full rounded-lg overflow-hidden"
                  />
                  <Button
                    type="button"
                    onClick={stopScanning}
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2 bg-red-500 text-white border-red-600 hover:bg-red-600"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Close Scanner
                  </Button>
                </div>
                <p className="text-white/70 text-sm text-center mt-3">
                  📱 Position the QR code within the frame to scan automatically
                </p>
              </motion.div>
            )}

            {/* Scan Error */}
            {scanError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 bg-red-500/20 border border-red-500/50 rounded-lg p-4"
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-200" />
                  <p className="text-red-200 text-sm">{scanError}</p>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Results */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${
                result.success
                  ? "bg-green-500/20 border-green-500/50"
                  : "bg-red-500/20 border-red-500/50"
              } backdrop-blur-md border rounded-2xl p-8`}
            >
              <div className="flex items-start gap-4 mb-6">
                {result.success ? (
                  <CheckCircle className="w-8 h-8 text-green-200 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-8 h-8 text-red-200 flex-shrink-0" />
                )}
                <div>
                  <h3
                    className={`text-2xl font-bold mb-2 ${
                      result.success ? "text-green-100" : "text-red-100"
                    }`}
                  >
                    {result.success ? "Verification Successful" : "Verification Failed"}
                  </h3>
                  <p
                    className={
                      result.success ? "text-green-200" : "text-red-200"
                    }
                  >
                    {result.message}
                  </p>
                </div>
              </div>

              {result.success && result.attendee && (
                <div className="space-y-4 mt-6">
                  {result.alreadyMarked && (
                    <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4">
                      <p className="text-yellow-100 font-medium">
                        ⚠️ Attendance was already marked for this attendee
                      </p>
                    </div>
                  )}

                  {/* Show confirm attendance button if ticket is verified but not marked */}
                  {!result.attendee.attendanceMarked && !result.alreadyMarked && (
                    <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-6">
                      <div className="flex flex-col items-center gap-4">
                        <p className="text-blue-100 text-lg font-medium text-center">
                          ✓ {verificationMethod === 'token' ? 'Ticket' : 'Student'} verified successfully! Click below to mark attendance.
                        </p>
                        <Button
                          onClick={verificationMethod === 'token' ? handleConfirmAttendance : handleConfirmAttendanceByEnrollment}
                          disabled={confirmingAttendance}
                          className="bg-green-600 text-white hover:bg-green-700 px-8 py-3 text-lg font-semibold"
                          size="lg"
                        >
                          {confirmingAttendance ? (
                            <>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              Confirming...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="mr-2 h-5 w-5" />
                              Confirm Attendance
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                    <h4 className="text-white font-bold text-lg mb-4">
                      Attendee Information
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-white/70 text-sm">Name</p>
                        <p className="text-white font-semibold text-lg">
                          {result.attendee.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-white/70 text-sm">Enrollment ID</p>
                        <p className="text-white font-semibold text-lg">
                          {result.attendee.enrollmentId}
                        </p>
                      </div>
                      <div>
                        <p className="text-white/70 text-sm">Course</p>
                        <p className="text-white font-semibold">
                          {result.attendee.course}
                        </p>
                      </div>
                      <div>
                        <p className="text-white/70 text-sm">School</p>
                        <p className="text-white font-semibold">
                          {result.attendee.school}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                    <h4 className="text-white font-bold text-lg mb-4">
                      Seat Allocation
                    </h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-white/70 text-sm mb-1">Enclosure</p>
                        <p className="text-3xl font-bold text-white">
                          {result.attendee.allocation.enclosure}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-white/70 text-sm mb-1">Row</p>
                        <p className="text-3xl font-bold text-white">
                          {result.attendee.allocation.row}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-white/70 text-sm mb-1">Seat</p>
                        <p className="text-3xl font-bold text-white">
                          {result.attendee.allocation.seat}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                    <h4 className="text-white font-bold text-lg mb-2">
                      Attendance Status
                    </h4>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                      <p className="text-white">
                        Marked at:{" "}
                        {new Date(
                          result.attendee.attendanceMarkedAt
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Instructions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mt-8 border border-white/20"
          >
            <h3 className="text-white font-bold text-lg mb-3">
              How to Verify & Mark Attendance
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-white font-semibold mb-2">Method 1: QR Code / Token</h4>
                <ul className="space-y-2 text-white/80 pl-4">
                  <li className="flex items-start gap-2">
                    <span className="text-white font-bold">•</span>
                    <span>Ask the attendee to show their QR code from the seat search page</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-white font-bold">•</span>
                    <span>Click "Scan QR" and use your device camera or enter the token manually</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-white font-semibold mb-2">Method 2: Enrollment ID</h4>
                <ul className="space-y-2 text-white/80 pl-4">
                  <li className="flex items-start gap-2">
                    <span className="text-white font-bold">•</span>
                    <span>Switch to "Enrollment ID" method</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-white font-bold">•</span>
                    <span>Ask for and enter the attendee's enrollment number (e.g., PU22CS001)</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-2">Final Steps (Both Methods)</h4>
                <ul className="space-y-2 text-white/80 pl-4">
                  <li className="flex items-start gap-2">
                    <span className="text-white font-bold">•</span>
                    <span>Review the attendee details and seat allocation carefully</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-white font-bold">•</span>
                    <span>Click "Confirm Attendance" button to mark the attendance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-white font-bold">•</span>
                    <span>Allow the attendee to proceed to their allocated seat</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

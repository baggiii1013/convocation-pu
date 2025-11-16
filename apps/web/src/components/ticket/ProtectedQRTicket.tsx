"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Download, Eye, EyeOff, FileImage, FileText, Lock } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { downloadTicketAsImage, downloadTicketAsPDF } from "../../utils/ticketDownload";
import Ticket from "./Ticket";

interface ProtectedQRTicketProps {
  attendeeData: {
    enrollmentId: string;
    name: string;
    course: string;
    school: string;
    degree: string;
    crr: string;
    allocation: {
      enclosure: string;
      row: string;
      seat: number;
    } | null;
    hasVerificationToken: boolean;
  };
  onDownload?: () => void;
}

export function ProtectedQRTicket({ attendeeData, onDownload }: ProtectedQRTicketProps) {
  const [crrInput, setCrrInput] = useState("");
  const [verificationToken, setVerificationToken] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCrr, setShowCrr] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const downloadMenuRef = useRef<HTMLDivElement>(null);

  // Close download menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (downloadMenuRef.current && !downloadMenuRef.current.contains(event.target as Node)) {
        setShowDownloadMenu(false);
      }
    };

    if (showDownloadMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDownloadMenu]);

  const handleVerifyCrr = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!crrInput.trim()) {
      setError("Please enter your CRR number");
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/attendees/public/verify-crr`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            enrollmentId: attendeeData.enrollmentId,
            crr: crrInput.trim()
          })
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Invalid CRR number. Please try again.");
        return;
      }

      // CRR verified successfully
      setVerificationToken(data.data.verificationToken);
      setIsUnlocked(true);
      setError(null);
    } catch (err) {
      setError("Verification failed. Please try again later.");
      console.error("CRR verification error:", err);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDownload = async (format: 'pdf' | 'image') => {
    if (!isUnlocked || !verificationToken || !attendeeData.allocation) {
      return;
    }

    setIsDownloading(true);
    setShowDownloadMenu(false);

    try {
      const ticketData = {
        name: attendeeData.name,
        enrollmentId: attendeeData.enrollmentId,
        course: attendeeData.course,
        school: attendeeData.school,
        degree: attendeeData.degree,
        allocation: attendeeData.allocation,
        verificationToken: verificationToken,
      };

      if (format === 'pdf') {
        await downloadTicketAsPDF(ticketData);
      } else {
        await downloadTicketAsImage(ticketData);
      }

      // Call the parent's onDownload if provided
      if (onDownload) {
        onDownload();
      }
    } catch (error) {
      console.error('Download failed:', error);
      setError('Failed to download ticket. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  if (!attendeeData.hasVerificationToken) {
    return (
      <div className="bg-yellow-500/20 backdrop-blur-md border border-yellow-500/50 rounded-xl p-6">
        <div className="flex items-center gap-3">
          <Lock className="w-6 h-6 text-yellow-200 flex-shrink-0" />
          <div>
            <h3 className="text-yellow-100 font-semibold mb-1">
              QR Code Not Available
            </h3>
            <p className="text-yellow-200">
              Your digital ticket is not ready yet. Please contact the administration.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!attendeeData.allocation) {
    return (
      <div className="bg-yellow-500/20 backdrop-blur-md border border-yellow-500/50 rounded-xl p-6">
        <div className="flex items-center gap-3">
          <Lock className="w-6 h-6 text-yellow-200 flex-shrink-0" />
          <div>
            <h3 className="text-yellow-100 font-semibold mb-1">
              No Seat Allocated Yet
            </h3>
            <p className="text-yellow-200">
              Your seat has not been allocated yet. Please check back later or contact the administration.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {!isUnlocked ? (
          <motion.div
            key="verification-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
          >
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-6 h-6 text-white" />
              <h3 className="text-white font-semibold text-lg">
                Enter CRR Number to View QR Code
              </h3>
            </div>
            
            <p className="text-white/80 text-sm mb-6">
              For security purposes, please enter your CRR number to unlock and view your digital ticket with QR code.
            </p>

            <form onSubmit={handleVerifyCrr} className="space-y-4">
              <div className="relative">
                <input
                  type={showCrr ? "text" : "password"}
                  value={crrInput}
                  onChange={(e) => setCrrInput(e.target.value)}
                  placeholder="Enter your CRR number"
                  className="w-full px-4 py-3 pr-12 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                  disabled={isVerifying}
                />
                <button
                  type="button"
                  onClick={() => setShowCrr(!showCrr)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                  disabled={isVerifying}
                >
                  {showCrr ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isVerifying || !crrInput.trim()}
                className="w-full bg-white text-primary-600 hover:bg-white/90 disabled:bg-white/50 disabled:text-primary-400 py-3 px-4 rounded-lg font-semibold transition-colors"
              >
                {isVerifying ? "Verifying..." : "Unlock QR Code"}
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="qr-ticket"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold text-lg">
                  Your Digital Ticket
                </h3>
              </div>
              
              <div className="relative" ref={downloadMenuRef}>
                <button
                  onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                  disabled={isDownloading}
                  className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  {isDownloading ? "Downloading..." : "Download"}
                </button>
                
                {showDownloadMenu && (
                  <div className="absolute right-0 top-full mt-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-lg z-10 overflow-hidden">
                    <button
                      onClick={() => handleDownload('pdf')}
                      disabled={isDownloading}
                      className="flex items-center gap-3 w-full px-4 py-3 text-white hover:bg-white/20 transition-colors disabled:opacity-50"
                    >
                      <FileText className="w-4 h-4" />
                      Download as PDF
                    </button>
                    <button
                      onClick={() => handleDownload('image')}
                      disabled={isDownloading}
                      className="flex items-center gap-3 w-full px-4 py-3 text-white hover:bg-white/20 transition-colors disabled:opacity-50"
                    >
                      <FileImage className="w-4 h-4" />
                      Download as Image
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-center">
              {/* @ts-ignore - Ticket is JSX component with default props */}
              <Ticket
                mode="ticket"
                name={attendeeData.name}
                title={attendeeData.course}
                handle={attendeeData.enrollmentId}
                status={`${attendeeData.allocation.enclosure}-${attendeeData.allocation.row}-${attendeeData.allocation.seat}`}
                verificationToken={verificationToken}
                contactText="Download PDF"
                onContactClick={() => handleDownload('pdf')}
              />
            </div>
            
            <p className="text-white/70 text-sm text-center">
              Show this QR code at the venue for entry verification
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
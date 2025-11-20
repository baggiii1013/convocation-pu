'use client';

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/Select";
import {
    AlertCircle,
    CheckCircle,
    Eye,
    Loader2,
    Mail,
    Send,
    Users
} from "lucide-react";
import React, { useState } from "react";

interface Enclosure {
  letter: string;
  name: string | null;
  allocatedFor: string;
  totalSeats: number;
  allocatedSeats: number;
}

interface EmailRecipient {
  enrollmentId: string;
  name: string;
  email: string;
  enclosure?: string;
}

interface EmailSenderProps {
  enclosures: Enclosure[];
}

type EmailType = 'PROMOTIONAL' | 'INFORMATIONAL' | 'REMINDER' | 'ANNOUNCEMENT' | 'TICKET';

export function EmailSender({ enclosures }: EmailSenderProps) {
  const [selectedEnclosures, setSelectedEnclosures] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [emailType, setEmailType] = useState<EmailType>('INFORMATIONAL');
  const [sending, setSending] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [recipients, setRecipients] = useState<EmailRecipient[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [result, setResult] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const handleEnclosureToggle = (letter: string) => {
    setSelectedEnclosures(prev => {
      if (prev.includes(letter)) {
        return prev.filter(l => l !== letter);
      } else {
        return [...prev, letter];
      }
    });
    setSelectAll(false);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedEnclosures([]);
      setSelectAll(false);
    } else {
      setSelectedEnclosures(enclosures.map(e => e.letter));
      setSelectAll(true);
    }
  };

  const handlePreview = async () => {
    if (!validateForm()) return;

    setPreviewing(true);
    setResult(null);
    setShowPreview(false);

    try {
      const recipientCriteria = selectAll
        ? { all: true }
        : { enclosures: selectedEnclosures };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/emails/preview-recipients`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ recipients: recipientCriteria }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        // Handle specific error cases
        if (res.status === 401) {
          throw new Error('Authentication required. Please log in again.');
        }
        if (res.status === 403) {
          throw new Error('Admin access required.');
        }
        throw new Error(data.message || `Failed to preview recipients (${res.status})`);
      }

      setRecipients(data.data.recipients);
      setShowPreview(true);
    } catch (error) {
      console.error('Preview error:', error);
      setResult({
        type: 'error',
        message:
          error instanceof Error ? error.message : 'Failed to preview recipients',
      });
    } finally {
      setPreviewing(false);
    }
  };

  const validateForm = () => {
    if (!selectAll && selectedEnclosures.length === 0) {
      setResult({
        type: 'error',
        message: 'Please select at least one enclosure or choose "All Attendees"',
      });
      return false;
    }

    // Skip subject and message validation for TICKET type
    if (emailType === 'TICKET') {
      return true;
    }

    if (!subject.trim()) {
      setResult({
        type: 'error',
        message: 'Please enter an email subject',
      });
      return false;
    }

    if (!message.trim() || message.trim().length < 10) {
      setResult({
        type: 'error',
        message: 'Please enter a message (at least 10 characters)',
      });
      return false;
    }

    return true;
  };

  const handleSendEmail = async () => {
    if (!validateForm()) return;

    if (
      !confirm(
        `Are you sure you want to send this email to ${recipients.length} recipients?`
      )
    ) {
      return;
    }

    setSending(true);
    setResult(null);

    try {
      const recipientCriteria = selectAll
        ? { all: true }
        : { enclosures: selectedEnclosures };

      // Build payload - exclude subject/message for TICKET type
      const payload: {
        recipients: typeof recipientCriteria;
        emailType: EmailType;
        sendAsHtml: boolean;
        subject?: string;
        message?: string;
      } = {
        recipients: recipientCriteria,
        emailType,
        sendAsHtml: false,
      };

      // Only include subject and message for non-TICKET emails
      if (emailType !== 'TICKET') {
        payload.subject = subject;
        payload.message = message;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/emails/send-bulk`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        // Handle specific error cases
        if (res.status === 401) {
          throw new Error('Authentication required. Please log in again.');
        }
        if (res.status === 403) {
          throw new Error('Admin access required.');
        }
        throw new Error(data.message || `Failed to send email (${res.status})`);
      }

      setResult({
        type: 'success',
        message: `Email sent successfully to ${data.data.success} recipients${
          data.data.failed > 0 ? `, ${data.data.failed} failed` : ''
        }!`,
      });

      // Reset form on success
      setSubject('');
      setMessage('');
      setSelectedEnclosures([]);
      setSelectAll(false);
      setShowPreview(false);
      setRecipients([]);
    } catch (error) {
      console.error('Send error:', error);
      setResult({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to send email',
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-dark-border bg-dark-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary-400" />
            Send Email to Attendees
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email Type */}
          <div className="space-y-2">
            <Label htmlFor="emailType">Email Type</Label>
            <Select value={emailType} onValueChange={(value) => setEmailType(value as EmailType)}>
              <SelectTrigger id="emailType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INFORMATIONAL">Informational</SelectItem>
                <SelectItem value="PROMOTIONAL">Promotional</SelectItem>
                <SelectItem value="REMINDER">Reminder</SelectItem>
                <SelectItem value="ANNOUNCEMENT">Announcement</SelectItem>
                <SelectItem value="TICKET">Ticket</SelectItem>
              </SelectContent>
            </Select>
            {emailType === 'TICKET' && (
              <div className="mt-2 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-sm text-blue-400">
                  ℹ️ Ticket emails use auto-generated subject and message. Recipients will receive their seat allocation details and verification token.
                </p>
              </div>
            )}
          </div>

          {/* Recipient Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Recipients</Label>
              {selectAll ? (
                <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                  Sending to ALL attendees
                </span>
              ) : selectedEnclosures.length > 0 ? (
                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                  {selectedEnclosures.length} enclosure{selectedEnclosures.length !== 1 ? 's' : ''} selected
                </span>
              ) : (
                <span className="text-xs bg-gray-500/20 text-gray-400 px-2 py-1 rounded">
                  No recipients selected
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                id="selectAll"
                checked={selectAll}
                onChange={handleSelectAll}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                aria-label="Select all attendees"
              />
              <Label htmlFor="selectAll" className="cursor-pointer">
                All Attendees
              </Label>
            </div>

            {!selectAll && (
              <>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Select one or more enclosures to send emails to specific groups
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {enclosures.map((enclosure) => (
                  <div
                    key={enclosure.letter}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedEnclosures.includes(enclosure.letter)
                        ? 'border-primary-500 bg-primary-500/10'
                        : 'border-dark-border hover:border-primary-400'
                    }`}
                    onClick={() => handleEnclosureToggle(enclosure.letter)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold text-white">{enclosure.letter}</div>
                        {enclosure.name && (
                          <div className="text-xs text-gray-400 mt-1">{enclosure.name}</div>
                        )}
                        <div className="text-xs text-gray-500 mt-1">
                          {enclosure.allocatedSeats} attendees
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedEnclosures.includes(enclosure.letter)}
                        onChange={() => {}}
                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        aria-label={`Select enclosure ${enclosure.letter}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
              {selectedEnclosures.length > 0 && (
                <div className="mt-2 text-sm text-primary-600 dark:text-primary-400">
                  {selectedEnclosures.length} enclosure{selectedEnclosures.length !== 1 ? 's' : ''} selected: {selectedEnclosures.join(', ')}
                </div>
              )}
              </>
            )}
          </div>

          {/* Subject - Hidden for TICKET type */}
          {emailType !== 'TICKET' && (
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                type="text"
                placeholder="Enter email subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                maxLength={200}
              />
              <div className="text-xs text-gray-500 text-right">{subject.length}/200</div>
            </div>
          )}

          {/* Message - Hidden for TICKET type */}
          {emailType !== 'TICKET' && (
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <textarea
                id="message"
                rows={8}
                placeholder="Enter your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={10000}
                className="flex w-full rounded-lg border border-dark-border bg-dark-surface text-white px-4 py-2.5 text-base transition-all duration-200 placeholder:text-gray-400 focus-visible:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 resize-none"
              />
              <div className="text-xs text-gray-500 text-right">{message.length}/10,000</div>
            </div>
          )}

          {/* Result Message */}
          {result && (
            <div
              className={`flex items-center gap-2 p-4 rounded-lg ${
                result.type === 'success'
                  ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                  : 'bg-red-500/10 border border-red-500/30 text-red-400'
              }`}
            >
              {result.type === 'success' ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              <span>{result.message}</span>
            </div>
          )}

          {/* Preview Section */}
          {showPreview && recipients.length > 0 && (
            <div className="border border-dark-border rounded-lg p-4 bg-dark-surface">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Recipients ({recipients.length})
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPreview(false)}
                >
                  Hide Preview
                </Button>
              </div>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {recipients.map((recipient, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded bg-dark-card text-sm"
                  >
                    <div>
                      <div className="text-white font-medium">{recipient.name}</div>
                      <div className="text-gray-400 text-xs">{recipient.email}</div>
                    </div>
                    {recipient.enclosure && (
                      <div className="text-xs text-gray-500 bg-dark-surface px-2 py-1 rounded">
                        {recipient.enclosure}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handlePreview}
              disabled={previewing || sending}
              variant="outline"
              className="flex-1"
            >
              {previewing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Recipients
                </>
              )}
            </Button>

            <Button
              onClick={handleSendEmail}
              disabled={sending || previewing || recipients.length === 0}
              className="flex-1"
            >
              {sending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Email
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

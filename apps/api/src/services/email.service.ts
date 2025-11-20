import sgMail from '@sendgrid/mail';
import QRCode from 'qrcode';
import { prisma } from '../lib/prisma.js';
import { logger } from '../utils/logger.js';

// Initialize SendGrid
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const SENDGRID_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'noreply@convocation.edu';
const SENDGRID_FROM_NAME = process.env.SENDGRID_FROM_NAME || 'PU Convocation';

if (!SENDGRID_API_KEY) {
  logger.warn('SENDGRID_API_KEY not configured. Email functionality will be disabled.');
} else {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

export interface EmailRecipient {
  enrollmentId: string;
  name: string;
  email: string;
  enclosure?: string;
}

export interface SendBulkEmailInput {
  recipients: {
    enclosures?: string[];
    attendeeIds?: string[];
    all?: boolean;
  };
  subject: string;
  message: string;
  emailType: 'PROMOTIONAL' | 'INFORMATIONAL' | 'REMINDER' | 'ANNOUNCEMENT' | 'TICKET';
  sendAsHtml?: boolean;
}

export interface SendBulkEmailResult {
  success: number;
  failed: number;
  totalRecipients: number;
  recipients: EmailRecipient[];
  errors: Array<{
    email: string;
    error: string;
  }>;
}

export class EmailService {
  /**
   * Get attendees based on recipient criteria
   */
  static async getRecipients(
    criteria: SendBulkEmailInput['recipients']
  ): Promise<EmailRecipient[]> {
    try {
      let whereClause: any = {
        // Filter out empty emails
        email: {
          not: '',
        },
      };

      // If specific attendee IDs are provided
      if (criteria.attendeeIds && criteria.attendeeIds.length > 0) {
        whereClause.id = {
          in: criteria.attendeeIds,
        };
      }
      // If specific enclosures are selected
      else if (criteria.enclosures && criteria.enclosures.length > 0) {
        whereClause.assignedEnclosure = {
          in: criteria.enclosures,
        };
      }
      // Otherwise, if 'all' is not true, return empty
      else if (!criteria.all) {
        return [];
      }

      const attendees = await prisma.attendee.findMany({
        where: whereClause,
        select: {
          id: true,
          enrollmentId: true,
          name: true,
          email: true,
          assignedEnclosure: true,
        },
      });

      return attendees.map((attendee) => ({
        enrollmentId: attendee.enrollmentId,
        name: attendee.name,
        email: attendee.email,
        enclosure: attendee.assignedEnclosure || undefined,
      }));
    } catch (error) {
      logger.error('Error fetching email recipients:', error);
      throw new Error('Failed to fetch email recipients');
    }
  }

  /**
   * Send bulk emails to attendees
   */
  static async sendBulkEmail(input: SendBulkEmailInput): Promise<SendBulkEmailResult> {
    if (!SENDGRID_API_KEY) {
      throw new Error('Email service is not configured. Please set SENDGRID_API_KEY in environment variables.');
    }

    const recipients = await this.getRecipients(input.recipients);

    if (recipients.length === 0) {
      throw new Error('No recipients found matching the criteria');
    }

    logger.info(`Sending ${input.emailType} email to ${recipients.length} recipients`);
    logger.info(`From: ${SENDGRID_FROM_EMAIL} (${SENDGRID_FROM_NAME})`);
    logger.info(`Subject: ${input.subject}`);

    const errors: Array<{ email: string; error: string }> = [];
    let successCount = 0;
    let failedCount = 0;

    // Handle TICKET email type with auto-generated content
    if (input.emailType === 'TICKET') {
      return await this.sendTicketEmails(recipients);
    }

    // Prepare email content for other email types
    const emailContent = input.sendAsHtml 
      ? input.message 
      : input.message.replace(/\n/g, '<br>');

    const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .content {
      background: #f9f9f9;
      padding: 30px;
      border: 1px solid #e0e0e0;
      border-top: none;
    }
    .footer {
      background: #333;
      color: #999;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      border-radius: 0 0 8px 8px;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      font-size: 12px;
      margin-top: 10px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${SENDGRID_FROM_NAME}</h1>
    <div class="badge">${input.emailType}</div>
  </div>
  <div class="content">
    ${emailContent}
  </div>
  <div class="footer">
    <p>This is an automated message from ${SENDGRID_FROM_NAME}.</p>
    <p>Please do not reply to this email.</p>
  </div>
</body>
</html>
    `.trim();

    // Send emails in batches to avoid rate limiting
    const batchSize = 100;
    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);
      
      const messages = batch.map(recipient => ({
        to: recipient.email,
        from: {
          email: SENDGRID_FROM_EMAIL,
          name: SENDGRID_FROM_NAME
        },
        subject: input.subject,
        html: htmlTemplate,
        text: input.message, // Fallback plain text
        customArgs: {
          emailType: input.emailType,
          enrollmentId: recipient.enrollmentId,
          enclosure: recipient.enclosure || 'N/A'
        }
      }));

      try {
        await sgMail.send(messages);
        successCount += batch.length;
        logger.info(`Sent batch of ${batch.length} emails successfully`);
      } catch (error: any) {
        logger.error('Error sending email batch:', error);
        
        // Track individual failures
        batch.forEach(recipient => {
          errors.push({
            email: recipient.email,
            error: error.message || 'Failed to send email'
          });
        });
        failedCount += batch.length;
      }

      // Add a small delay between batches
      if (i + batchSize < recipients.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    logger.info(`Email sending complete: ${successCount} success, ${failedCount} failed`);

    return {
      success: successCount,
      failed: failedCount,
      totalRecipients: recipients.length,
      recipients,
      errors
    };
  }

  /**
   * Send a test email
   */
  static async sendTestEmail(toEmail: string, subject: string, message: string): Promise<void> {
    if (!SENDGRID_API_KEY) {
      throw new Error('Email service is not configured. Please set SENDGRID_API_KEY in environment variables.');
    }

    const msg = {
      to: toEmail,
      from: {
        email: SENDGRID_FROM_EMAIL,
        name: SENDGRID_FROM_NAME
      },
      subject: subject,
      text: message,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Test Email</h2>
          <p>${message.replace(/\n/g, '<br>')}</p>
          <hr>
          <p style="color: #999; font-size: 12px;">This is a test email from ${SENDGRID_FROM_NAME}</p>
        </div>
      `
    };

    try {
      await sgMail.send(msg);
      logger.info(`Test email sent to ${toEmail}`);
    } catch (error) {
      logger.error('Error sending test email:', error);
      throw error;
    }
  }

  /**
   * Validate email configuration
   */
  static isConfigured(): boolean {
    return !!SENDGRID_API_KEY && !!SENDGRID_FROM_EMAIL;
  }

  /**
   * Get email configuration status
   */
  static getConfigStatus() {
    return {
      configured: this.isConfigured(),
      fromEmail: SENDGRID_FROM_EMAIL,
      fromName: SENDGRID_FROM_NAME,
      hasApiKey: !!SENDGRID_API_KEY
    };
  }

  /**
   * Send ticket emails with auto-generated content and ticket information
   */
  static async sendTicketEmails(recipients: EmailRecipient[]): Promise<SendBulkEmailResult> {
    logger.info(`Sending TICKET emails to ${recipients.length} recipients with auto-generated content`);

    const errors: Array<{ email: string; error: string }> = [];
    let successCount = 0;
    let failedCount = 0;

    // Auto-generated subject and message for ticket emails
    const subject = '🎓 Your Convocation Ticket is Ready! - Parul University';
    
    // Process each recipient individually for personalized tickets
    for (const recipient of recipients) {
      try {
        // Fetch full attendee details including seat allocation
        const attendee = await prisma.attendee.findUnique({
          where: { enrollmentId: recipient.enrollmentId },
          include: {
            allocation: {
              include: {
                enclosure: true
              }
            }
          }
        });

        if (!attendee) {
          errors.push({
            email: recipient.email,
            error: 'Attendee not found'
          });
          failedCount++;
          continue;
        }

        // Check if seat is allocated
        if (!attendee.allocation) {
          errors.push({
            email: recipient.email,
            error: 'No seat allocation found. Please contact admin.'
          });
          failedCount++;
          continue;
        }

        // Generate QR code as base64 data URL (embedded in email)
        let qrCodeDataUrl = '';
        if (attendee.verificationToken) {
          try {
            logger.info(`Generating QR code for token: ${attendee.verificationToken.substring(0, 10)}...`);
            qrCodeDataUrl = await QRCode.toDataURL(attendee.verificationToken, {
              width: 300,
              margin: 2,
              color: {
                dark: '#000000',
                light: '#FFFFFF'
              },
              errorCorrectionLevel: 'M'
            });
            logger.info(`QR code generated successfully. Data URL length: ${qrCodeDataUrl.length}`);
            
            // Verify the data URL format
            if (!qrCodeDataUrl.startsWith('data:image/png;base64,')) {
              logger.error('Invalid QR code data URL format');
              qrCodeDataUrl = '';
            }
          } catch (qrError) {
            logger.error(`Error generating QR code for ${recipient.email}:`, qrError);
            qrCodeDataUrl = '';
          }
        } else {
          logger.warn(`No verification token found for ${recipient.email}`);
        }

        if (!qrCodeDataUrl) {
          errors.push({
            email: recipient.email,
            error: 'Failed to generate QR code. No verification token or QR generation failed.'
          });
          failedCount++;
          continue;
        }

        // Generate personalized message with mobile-responsive design
        const personalizedMessage = `
          <p style="font-size: 16px; color: #333; line-height: 1.6; margin-bottom: 20px;">
            Dear <strong>${attendee.name}</strong>,
          </p>
          
          <p style="font-size: 15px; color: #555; line-height: 1.7; margin-bottom: 15px;">
            Congratulations! 🎉 We are delighted to inform you that your convocation ticket has been generated and is ready for use.
          </p>

          <p style="font-size: 15px; color: #555; line-height: 1.7; margin-bottom: 20px;">
            This is a momentous occasion, marking the culmination of your hard work and dedication. We are honored to celebrate this achievement with you.
          </p>

          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="margin: 0 0 15px 0; font-size: 18px; text-align: center;">📋 Your Seat Details</h3>
            <table style="width: 100%; color: white; font-size: 15px; border-spacing: 0;">
              <tr>
                <td style="padding: 10px 5px; border-bottom: 1px solid rgba(255,255,255,0.2);"><strong>Enclosure:</strong></td>
                <td style="padding: 10px 5px; border-bottom: 1px solid rgba(255,255,255,0.2); text-align: right;">${attendee.allocation.enclosureLetter} ${attendee.allocation.enclosure.name ? `(${attendee.allocation.enclosure.name})` : ''}</td>
              </tr>
              <tr>
                <td style="padding: 10px 5px; border-bottom: 1px solid rgba(255,255,255,0.2);"><strong>Row:</strong></td>
                <td style="padding: 10px 5px; border-bottom: 1px solid rgba(255,255,255,0.2); text-align: right;">${attendee.allocation.rowLetter}</td>
              </tr>
              <tr>
                <td style="padding: 10px 5px; border-bottom: 1px solid rgba(255,255,255,0.2);"><strong>Seat Number:</strong></td>
                <td style="padding: 10px 5px; border-bottom: 1px solid rgba(255,255,255,0.2); text-align: right;">${attendee.allocation.seatNumber}</td>
              </tr>
              <tr>
                <td style="padding: 10px 5px;"><strong>Entry Direction:</strong></td>
                <td style="padding: 10px 5px; text-align: right;">${attendee.allocation.enclosure.entryDirection}</td>
              </tr>
            </table>
          </div>

          <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 6px;">
            <h4 style="margin: 0 0 10px 0; color: #856404; font-size: 15px;">📌 Important Instructions</h4>
            <ul style="margin: 5px 0; padding-left: 20px; color: #856404; font-size: 14px; line-height: 1.6;">
              <li style="margin-bottom: 8px;">Show this QR code at the entrance for attendance confirmation</li>
              <li style="margin-bottom: 8px;">Arrive at least 30 minutes before the ceremony begins</li>
              <li style="margin-bottom: 8px;">Proceed to your assigned enclosure and locate your seat</li>
              <li style="margin-bottom: 8px;">Formal attire is required for the ceremony</li>
            </ul>
          </div>

          <p style="font-size: 15px; color: #555; line-height: 1.7; margin-top: 25px;">
            We wish you all the best for your future endeavors. This is just the beginning of an exciting journey ahead!
          </p>

          <p style="font-size: 15px; color: #555; line-height: 1.7;">
            Warm regards,<br/>
            <strong>Parul University<br/>
            Convocation Team</strong>
          </p>
        `;

        const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <style>
    /* Base Styles */
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f8f9fa;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    
    /* Container */
    .email-wrapper {
      width: 100%;
      background-color: #f8f9fa;
      padding: 20px 0;
    }
    
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    /* Header */
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px 20px;
      text-align: center;
    }
    
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
    }
    
    .header p {
      margin: 8px 0 0 0;
      font-size: 15px;
      opacity: 0.95;
    }
    
    .badge {
      display: inline-block;
      padding: 6px 14px;
      background: rgba(255, 255, 255, 0.25);
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      margin-top: 10px;
      letter-spacing: 0.5px;
    }
    
    /* Content */
    .content {
      padding: 25px 20px;
    }
    
    /* Footer */
    .footer {
      background: #2c3e50;
      color: #95a5a6;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      line-height: 1.6;
    }
    
    .footer p {
      margin: 5px 0;
    }
    
    /* Mobile Responsive */
    @media only screen and (max-width: 600px) {
      .email-wrapper {
        padding: 10px 0;
      }
      
      .email-container {
        border-radius: 0;
        margin: 0;
      }
      
      .header {
        padding: 25px 15px;
      }
      
      .header h1 {
        font-size: 20px;
      }
      
      .content {
        padding: 20px 15px;
      }
      
      .footer {
        padding: 15px;
      }
    }
    
    /* High DPI Displays */
    @media only screen and (-webkit-min-device-pixel-ratio: 2),
           only screen and (min-resolution: 192dpi) {
      .email-container {
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-container">
      <div class="header">
        <h1>🎓 ${SENDGRID_FROM_NAME}</h1>
        <p>Convocation Ceremony</p>
        <div class="badge">YOUR TICKET IS READY</div>
      </div>
      <div class="content">
        ${personalizedMessage}
      </div>
      <div class="footer">
        <p><strong>Parul University Convocation Team</strong></p>
        <p>This is an automated message. Please do not reply to this email.</p>
        <p>For any queries, please contact the convocation helpdesk.</p>
      </div>
    </div>
  </div>
</body>
</html>
        `.trim();

        // Extract base64 data from data URL
        const base64Data = qrCodeDataUrl.replace(/^data:image\/png;base64,/, '');

        const msg = {
          to: recipient.email,
          from: {
            email: SENDGRID_FROM_EMAIL,
            name: SENDGRID_FROM_NAME
          },
          subject: subject,
          html: htmlTemplate,
          text: `Dear ${attendee.name},\n\nYour convocation ticket is ready!\n\nSeat Details:\nEnclosure: ${attendee.allocation.enclosureLetter}\nRow: ${attendee.allocation.rowLetter}\nSeat: ${attendee.allocation.seatNumber}\n\nPlease arrive 30 minutes early and show your QR code at the entrance.\n\nBest regards,\nParul University Convocation Team`,
          attachments: [
            {
              content: base64Data,
              filename: 'qrcode.png',
              type: 'image/png',
              disposition: 'inline',
              content_id: 'qrcode'
            }
          ],
          customArgs: {
            emailType: 'TICKET',
            enrollmentId: recipient.enrollmentId,
            enclosure: attendee.allocation.enclosureLetter
          }
        };

        await sgMail.send(msg);
        successCount++;
        logger.info(`Ticket email sent to ${recipient.name} <${recipient.email}>`);

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error: any) {
        logger.error(`Error sending ticket email to ${recipient.email}:`, error);
        errors.push({
          email: recipient.email,
          error: error.message || 'Failed to send ticket email'
        });
        failedCount++;
      }
    }

    logger.info(`Ticket email sending complete: ${successCount} success, ${failedCount} failed`);

    return {
      success: successCount,
      failed: failedCount,
      totalRecipients: recipients.length,
      recipients,
      errors
    };
  }
}


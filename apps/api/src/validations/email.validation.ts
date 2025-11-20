import { z } from 'zod';

// Email type enum
const EmailTypeEnum = z.enum([
  'PROMOTIONAL',
  'INFORMATIONAL',
  'REMINDER',
  'ANNOUNCEMENT',
  'TICKET'
]);

// Common MongoDB ObjectId validation
const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId format');

// Send bulk email validation
export const sendBulkEmailSchema = z.object({
  body: z.object({
    recipients: z.object({
      enclosures: z
        .array(z.string().min(1, 'Enclosure letter cannot be empty'))
        .optional(),
      attendeeIds: z
        .array(objectIdSchema)
        .optional(),
      all: z
        .boolean()
        .optional()
    }).refine(
      data => {
        // At least one criterion must be provided
        return data.enclosures?.length || data.attendeeIds?.length || data.all;
      },
      {
        message: 'At least one recipient criterion must be provided (enclosures, attendeeIds, or all)'
      }
    ),
    subject: z
      .string()
      .min(1, 'Subject is required')
      .max(200, 'Subject must not exceed 200 characters')
      .trim()
      .optional(), // Optional for TICKET type
    message: z
      .string()
      .min(10, 'Message must be at least 10 characters')
      .max(10000, 'Message must not exceed 10,000 characters')
      .trim()
      .optional(), // Optional for TICKET type
    emailType: EmailTypeEnum,
    sendAsHtml: z
      .boolean()
      .optional()
      .default(false)
  }).refine(
    data => {
      // For non-TICKET types, subject and message are required
      if (data.emailType !== 'TICKET') {
        return !!(data.subject && data.message);
      }
      return true;
    },
    {
      message: 'Subject and message are required for non-ticket emails'
    }
  )
});

// Send test email validation
export const sendTestEmailSchema = z.object({
  body: z.object({
    toEmail: z
      .string()
      .email('Invalid email format')
      .toLowerCase()
      .trim(),
    subject: z
      .string()
      .min(1, 'Subject is required')
      .max(200, 'Subject must not exceed 200 characters')
      .trim(),
    message: z
      .string()
      .min(10, 'Message must be at least 10 characters')
      .max(5000, 'Message must not exceed 5,000 characters')
      .trim()
  })
});

// Get recipients preview validation (without sending)
export const getRecipientsPreviewSchema = z.object({
  body: z.object({
    recipients: z.object({
      enclosures: z
        .array(z.string().min(1, 'Enclosure letter cannot be empty'))
        .optional(),
      attendeeIds: z
        .array(objectIdSchema)
        .optional(),
      all: z
        .boolean()
        .optional()
    }).refine(
      data => {
        return data.enclosures?.length || data.attendeeIds?.length || data.all;
      },
      {
        message: 'At least one recipient criterion must be provided'
      }
    )
  })
});

import type { Request, Response } from 'express';
import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { EmailService } from '../services/email.service.js';
import { logger } from '../utils/logger.js';
import {
    getRecipientsPreviewSchema,
    sendBulkEmailSchema,
    sendTestEmailSchema
} from '../validations/email.validation.js';

const router = Router();

/**
 * @route   GET /api/v1/emails/config
 * @desc    Get email configuration status
 * @access  Admin only
 */
router.get(
  '/config',
  authenticate,
  authorize('ADMIN'),
  async (req: Request, res: Response) => {
    try {
      const config = EmailService.getConfigStatus();
      
      res.status(200).json({
        success: true,
        data: config
      });
    } catch (error) {
      logger.error('Error fetching email config:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch email configuration'
      });
    }
  }
);

/**
 * @route   POST /api/v1/emails/preview-recipients
 * @desc    Preview recipients without sending email
 * @access  Admin only
 */
router.post(
  '/preview-recipients',
  authenticate,
  authorize('ADMIN'),
  validate(getRecipientsPreviewSchema),
  async (req: Request, res: Response) => {
    try {
      const { recipients } = req.body;

      const recipientList = await EmailService.getRecipients(recipients);

      res.status(200).json({
        success: true,
        data: {
          totalRecipients: recipientList.length,
          recipients: recipientList
        }
      });
    } catch (error) {
      logger.error('Error previewing recipients:', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to preview recipients'
      });
    }
  }
);

/**
 * @route   POST /api/v1/emails/send-bulk
 * @desc    Send bulk email to attendees
 * @access  Admin only
 */
router.post(
  '/send-bulk',
  authenticate,
  authorize('ADMIN'),
  validate(sendBulkEmailSchema),
  async (req: Request, res: Response) => {
    try {
      const emailData = req.body;

      logger.info(`Admin ${req.user?.email} is sending bulk ${emailData.emailType} email`);

      const result = await EmailService.sendBulkEmail(emailData);

      res.status(200).json({
        success: true,
        data: result,
        message: `Email sent successfully to ${result.success} recipients${result.failed > 0 ? `, ${result.failed} failed` : ''}`
      });
    } catch (error) {
      logger.error('Error sending bulk email:', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to send bulk email'
      });
    }
  }
);

/**
 * @route   POST /api/v1/emails/send-test
 * @desc    Send a test email
 * @access  Admin only
 */
router.post(
  '/send-test',
  authenticate,
  authorize('ADMIN'),
  validate(sendTestEmailSchema),
  async (req: Request, res: Response) => {
    try {
      const { toEmail, subject, message } = req.body;

      await EmailService.sendTestEmail(toEmail, subject, message);

      res.status(200).json({
        success: true,
        message: `Test email sent successfully to ${toEmail}`
      });
    } catch (error) {
      logger.error('Error sending test email:', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to send test email'
      });
    }
  }
);

export default router;

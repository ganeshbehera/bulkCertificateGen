const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Create email transporter
const createTransporter = (emailConfig) => {
  return nodemailer.createTransporter({
    service: emailConfig.service || 'gmail',
    auth: {
      user: emailConfig.user,
      pass: emailConfig.password
    }
  });
};

// Send bulk emails with certificates
router.post('/send-bulk', async (req, res) => {
  try {
    const { recipients, emailConfig, emailTemplate } = req.body;

    if (!recipients || !Array.isArray(recipients)) {
      return res.status(400).json({ error: 'No recipients provided' });
    }

    if (!emailConfig || !emailConfig.user || !emailConfig.password) {
      return res.status(400).json({ error: 'Email configuration missing' });
    }

    const transporter = createTransporter(emailConfig);
    const results = [];

    // Verify transporter configuration
    try {
      await transporter.verify();
    } catch (error) {
      return res.status(400).json({ 
        error: 'Email configuration invalid',
        details: error.message
      });
    }

    for (const recipient of recipients) {
      try {
        if (!recipient.certificatePath || !fs.existsSync(recipient.certificatePath)) {
          results.push({
            email: recipient.email,
            status: 'error',
            error: 'Certificate file not found'
          });
          continue;
        }

        const mailOptions = {
          from: emailConfig.user,
          to: recipient.email,
          subject: emailTemplate.subject || 'Your Certificate',
          html: generateEmailHTML(recipient, emailTemplate),
          attachments: [
            {
              filename: `certificate_${recipient.name.replace(/\s+/g, '_')}.png`,
              path: recipient.certificatePath
            }
          ]
        };

        await transporter.sendMail(mailOptions);
        
        results.push({
          email: recipient.email,
          name: recipient.name,
          status: 'success'
        });

      } catch (error) {
        console.error(`Error sending email to ${recipient.email}:`, error);
        results.push({
          email: recipient.email,
          name: recipient.name,
          status: 'error',
          error: error.message
        });
      }
    }

    res.json({
      success: true,
      results,
      totalSent: results.filter(r => r.status === 'success').length,
      totalFailed: results.filter(r => r.status === 'error').length
    });

  } catch (error) {
    console.error('Error sending bulk emails:', error);
    res.status(500).json({ error: 'Failed to send emails' });
  }
});

// Test email configuration
router.post('/test-config', async (req, res) => {
  try {
    const { emailConfig } = req.body;

    if (!emailConfig || !emailConfig.user || !emailConfig.password) {
      return res.status(400).json({ error: 'Email configuration missing' });
    }

    const transporter = createTransporter(emailConfig);
    
    await transporter.verify();
    
    // Send test email
    const testMailOptions = {
      from: emailConfig.user,
      to: emailConfig.user,
      subject: 'Certificate Generator - Test Email',
      html: `
        <h2>Email Configuration Test</h2>
        <p>This is a test email to verify your email configuration is working correctly.</p>
        <p>If you receive this email, your configuration is valid and ready to use.</p>
        <p>Timestamp: ${new Date().toISOString()}</p>
      `
    };

    await transporter.sendMail(testMailOptions);

    res.json({ 
      success: true, 
      message: 'Email configuration is valid. Test email sent successfully.' 
    });

  } catch (error) {
    console.error('Email configuration test failed:', error);
    res.status(400).json({ 
      error: 'Email configuration test failed',
      details: error.message
    });
  }
});

// Generate email HTML template
function generateEmailHTML(recipient, template) {
  const defaultTemplate = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #333; text-align: center;">Congratulations, {{name}}!</h2>
      <p style="font-size: 16px; line-height: 1.6; color: #555;">
        We are pleased to present you with your certificate. Please find it attached to this email.
      </p>
      <p style="font-size: 16px; line-height: 1.6; color: #555;">
        Thank you for your participation and dedication.
      </p>
      <div style="text-align: center; margin-top: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 5px;">
        <p style="margin: 0; color: #666; font-size: 14px;">
          This is an automated email. Please do not reply to this message.
        </p>
      </div>
    </div>
  `;

  const emailHTML = template.body || defaultTemplate;
  
  // Replace placeholders
  return emailHTML
    .replace(/{{name}}/g, recipient.name)
    .replace(/{{email}}/g, recipient.email)
    .replace(/{{course}}/g, recipient.course || '')
    .replace(/{{date}}/g, recipient.date || new Date().toLocaleDateString());
}

module.exports = router;

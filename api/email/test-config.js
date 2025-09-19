const nodemailer = require('nodemailer');

// Brevo SMTP configuration helper
function createBrevoTransporter(apiKey, fromEmail) {
  return nodemailer.createTransporter({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false, // Use STARTTLS
    auth: {
      user: fromEmail, // Your verified sender email
      pass: apiKey    // Your Brevo SMTP API key
    },
    tls: {
      ciphers: 'SSLv3'
    }
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { emailConfig, testEmail } = req.body;

    if (!emailConfig) {
      return res.status(400).json({ error: 'Email configuration is required' });
    }

    if (!testEmail) {
      return res.status(400).json({ error: 'Test email address is required' });
    }

    let transporter;

    // Check if using Brevo configuration
    if (emailConfig.provider === 'brevo' && emailConfig.brevo) {
      if (!emailConfig.brevo.apiKey || !emailConfig.brevo.fromEmail) {
        return res.status(400).json({ 
          error: 'Brevo API key and from email are required' 
        });
      }
      
      transporter = createBrevoTransporter(
        emailConfig.brevo.apiKey, 
        emailConfig.brevo.fromEmail
      );
    } else if (emailConfig.smtp) {
      // Fallback to custom SMTP configuration
      transporter = nodemailer.createTransporter({
        host: emailConfig.smtp.host,
        port: emailConfig.smtp.port,
        secure: emailConfig.smtp.secure,
        auth: {
          user: emailConfig.smtp.user,
          pass: emailConfig.smtp.pass
        }
      });
    } else {
      return res.status(400).json({ 
        error: 'Either Brevo configuration or SMTP configuration is required' 
      });
    }

    // Test connection
    try {
      await transporter.verify();
    } catch (verifyError) {
      return res.status(400).json({
        success: false,
        error: 'SMTP connection failed',
        details: verifyError.message
      });
    }

    // Send test email
    try {
      const fromEmail = emailConfig.provider === 'brevo' 
        ? emailConfig.brevo.fromEmail 
        : emailConfig.from;

      const mailOptions = {
        from: fromEmail,
        to: testEmail,
        subject: 'Certificate Generator - Email Configuration Test',
        html: `
          <h2>Email Configuration Test Successful!</h2>
          <p>This is a test email to verify your email configuration.</p>
          <p><strong>Provider:</strong> ${emailConfig.provider === 'brevo' ? 'Brevo SMTP' : 'Custom SMTP'}</p>
          <p><strong>From:</strong> ${fromEmail}</p>
          <p><strong>Test Time:</strong> ${new Date().toISOString()}</p>
          <br>
          <p>Your certificate generator is ready to send emails!</p>
          <p>Best regards,<br>Certificate Generator Team</p>
        `
      };

      await transporter.sendMail(mailOptions);

      res.status(200).json({
        success: true,
        message: 'Email configuration test successful',
        provider: emailConfig.provider === 'brevo' ? 'Brevo SMTP' : 'Custom SMTP',
        testEmail: testEmail,
        timestamp: new Date().toISOString()
      });
    } catch (sendError) {
      res.status(400).json({
        success: false,
        error: 'Failed to send test email',
        details: sendError.message
      });
    }
  } catch (error) {
    console.error('Error testing email configuration:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
}

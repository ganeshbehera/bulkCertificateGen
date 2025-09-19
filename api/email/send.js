const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

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
    const { recipients, emailConfig, certificates } = req.body;

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({ error: 'Recipients array is required' });
    }

    if (!emailConfig) {
      return res.status(400).json({ error: 'Email configuration is required' });
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

    // Verify connection
    await transporter.verify();

    const results = [];
    
    for (const recipient of recipients) {
      try {
        // Find corresponding certificate
        const certificate = certificates.find(cert => 
          cert.name.toLowerCase() === recipient.name.toLowerCase()
        );

        if (!certificate) {
          results.push({
            recipient: recipient.name,
            status: 'failed',
            error: 'Certificate not found'
          });
          continue;
        }

        const certificatePath = path.join(process.cwd(), 'server', 'certificates', certificate.filename);
        
        if (!fs.existsSync(certificatePath)) {
          results.push({
            recipient: recipient.name,
            status: 'failed',
            error: 'Certificate file not found'
          });
          continue;
        }

        // Send email
        const fromEmail = emailConfig.provider === 'brevo' 
          ? emailConfig.brevo.fromEmail 
          : emailConfig.from;
          
        const mailOptions = {
          from: fromEmail,
          to: recipient.email,
          subject: emailConfig.subject || 'Your Certificate of Completion',
          html: `
            <h2>Congratulations ${recipient.name}!</h2>
            <p>Please find your certificate of completion attached.</p>
            <p>Thank you for participating in our program.</p>
            <br>
            <p>Best regards,<br>The Training Team</p>
          `,
          attachments: [
            {
              filename: certificate.filename,
              path: certificatePath
            }
          ]
        };

        await transporter.sendMail(mailOptions);
        
        results.push({
          recipient: recipient.name,
          email: recipient.email,
          status: 'sent'
        });
      } catch (emailError) {
        console.error(`Error sending email to ${recipient.name}:`, emailError);
        results.push({
          recipient: recipient.name,
          status: 'failed',
          error: emailError.message
        });
      }
    }

    const successful = results.filter(r => r.status === 'sent').length;
    const failed = results.filter(r => r.status === 'failed').length;

    res.status(200).json({
      message: 'Email sending completed',
      summary: {
        total: recipients.length,
        successful,
        failed
      },
      results
    });
  } catch (error) {
    console.error('Error sending emails:', error);
    res.status(500).json({ error: 'Failed to send emails' });
  }
}

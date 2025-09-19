const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { recipients, emailConfig, certificates } = req.body;

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({ error: 'Recipients array is required' });
    }

    if (!emailConfig || !emailConfig.smtp) {
      return res.status(400).json({ error: 'Email configuration is required' });
    }

    // Create transporter
    const transporter = nodemailer.createTransporter({
      host: emailConfig.smtp.host,
      port: emailConfig.smtp.port,
      secure: emailConfig.smtp.secure,
      auth: {
        user: emailConfig.smtp.user,
        pass: emailConfig.smtp.pass
      }
    });

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
        const mailOptions = {
          from: emailConfig.from,
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

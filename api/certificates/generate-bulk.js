const { generateCertificate } = require('../../server/utils/certificateGenerator');
const path = require('path');
const fs = require('fs');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { recipients, config } = req.body;

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({ error: 'Recipients array is required' });
    }

    console.log(`Generating certificates for ${recipients.length} recipients`);

    const results = [];
    let successCount = 0;
    let failureCount = 0;

    // Generate certificates for all recipients
    for (let i = 0; i < recipients.length; i++) {
      const recipient = recipients[i];
      
      try {
        console.log(`Generating certificate ${i + 1}/${recipients.length} for ${recipient.name}`);
        
        const certificatePath = await generateCertificate(recipient, config);
        const filename = path.basename(certificatePath);
        
        results.push({
          name: recipient.name,
          email: recipient.email,
          status: 'success',
          filename: filename,
          downloadUrl: `/certificates/${filename}`,
          path: certificatePath
        });
        
        successCount++;
        
      } catch (error) {
        console.error(`Error generating certificate for ${recipient.name}:`, error);
        
        results.push({
          name: recipient.name,
          email: recipient.email,
          status: 'failed',
          error: error.message
        });
        
        failureCount++;
      }
    }

    console.log(`Certificate generation completed: ${successCount} success, ${failureCount} failed`);

    res.status(200).json({
      success: true,
      message: 'Certificate generation completed',
      results: results,
      summary: {
        total: recipients.length,
        successful: successCount,
        failed: failureCount
      },
      totalGenerated: successCount
    });

  } catch (error) {
    console.error('Error in bulk certificate generation:', error);
    res.status(500).json({ 
      error: 'Failed to generate certificates', 
      details: error.message 
    });
  }
}

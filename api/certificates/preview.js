const { generatePreviewCertificate } = require('../../server/utils/certificateGenerator');
const path = require('path');
const fs = require('fs');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('Preview certificate request received');
  console.log('Environment:', {
    VERCEL: process.env.VERCEL,
    NODE_ENV: process.env.NODE_ENV,
    platform: process.platform
  });

  try {
    const { config } = req.body;
    console.log('Config received:', config);

    console.log('Starting certificate generation...');
    const previewPath = await generatePreviewCertificate(config);
    console.log('Certificate generated at:', previewPath);

    // Check if file exists
    if (!fs.existsSync(previewPath)) {
      throw new Error(`Generated certificate file not found at: ${previewPath}`);
    }

    // Read the file and send it
    const fileBuffer = fs.readFileSync(previewPath);
    console.log('File read successfully, size:', fileBuffer.length);
    
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Length', fileBuffer.length);
    res.status(200).send(fileBuffer);

    // Clean up the preview file after sending
    setTimeout(() => {
      try {
        if (fs.existsSync(previewPath)) {
          fs.unlinkSync(previewPath);
          console.log('Preview file cleaned up');
        }
      } catch (cleanupErr) {
        console.error('Error cleaning up preview file:', cleanupErr);
      }
    }, 5000);

  } catch (error) {
    console.error('Error generating preview certificate:', error);
    console.error('Error stack:', error.stack);
    
    // If Puppeteer fails, try to return a simple HTML preview
    if (error.message.includes('Failed to launch the browser process') || 
        error.message.includes('libnss3.so') || 
        error.message.includes('chrome') || 
        error.message.includes('chromium')) {
      
      console.log('Puppeteer failed, redirecting to simple HTML preview');
      
      // Redirect to simple HTML preview
      return res.redirect('/api/certificates/preview-simple');
    }
    
    res.status(500).json({ 
      error: 'Failed to generate preview certificate',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      suggestion: 'Try using the simple preview at /api/certificates/preview-simple'
    });
  }
}

const { generatePreviewCertificate } = require('../../server/utils/certificateGenerator');
const path = require('path');
const fs = require('fs');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { config } = req.body;
    const previewPath = await generatePreviewCertificate(config);

    // Read the file and send it
    const fileBuffer = fs.readFileSync(previewPath);
    
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Length', fileBuffer.length);
    res.status(200).send(fileBuffer);

    // Clean up the preview file after sending
    setTimeout(() => {
      try {
        fs.unlinkSync(previewPath);
      } catch (cleanupErr) {
        console.error('Error cleaning up preview file:', cleanupErr);
      }
    }, 5000);
  } catch (error) {
    console.error('Error generating preview certificate:', error);
    res.status(500).json({ error: 'Failed to generate preview certificate' });
  }
}

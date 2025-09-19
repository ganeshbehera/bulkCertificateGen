const fs = require('fs');
const path = require('path');

export default function handler(req, res) {
  const { filename } = req.query;

  if (!filename) {
    return res.status(400).json({ error: 'Filename is required' });
  }

  try {
    // Try multiple possible certificate locations
    const possiblePaths = [
      path.join(process.cwd(), 'server', 'certificates', filename),
      path.join('/tmp', 'certificates', filename),
      path.join(process.cwd(), 'certificates', filename)
    ];

    let certificatePath = null;
    
    for (const possiblePath of possiblePaths) {
      if (fs.existsSync(possiblePath)) {
        certificatePath = possiblePath;
        break;
      }
    }

    if (!certificatePath) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    // Read and send the certificate file
    const fileBuffer = fs.readFileSync(certificatePath);
    
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', fileBuffer.length);
    
    res.status(200).send(fileBuffer);

  } catch (error) {
    console.error('Error serving certificate:', error);
    res.status(500).json({ error: 'Failed to serve certificate' });
  }
}

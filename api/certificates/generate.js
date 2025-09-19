const multer = require('multer');
const XLSX = require('xlsx');
const { generateCertificate } = require('../../server/utils/certificateGenerator');
const path = require('path');
const fs = require('fs');

// Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Handle file upload
    upload.single('file')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: 'File upload failed' });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      try {
        // Parse Excel file
        const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);

        if (data.length === 0) {
          return res.status(400).json({ error: 'Excel file is empty' });
        }

        // Generate certificates for all recipients
        const certificates = [];
        const { config } = req.body;

        for (const recipient of data) {
          const certificatePath = await generateCertificate(recipient, config);
          certificates.push({
            name: recipient.name,
            path: certificatePath,
            filename: path.basename(certificatePath)
          });
        }

        res.status(200).json({
          message: 'Certificates generated successfully',
          count: certificates.length,
          certificates: certificates.map(cert => ({
            name: cert.name,
            filename: cert.filename,
            downloadUrl: `/certificates/${cert.filename}`
          }))
        });
      } catch (parseError) {
        console.error('Error processing Excel file:', parseError);
        res.status(400).json({ error: 'Invalid Excel file format' });
      }
    });
  } catch (error) {
    console.error('Error generating certificates:', error);
    res.status(500).json({ error: 'Failed to generate certificates' });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};

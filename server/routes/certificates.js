const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
const { generateCertificate, generatePreviewCertificate } = require('../utils/certificateGenerator');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only Excel and CSV files are allowed.'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Parse Excel file and extract recipient data
router.post('/parse-excel', upload.single('excelFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    // Validate required columns
    const requiredColumns = ['name', 'email'];
    const columns = Object.keys(data[0] || {});
    const missingColumns = requiredColumns.filter(col => 
      !columns.some(c => c.toLowerCase().includes(col.toLowerCase()))
    );

    if (missingColumns.length > 0) {
      return res.status(400).json({ 
        error: `Missing required columns: ${missingColumns.join(', ')}`,
        availableColumns: columns
      });
    }

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      data: data.slice(0, 100), // Limit to 100 records for demo
      totalRecords: data.length,
      columns
    });
  } catch (error) {
    console.error('Error parsing Excel file:', error);
    res.status(500).json({ error: 'Failed to parse Excel file' });
  }
});

// Generate certificates for all recipients
router.post('/generate-bulk', async (req, res) => {
  try {
    const { recipients, certificateConfig } = req.body;

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({ error: 'No recipients provided' });
    }

    const results = [];
    const certificatesDir = path.join(__dirname, '../certificates');
    
    if (!fs.existsSync(certificatesDir)) {
      fs.mkdirSync(certificatesDir, { recursive: true });
    }

    for (const recipient of recipients) {
      try {
        const certificatePath = await generateCertificate(recipient, certificateConfig);
        results.push({
          name: recipient.name,
          email: recipient.email,
          certificatePath,
          status: 'success'
        });
      } catch (error) {
        console.error(`Error generating certificate for ${recipient.name}:`, error);
        results.push({
          name: recipient.name,
          email: recipient.email,
          status: 'error',
          error: error.message
        });
      }
    }

    res.json({
      success: true,
      results,
      totalGenerated: results.filter(r => r.status === 'success').length,
      totalFailed: results.filter(r => r.status === 'error').length
    });
  } catch (error) {
    console.error('Error generating certificates:', error);
    res.status(500).json({ error: 'Failed to generate certificates' });
  }
});

// Generate preview certificate
router.post('/preview', async (req, res) => {
  try {
    const { config } = req.body;
    const previewPath = await generatePreviewCertificate(config);
    
    // Send the file
    res.sendFile(path.resolve(previewPath), (err) => {
      if (err) {
        console.error('Error sending preview certificate:', err);
        res.status(500).json({ error: 'Failed to generate preview' });
      } else {
        // Clean up the preview file after sending
        setTimeout(() => {
          try {
            fs.unlinkSync(previewPath);
          } catch (cleanupErr) {
            console.error('Error cleaning up preview file:', cleanupErr);
          }
        }, 5000);
      }
    });
  } catch (error) {
    console.error('Error generating preview certificate:', error);
    res.status(500).json({ error: 'Failed to generate preview certificate' });
  }
});

// Get sample Excel template
router.get('/sample-template', (req, res) => {
  try {
    const sampleData = [
      { name: 'Ravi Verma', email: 'ravi@example.com', course: 'AI Prompt Engineering Masterclass', date: '20 Sep, 2025' },
      { name: 'Priya Sharma', email: 'priya@example.com', course: 'Machine Learning Fundamentals', date: '20 Sep, 2025' },
      { name: 'Arjun Patel', email: 'arjun@example.com', course: 'Data Science Workshop', date: '20 Sep, 2025' }
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Recipients');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="certificate_template.xlsx"');
    res.send(buffer);
  } catch (error) {
    console.error('Error generating sample template:', error);
    res.status(500).json({ error: 'Failed to generate sample template' });
  }
});

module.exports = router;

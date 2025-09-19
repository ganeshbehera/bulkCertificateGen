const multer = require('multer');
const XLSX = require('xlsx');

// Configure multer for memory storage (serverless compatible)
const upload = multer({ storage: multer.memoryStorage() });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Handle file upload using multer
    upload.single('excelFile')(req, res, async (err) => {
      if (err) {
        console.error('Multer error:', err);
        return res.status(400).json({ error: 'File upload failed', details: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      try {
        console.log('Processing file:', req.file.originalname, 'Size:', req.file.size);
        
        // Parse Excel file from buffer
        const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        
        if (!sheetName) {
          return res.status(400).json({ error: 'Excel file has no sheets' });
        }
        
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);

        console.log('Parsed data:', data.length, 'rows');

        if (data.length === 0) {
          return res.status(400).json({ error: 'Excel file is empty or has no valid data' });
        }

        // Validate required columns
        const requiredColumns = ['name', 'email'];
        const firstRow = data[0];
        const missingColumns = requiredColumns.filter(col => !(col in firstRow));
        
        if (missingColumns.length > 0) {
          return res.status(400).json({ 
            error: `Missing required columns: ${missingColumns.join(', ')}`,
            hint: 'Excel file must have columns: name, email (course and date are optional)'
          });
        }

        // Process and validate data
        const processedData = data.map((row, index) => {
          const recipient = {
            name: row.name?.toString().trim() || '',
            email: row.email?.toString().trim() || '',
            course: row.course?.toString().trim() || 'AI Prompt Engineering Masterclass',
            date: row.date?.toString().trim() || new Date().toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })
          };

          // Validate email format
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(recipient.email)) {
            throw new Error(`Invalid email format at row ${index + 2}: ${recipient.email}`);
          }

          // Validate name
          if (!recipient.name) {
            throw new Error(`Missing name at row ${index + 2}`);
          }

          return recipient;
        });

        res.status(200).json({
          success: true,
          message: `Successfully parsed ${processedData.length} recipients`,
          data: processedData,
          summary: {
            totalRows: processedData.length,
            fileName: req.file.originalname,
            fileSize: req.file.size
          }
        });

      } catch (parseError) {
        console.error('Excel parsing error:', parseError);
        res.status(400).json({ 
          error: 'Failed to parse Excel file', 
          details: parseError.message,
          hint: 'Please ensure your Excel file has the correct format with name and email columns'
        });
      }
    });

  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message 
    });
  }
}

// Configure API route for file uploads
export const config = {
  api: {
    bodyParser: false, // Disable body parser to handle multipart/form-data
  },
};

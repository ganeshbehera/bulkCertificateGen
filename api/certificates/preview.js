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
    
    // If Puppeteer fails, return a simple HTML preview directly
    if (error.message.includes('Failed to launch the browser process') || 
        error.message.includes('libnss3.so') || 
        error.message.includes('chrome') || 
        error.message.includes('chromium')) {
      
      console.log('Puppeteer failed, returning simple HTML preview');
      
      // Generate SVG preview as fallback
      try {
        const recipientName = 'Ravi Verma';
        const courseName = 'AI Prompt Engineering Masterclass';
        const eventDate = '20 Sep, 2025';
        
        const svg = `
          <svg width="1400" height="900" xmlns="http://www.w3.org/2000/svg">
            <!-- White background -->
            <rect width="1400" height="900" fill="#ffffff"/>
            
            <!-- Main border -->
            <rect x="45" y="45" width="1310" height="810" fill="none" stroke="#C8860D" stroke-width="4"/>
            
            <!-- Inner border -->
            <rect x="55" y="55" width="1290" height="790" fill="none" stroke="#C8860D" stroke-width="2"/>
            
            <!-- Microsoft logo -->
            <g transform="translate(80, 80)">
              <rect x="0" y="0" width="20" height="20" fill="#00BCF2"/>
              <rect x="22" y="0" width="20" height="20" fill="#00A4EF"/>
              <rect x="0" y="22" width="20" height="20" fill="#FFB900"/>
              <rect x="22" y="22" width="20" height="20" fill="#F25022"/>
              <text x="55" y="28" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="#737373">Microsoft</text>
            </g>
            
            <!-- Reliance Digital logo -->
            <rect x="1220" y="70" width="180" height="80" fill="#E31E24"/>
            <text x="1310" y="95" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="white" text-anchor="middle">Reliance</text>
            <text x="1310" y="115" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="white" text-anchor="middle">digital</text>
            <text x="1310" y="135" font-family="Arial, sans-serif" font-size="10" fill="white" text-anchor="middle">PERSONALISING TECHNOLOGY</text>
            
            <!-- Main title -->
            <text x="700" y="220" font-family="Arial, sans-serif" font-size="42" font-weight="bold" fill="#2B5797" text-anchor="middle">CERTIFICATE OF</text>
            
            <!-- Completion -->
            <text x="700" y="300" font-family="Arial, sans-serif" font-size="84" font-weight="bold" fill="#E31E24" text-anchor="middle">COMPLETION</text>
            
            <!-- Certify text -->
            <text x="700" y="380" font-family="Arial, sans-serif" font-size="24" fill="#000000" text-anchor="middle">This is to certify that</text>
            
            <!-- Recipient name -->
            <text x="700" y="440" font-family="Arial, sans-serif" font-size="52" font-weight="bold" fill="#2B5797" text-anchor="middle">${recipientName}</text>
            
            <!-- Attended text -->
            <text x="700" y="490" font-family="Arial, sans-serif" font-size="22" fill="#000000" text-anchor="middle">has successfully attended</text>
            
            <!-- Course name -->
            <text x="700" y="540" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="#2B5797" text-anchor="middle">${courseName}</text>
            
            <!-- Event details -->
            <text x="700" y="580" font-family="Arial, sans-serif" font-size="20" fill="#000000" text-anchor="middle">held at Reliance Digital Store on ${eventDate}</text>
            
            <!-- Appreciation -->
            <text x="700" y="620" font-family="Arial, sans-serif" font-size="18" fill="#000000" text-anchor="middle">We appreciate your enthusiasm and commitment to learning</text>
            <text x="700" y="645" font-family="Arial, sans-serif" font-size="18" fill="#000000" text-anchor="middle">the future of AI technology.</text>
            
            <!-- Signature line -->
            <line x1="600" y1="720" x2="800" y2="720" stroke="#000000" stroke-width="1"/>
            
            <!-- Signature -->
            <text x="700" y="710" font-family="Arial, sans-serif" font-size="24" font-style="italic" fill="#000000" text-anchor="middle">Samuel Iyer</text>
            <text x="700" y="745" font-family="Arial, sans-serif" font-size="16" fill="#000000" text-anchor="middle">Samual Iyer</text>
            <text x="700" y="765" font-family="Arial, sans-serif" font-size="16" fill="#000000" text-anchor="middle">VP Relations, Reliance Digital</text>
            
            <!-- AI Badge -->
            <rect x="1260" y="800" width="100" height="60" fill="#E31E24"/>
            <text x="1310" y="820" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="white" text-anchor="middle">Certified by</text>
            <text x="1310" y="840" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="white" text-anchor="middle">AI SCHOOL</text>
            
            <!-- Preview note -->
            <rect x="0" y="870" width="1400" height="30" fill="rgba(255,255,255,0.9)"/>
            <text x="700" y="890" font-family="Arial, sans-serif" font-size="12" fill="#666" text-anchor="middle">Certificate Preview - Puppeteer fallback (SVG format)</text>
          </svg>
        `;
        
        res.setHeader('Content-Type', 'image/svg+xml');
        res.setHeader('Cache-Control', 'public, max-age=300');
        return res.status(200).send(svg);
      } catch (svgError) {
        console.error('SVG preview fallback failed:', svgError);
        // Continue to regular error response
      }
    }
    
    res.status(500).json({ 
      error: 'Failed to generate preview certificate',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      suggestion: 'Try using the simple preview at /api/certificates/preview-simple'
    });
  }
}

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Certificate dimensions - matching the original format
const CERTIFICATE_WIDTH = 1400;
const CERTIFICATE_HEIGHT = 900;

// Generate HTML template for certificate
function generateCertificateHTML(recipient, config = {}) {
  const recipientName = recipient.name || 'Ravi Verma';
  const courseName = recipient.course || 'AI Prompt Engineering Masterclass';
  const eventDate = recipient.date || '20 Sep, 2025';
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Certificate</title>
        <style>
            @page {
                size: ${CERTIFICATE_WIDTH}px ${CERTIFICATE_HEIGHT}px;
                margin: 0;
            }
            
            body {
                margin: 0;
                padding: 0;
                font-family: Arial, sans-serif;
                background: white;
                width: ${CERTIFICATE_WIDTH}px;
                height: ${CERTIFICATE_HEIGHT}px;
                position: relative;
                overflow: hidden;
            }
            
            .certificate {
                width: 100%;
                height: 100%;
                position: relative;
                background: white;
                box-sizing: border-box;
            }
            
            .border {
                position: absolute;
                top: 45px;
                left: 45px;
                right: 45px;
                bottom: 45px;
                border: 4px solid #C8860D;
            }
            
            .inner-border {
                position: absolute;
                top: 55px;
                left: 55px;
                right: 55px;
                bottom: 55px;
                border: 2px solid #C8860D;
            }
            
            .corner-decoration {
                position: absolute;
                width: 30px;
                height: 30px;
                border: 2px solid #C8860D;
            }
            
            .corner-decoration::before {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 6px;
                height: 6px;
                border: 2px solid #C8860D;
                border-radius: 50%;
                transform: translate(-50%, -50%);
            }
            
            .corner-decoration::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 0;
                right: 0;
                height: 2px;
                background: #C8860D;
                transform: translateY(-50%);
            }
            
            .corner-decoration.vertical::after {
                top: 0;
                bottom: 0;
                left: 50%;
                width: 2px;
                height: auto;
                transform: translateX(-50%);
            }
            
            .corner-tl {
                top: 70px;
                left: 70px;
            }
            
            .corner-tr {
                top: 70px;
                right: 70px;
            }
            
            .corner-bl {
                bottom: 70px;
                left: 70px;
            }
            
            .corner-br {
                bottom: 70px;
                right: 70px;
            }
            
            .microsoft-logo {
                position: absolute;
                top: 80px;
                left: 80px;
                display: flex;
                align-items: center;
                gap: 15px;
            }
            
            .ms-squares {
                display: grid;
                grid-template-columns: 20px 20px;
                gap: 2px;
                width: 42px;
                height: 42px;
            }
            
            .ms-square {
                width: 20px;
                height: 20px;
            }
            
            .ms-square.blue1 { background: #00BCF2; }
            .ms-square.blue2 { background: #00A4EF; }
            .ms-square.yellow { background: #FFB900; }
            .ms-square.red { background: #F25022; }
            
            .ms-text {
                font-size: 28px;
                font-weight: bold;
                color: #737373;
            }
            
            .reliance-logo {
                position: absolute;
                top: 70px;
                right: 80px;
                width: 180px;
                height: 80px;
                background: #E31E24;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                color: white;
            }
            
            .rd-main {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 2px;
            }
            
            .rd-digital {
                font-size: 16px;
                font-weight: bold;
                margin-bottom: 8px;
            }
            
            .rd-tagline {
                font-size: 10px;
                letter-spacing: 0.5px;
            }
            
            .main-title {
                position: absolute;
                top: 220px;
                left: 0;
                right: 0;
                text-align: center;
                font-size: 42px;
                font-weight: bold;
                color: #2B5797;
            }
            
            .completion {
                position: absolute;
                top: 300px;
                left: 0;
                right: 0;
                text-align: center;
                font-size: 84px;
                font-weight: bold;
                color: #E31E24;
            }
            
            .certify-text {
                position: absolute;
                top: 380px;
                left: 0;
                right: 0;
                text-align: center;
                font-size: 24px;
                color: #000000;
            }
            
            .recipient-name {
                position: absolute;
                top: 440px;
                left: 0;
                right: 0;
                text-align: center;
                font-size: 52px;
                font-weight: bold;
                color: #2B5797;
            }
            
            .attended-text {
                position: absolute;
                top: 490px;
                left: 0;
                right: 0;
                text-align: center;
                font-size: 22px;
                color: #000000;
            }
            
            .course-name {
                position: absolute;
                top: 540px;
                left: 0;
                right: 0;
                text-align: center;
                font-size: 36px;
                font-weight: bold;
                color: #2B5797;
            }
            
            .event-details {
                position: absolute;
                top: 580px;
                left: 0;
                right: 0;
                text-align: center;
                font-size: 20px;
                color: #000000;
            }
            
            .appreciation {
                position: absolute;
                top: 620px;
                left: 0;
                right: 0;
                text-align: center;
                font-size: 18px;
                color: #000000;
                line-height: 1.4;
            }
            
            .signature-area {
                position: absolute;
                top: 720px;
                left: 50%;
                transform: translateX(-50%);
                text-align: center;
            }
            
            .signature-line {
                width: 200px;
                height: 1px;
                background: #000000;
                margin: 0 auto 10px;
            }
            
            .signature-name {
                font-size: 24px;
                font-style: italic;
                color: #000000;
                margin-bottom: 5px;
            }
            
            .signature-title {
                font-size: 16px;
                color: #000000;
                margin-bottom: 5px;
            }
            
            .signature-role {
                font-size: 16px;
                color: #000000;
            }
            
            .ai-badge {
                position: absolute;
                bottom: 100px;
                right: 140px;
                width: 100px;
                height: 60px;
                background: #E31E24;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                color: white;
            }
            
            .badge-certified {
                font-size: 11px;
                font-weight: bold;
                margin-bottom: 2px;
            }
            
            .badge-school {
                font-size: 16px;
                font-weight: bold;
            }
        </style>
    </head>
    <body>
        <div class="certificate">
            <div class="border"></div>
            <div class="inner-border"></div>
            
            <div class="corner-decoration corner-tl"></div>
            <div class="corner-decoration corner-tr"></div>
            <div class="corner-decoration corner-bl"></div>
            <div class="corner-decoration corner-br"></div>
            
            <div class="microsoft-logo">
                <div class="ms-squares">
                    <div class="ms-square blue1"></div>
                    <div class="ms-square blue2"></div>
                    <div class="ms-square yellow"></div>
                    <div class="ms-square red"></div>
                </div>
                <div class="ms-text">Microsoft</div>
            </div>
            
            <div class="reliance-logo">
                <div class="rd-main">Reliance</div>
                <div class="rd-digital">digital</div>
                <div class="rd-tagline">PERSONALISING TECHNOLOGY</div>
            </div>
            
            <div class="main-title">CERTIFICATE OF</div>
            <div class="completion">COMPLETION</div>
            
            <div class="certify-text">This is to certify that</div>
            <div class="recipient-name">${recipientName}</div>
            <div class="attended-text">has successfully attended</div>
            <div class="course-name">${courseName}</div>
            <div class="event-details">held at Reliance Digital Store on ${eventDate}</div>
            
            <div class="appreciation">
                We appreciate your enthusiasm and commitment to learning<br>
                the future of AI technology.
            </div>
            
            <div class="signature-area">
                <div class="signature-line"></div>
                <div class="signature-name">Samuel Iyer</div>
                <div class="signature-title">Samual Iyer</div>
                <div class="signature-role">VP Relations, Reliance Digital</div>
            </div>
            
            <div class="ai-badge">
                <div class="badge-certified">Certified by</div>
                <div class="badge-school">AI SCHOOL</div>
            </div>
        </div>
    </body>
    </html>
  `;
}

async function generateCertificate(recipient, config = {}) {
  let browser;
  try {
    // Launch Puppeteer browser
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ]
    });
    
    const page = await browser.newPage();
    
    // Set viewport to match certificate dimensions
    await page.setViewport({
      width: CERTIFICATE_WIDTH,
      height: CERTIFICATE_HEIGHT,
      deviceScaleFactor: 2
    });
    
    // Generate HTML content
    const html = generateCertificateHTML(recipient, config);
    
    // Set HTML content
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    // Take screenshot
    const screenshot = await page.screenshot({
      type: 'png',
      fullPage: false,
      clip: {
        x: 0,
        y: 0,
        width: CERTIFICATE_WIDTH,
        height: CERTIFICATE_HEIGHT
      }
    });
    
    // Ensure certificates directory exists
    const certificatesDir = path.join(__dirname, '../certificates');
    if (!fs.existsSync(certificatesDir)) {
      fs.mkdirSync(certificatesDir, { recursive: true });
    }

    // Save certificate
    const filename = `certificate_${recipient.name.replace(/\s+/g, '_')}_${Date.now()}.png`;
    const filepath = path.join(certificatesDir, filename);
    
    fs.writeFileSync(filepath, screenshot);
    
    return filepath;
  } catch (error) {
    console.error('Error generating certificate:', error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Generate preview certificate
async function generatePreviewCertificate(config = {}) {
  const sampleRecipient = {
    name: 'Ravi Verma',
    course: 'AI Prompt Engineering Masterclass',
    date: '20 Sep, 2025'
  };
  
  return await generateCertificate(sampleRecipient, config);
}

module.exports = {
  generateCertificate,
  generatePreviewCertificate
};

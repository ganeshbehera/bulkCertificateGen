const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Helper function to draw corner decorations matching the original image
function drawCornerDecoration(ctx, x, y, size, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  
  // Draw decorative corner elements - simple elegant lines
  ctx.beginPath();
  // Horizontal line
  ctx.moveTo(x - size, y);
  ctx.lineTo(x + size, y);
  // Vertical line
  ctx.moveTo(x, y - size);
  ctx.lineTo(x, y + size);
  ctx.stroke();
  
  // Small decorative circle in center
  ctx.beginPath();
  ctx.arc(x, y, size / 4, 0, 2 * Math.PI);
  ctx.stroke();
}

// Certificate dimensions - matching the original format
const CERTIFICATE_WIDTH = 1400;
const CERTIFICATE_HEIGHT = 900;

async function generateCertificate(recipient, config = {}) {
  try {
    // Create canvas
    const canvas = createCanvas(CERTIFICATE_WIDTH, CERTIFICATE_HEIGHT);
    const ctx = canvas.getContext('2d');

    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, CERTIFICATE_WIDTH, CERTIFICATE_HEIGHT);

    // Decorative border - matching the original image
    const borderColor = '#C8860D'; // More accurate gold color from the image
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 4;
    
    // Main border rectangle
    const margin = 45;
    ctx.strokeRect(margin, margin, CERTIFICATE_WIDTH - (margin * 2), CERTIFICATE_HEIGHT - (margin * 2));
    
    // Inner decorative border
    ctx.lineWidth = 2;
    ctx.strokeRect(margin + 10, margin + 10, CERTIFICATE_WIDTH - (margin + 10) * 2, CERTIFICATE_HEIGHT - (margin + 10) * 2);

    // Corner decorative elements - small ornamental designs
    const cornerSize = 15;
    const cornerOffset = margin + 25;
    
    // Top-left corner decoration
    drawCornerDecoration(ctx, cornerOffset, cornerOffset, cornerSize, borderColor);
    // Top-right corner decoration  
    drawCornerDecoration(ctx, CERTIFICATE_WIDTH - cornerOffset, cornerOffset, cornerSize, borderColor);
    // Bottom-left corner decoration
    drawCornerDecoration(ctx, cornerOffset, CERTIFICATE_HEIGHT - cornerOffset, cornerSize, borderColor);
    // Bottom-right corner decoration
    drawCornerDecoration(ctx, CERTIFICATE_WIDTH - cornerOffset, CERTIFICATE_HEIGHT - cornerOffset, cornerSize, borderColor);

    // Microsoft logo (4 colored squares) - top left
    const logoSize = 20;
    const logoX = 80;
    const logoY = 80;
    
    // Microsoft logo squares
    ctx.fillStyle = '#00BCF2'; // Light blue
    ctx.fillRect(logoX, logoY, logoSize, logoSize);
    ctx.fillStyle = '#00A4EF'; // Blue
    ctx.fillRect(logoX + logoSize + 2, logoY, logoSize, logoSize);
    ctx.fillStyle = '#FFB900'; // Yellow
    ctx.fillRect(logoX, logoY + logoSize + 2, logoSize, logoSize);
    ctx.fillStyle = '#F25022'; // Red
    ctx.fillRect(logoX + logoSize + 2, logoY + logoSize + 2, logoSize, logoSize);
    
    // Microsoft text
    ctx.fillStyle = '#737373';
    ctx.font = 'bold 28px Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Microsoft', logoX + (logoSize * 2) + 15, logoY + logoSize);

    // Reliance Digital logo area - top right
    const rdLogoX = CERTIFICATE_WIDTH - 250;
    const rdLogoY = 70;
    const rdLogoWidth = 180;
    const rdLogoHeight = 80;
    
    // Red background for Reliance Digital
    ctx.fillStyle = '#E31E24';
    ctx.fillRect(rdLogoX, rdLogoY, rdLogoWidth, rdLogoHeight);
    
    // Reliance Digital text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Reliance', rdLogoX + rdLogoWidth/2, rdLogoY + 25);
    ctx.font = 'bold 16px Arial, sans-serif';
    ctx.fillText('digital', rdLogoX + rdLogoWidth/2, rdLogoY + 45);
    ctx.font = '10px Arial, sans-serif';
    ctx.fillText('PERSONALISING TECHNOLOGY', rdLogoX + rdLogoWidth/2, rdLogoY + 65);

    // Main heading "CERTIFICATE OF"
    ctx.fillStyle = '#2B5797'; // Blue color from the image
    ctx.font = 'bold 42px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('CERTIFICATE OF', CERTIFICATE_WIDTH / 2, 220);

    // "COMPLETION" in large red letters
    ctx.fillStyle = '#E31E24'; // Red color
    ctx.font = 'bold 84px Arial, sans-serif';
    ctx.fillText('COMPLETION', CERTIFICATE_WIDTH / 2, 300);

    // Spacing line or decoration (if needed)
    
    // "This is to certify that"
    ctx.fillStyle = '#000000';
    ctx.font = '24px Arial, sans-serif';
    ctx.fillText('This is to certify that', CERTIFICATE_WIDTH / 2, 380);

    // Recipient name - prominently displayed
    ctx.fillStyle = '#2B5797'; // Blue color
    ctx.font = 'bold 52px Arial, sans-serif';
    const recipientName = recipient.name || 'Ravi Verma';
    ctx.fillText(recipientName, CERTIFICATE_WIDTH / 2, 440);

    // "has successfully attended"
    ctx.fillStyle = '#000000';
    ctx.font = '22px Arial, sans-serif';
    ctx.fillText('has successfully attended', CERTIFICATE_WIDTH / 2, 490);

    // Course/Program name
    ctx.fillStyle = '#2B5797'; // Blue color
    ctx.font = 'bold 36px Arial, sans-serif';
    const courseName = recipient.course || 'AI Prompt Engineering Masterclass';
    ctx.fillText(courseName, CERTIFICATE_WIDTH / 2, 540);

    // Event details
    ctx.fillStyle = '#000000';
    ctx.font = '20px Arial, sans-serif';
    const eventDate = recipient.date || '20 Sep, 2025';
    ctx.fillText(`held at Reliance Digital Store on ${eventDate}`, CERTIFICATE_WIDTH / 2, 580);

    // Appreciation message
    ctx.font = '18px Arial, sans-serif';
    ctx.fillText('We appreciate your enthusiasm and commitment to learning', CERTIFICATE_WIDTH / 2, 620);
    ctx.fillText('the future of AI technology.', CERTIFICATE_WIDTH / 2, 645);

    // Signature area
    const signatureY = 720;
    
    // Signature line
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(CERTIFICATE_WIDTH / 2 - 100, signatureY);
    ctx.lineTo(CERTIFICATE_WIDTH / 2 + 100, signatureY);
    ctx.stroke();
    
    // Handwritten signature style
    ctx.fillStyle = '#000000';
    ctx.font = 'italic 24px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Samuel Iyer', CERTIFICATE_WIDTH / 2, signatureY - 10);
    
    // Name and title below signature
    ctx.font = '16px Arial, sans-serif';
    ctx.fillText('Samual Iyer', CERTIFICATE_WIDTH / 2, signatureY + 25);
    ctx.fillText('VP Relations, Reliance Digital', CERTIFICATE_WIDTH / 2, signatureY + 45);

    // Certification badge - bottom right
    const badgeX = CERTIFICATE_WIDTH - 140;
    const badgeY = CERTIFICATE_HEIGHT - 100;
    const badgeWidth = 100;
    const badgeHeight = 60;
    
    // Red badge background
    ctx.fillStyle = '#E31E24';
    ctx.fillRect(badgeX, badgeY, badgeWidth, badgeHeight);
    
    // Badge text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Certified by', badgeX + badgeWidth/2, badgeY + 20);
    ctx.font = 'bold 16px Arial, sans-serif';
    ctx.fillText('AI SCHOOL', badgeX + badgeWidth/2, badgeY + 40);

    // Save certificate
    const certificatesDir = path.join(__dirname, '../certificates');
    if (!fs.existsSync(certificatesDir)) {
      fs.mkdirSync(certificatesDir, { recursive: true });
    }

    const filename = `certificate_${recipient.name.replace(/\s+/g, '_')}_${Date.now()}.png`;
    const filepath = path.join(certificatesDir, filename);
    
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(filepath, buffer);

    return filepath;
  } catch (error) {
    console.error('Error generating certificate:', error);
    throw error;
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

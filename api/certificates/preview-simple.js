// Simple certificate preview using HTML response (fallback for Puppeteer issues)
export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { config } = req.body;
    
    // Generate the same HTML as the certificate generator
    const recipientName = 'Ravi Verma';
    const courseName = 'AI Prompt Engineering Masterclass';
    const eventDate = '20 Sep, 2025';
    
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Certificate Preview</title>
          <style>
              body {
                  margin: 0;
                  padding: 20px;
                  font-family: Arial, sans-serif;
                  background: #f5f5f5;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  min-height: 100vh;
              }
              
              .certificate {
                  width: 800px;
                  height: 600px;
                  position: relative;
                  background: white;
                  box-sizing: border-box;
                  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
              }
              
              .border {
                  position: absolute;
                  top: 30px;
                  left: 30px;
                  right: 30px;
                  bottom: 30px;
                  border: 4px solid #C8860D;
              }
              
              .inner-border {
                  position: absolute;
                  top: 40px;
                  left: 40px;
                  right: 40px;
                  bottom: 40px;
                  border: 2px solid #C8860D;
              }
              
              .microsoft-logo {
                  position: absolute;
                  top: 60px;
                  left: 60px;
                  display: flex;
                  align-items: center;
                  gap: 10px;
              }
              
              .ms-squares {
                  display: grid;
                  grid-template-columns: 15px 15px;
                  gap: 2px;
                  width: 32px;
                  height: 32px;
              }
              
              .ms-square {
                  width: 15px;
                  height: 15px;
              }
              
              .ms-square.blue1 { background: #00BCF2; }
              .ms-square.blue2 { background: #00A4EF; }
              .ms-square.yellow { background: #FFB900; }
              .ms-square.red { background: #F25022; }
              
              .ms-text {
                  font-size: 20px;
                  font-weight: bold;
                  color: #737373;
              }
              
              .reliance-logo {
                  position: absolute;
                  top: 50px;
                  right: 60px;
                  width: 140px;
                  height: 60px;
                  background: #E31E24;
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  align-items: center;
                  color: white;
              }
              
              .rd-main {
                  font-size: 14px;
                  font-weight: bold;
                  margin-bottom: 2px;
              }
              
              .rd-digital {
                  font-size: 12px;
                  font-weight: bold;
                  margin-bottom: 6px;
              }
              
              .rd-tagline {
                  font-size: 8px;
                  letter-spacing: 0.5px;
              }
              
              .main-title {
                  position: absolute;
                  top: 160px;
                  left: 0;
                  right: 0;
                  text-align: center;
                  font-size: 32px;
                  font-weight: bold;
                  color: #2B5797;
              }
              
              .completion {
                  position: absolute;
                  top: 210px;
                  left: 0;
                  right: 0;
                  text-align: center;
                  font-size: 60px;
                  font-weight: bold;
                  color: #E31E24;
              }
              
              .certify-text {
                  position: absolute;
                  top: 280px;
                  left: 0;
                  right: 0;
                  text-align: center;
                  font-size: 18px;
                  color: #000000;
              }
              
              .recipient-name {
                  position: absolute;
                  top: 320px;
                  left: 0;
                  right: 0;
                  text-align: center;
                  font-size: 36px;
                  font-weight: bold;
                  color: #2B5797;
              }
              
              .attended-text {
                  position: absolute;
                  top: 360px;
                  left: 0;
                  right: 0;
                  text-align: center;
                  font-size: 16px;
                  color: #000000;
              }
              
              .course-name {
                  position: absolute;
                  top: 390px;
                  left: 0;
                  right: 0;
                  text-align: center;
                  font-size: 24px;
                  font-weight: bold;
                  color: #2B5797;
              }
              
              .event-details {
                  position: absolute;
                  top: 420px;
                  left: 0;
                  right: 0;
                  text-align: center;
                  font-size: 14px;
                  color: #000000;
              }
              
              .appreciation {
                  position: absolute;
                  top: 450px;
                  left: 0;
                  right: 0;
                  text-align: center;
                  font-size: 12px;
                  color: #000000;
                  line-height: 1.4;
              }
              
              .signature-area {
                  position: absolute;
                  top: 500px;
                  left: 50%;
                  transform: translateX(-50%);
                  text-align: center;
              }
              
              .signature-line {
                  width: 150px;
                  height: 1px;
                  background: #000000;
                  margin: 0 auto 8px;
              }
              
              .signature-name {
                  font-size: 16px;
                  font-style: italic;
                  color: #000000;
                  margin-bottom: 4px;
              }
              
              .signature-title {
                  font-size: 12px;
                  color: #000000;
                  margin-bottom: 4px;
              }
              
              .signature-role {
                  font-size: 12px;
                  color: #000000;
              }
              
              .ai-badge {
                  position: absolute;
                  bottom: 80px;
                  right: 100px;
                  width: 80px;
                  height: 50px;
                  background: #E31E24;
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  align-items: center;
                  color: white;
              }
              
              .badge-certified {
                  font-size: 9px;
                  font-weight: bold;
                  margin-bottom: 2px;
              }
              
              .badge-school {
                  font-size: 12px;
                  font-weight: bold;
              }
              
              .preview-note {
                  position: absolute;
                  bottom: 10px;
                  left: 0;
                  right: 0;
                  text-align: center;
                  font-size: 12px;
                  color: #666;
                  background: rgba(255,255,255,0.9);
                  padding: 5px;
              }
          </style>
      </head>
      <body>
          <div class="certificate">
              <div class="border"></div>
              <div class="inner-border"></div>
              
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
              
              <div class="preview-note">
                  Certificate Preview - This is how your certificates will look
              </div>
          </div>
      </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);

  } catch (error) {
    console.error('Error generating simple preview:', error);
    res.status(500).json({ 
      error: 'Failed to generate preview',
      details: error.message 
    });
  }
}

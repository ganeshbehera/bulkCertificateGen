# bulkCertificateGen

A modern web application for generating and sending certificates in bulk. Upload recipient data via Excel files, customize certificate designs, and automatically send certificates via email.

## 🚀 Live Demo

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ganeshbehera/bulkCertificateGen)

## Features

- 📊 **Excel Upload**: Upload recipient data from Excel/CSV files
- 🎨 **Certificate Customization**: Customize colors, text, and design
- 📧 **Bulk Email Sending**: Automatically send certificates via email
- 🔍 **Live Preview**: Preview certificates before generation
- ✅ **Email Validation**: Test email configuration before sending
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🚀 **Brevo SMTP**: Built-in support for Brevo (Sendinblue) SMTP
- 🔒 **Secure**: Environment-based configuration for API keys

## Screenshots

### Upload Recipients Data
![Upload Screen](docs/upload-screen.png)

### Customize Certificate Design
![Design Screen](docs/design-screen.png)

### Email Configuration
![Email Screen](docs/email-screen.png)

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Gmail account with App Password (for email sending)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd certificate-generator
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables** (optional)
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Start the application**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## Usage Guide

### Step 1: Prepare Your Data

1. Download the sample Excel template from the app
2. Fill in recipient information with required columns:
   - `name` (required): Recipient's full name
   - `email` (required): Recipient's email address
   - `course` (optional): Course or achievement name
   - `date` (optional): Completion date

### Step 2: Upload Data

1. Drag and drop your Excel file or click to browse
2. Review the uploaded recipients
3. Edit any information if needed
4. Add or remove recipients as necessary

### Step 3: Customize Certificate

1. Modify the certificate title and subtitle
2. Customize colors for different text elements
3. Generate a preview to see your changes
4. Reset to defaults if needed

### Step 4: Configure Email

**Option A: Brevo SMTP (Recommended for Production)**
1. Sign up at [brevo.com](https://www.brevo.com)
2. Verify your domain and sender email
3. Generate SMTP API key
4. Use the configuration:
   - Provider: Brevo
   - API Key: Your Brevo SMTP key
   - From Email: Your verified sender email
5. Test the configuration

**Option B: Gmail SMTP**
1. Select Gmail as your email service
2. Enter your Gmail address
3. Enter your app password (see Gmail setup below)
4. Test the configuration
5. Customize the email template (optional)

📖 **Detailed Setup Guide:** See [BREVO_SETUP.md](BREVO_SETUP.md) for complete Brevo configuration instructions.

### Step 5: Generate and Send

1. Review the summary
2. Click "Generate & Send" to process all certificates
3. Monitor the progress and results

## Gmail Setup for Email Sending

To send emails through Gmail, you need to set up an App Password:

1. **Enable 2-Factor Authentication**
   - Go to [Google Account Settings](https://myaccount.google.com/)
   - Navigate to Security → 2-Step Verification
   - Follow the setup process

2. **Generate App Password**
   - Go to Security → App passwords
   - Select "Mail" as the app
   - Copy the generated 16-character password

3. **Use in Application**
   - Enter your Gmail address as the email
   - Use the app password (not your regular password)

## Excel File Format

Your Excel file should have the following structure:

| name | email | course | date |
|------|-------|---------|------|
| John Doe | john@example.com | Web Development | 2024-01-15 |
| Jane Smith | jane@example.com | Data Science | 2024-01-15 |

**Required Columns:**
- `name`: Full name of the recipient
- `email`: Valid email address

**Optional Columns:**
- `course`: Course or program name
- `date`: Completion date (will use current date if not provided)

## API Endpoints

### Certificate Endpoints

- `POST /api/certificates/parse-excel` - Parse uploaded Excel file
- `POST /api/certificates/generate-bulk` - Generate certificates for all recipients
- `GET /api/certificates/sample-template` - Download sample Excel template

### Email Endpoints

- `POST /api/email/send-bulk` - Send certificates via email
- `POST /api/email/test-config` - Test email configuration

## Project Structure

```
certificate-generator/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.js         # Main application
│   │   └── index.js       # Entry point
│   └── public/            # Static files
├── server/                # Express backend
│   ├── routes/            # API routes
│   ├── utils/             # Utility functions
│   └── index.js           # Server entry point
├── package.json           # Root dependencies
└── README.md             # This file
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
NODE_ENV=development
```

### Certificate Customization

The certificate generator supports various customization options:

- **Colors**: Title, subtitle, name, achievement text, date, border, and background
- **Text**: Certificate title and subtitle
- **Layout**: Fixed layout optimized for professional appearance

## Troubleshooting

### Common Issues

1. **"Email configuration test failed"**
   - Ensure 2FA is enabled on Gmail
   - Use App Password, not regular password
   - Check email address spelling

2. **"Failed to parse Excel file"**
   - Ensure file has 'name' and 'email' columns
   - Check file format (xlsx, xls, csv supported)
   - Verify file size is under 10MB

3. **"Certificate generation failed"**
   - Check server logs for detailed error
   - Ensure sufficient disk space
   - Verify all required recipient data is present

### Getting Help

If you encounter issues:

1. Check the browser console for error messages
2. Review the server logs in the terminal
3. Ensure all dependencies are installed correctly
4. Verify your email configuration

## Development

### Running in Development Mode

```bash
# Install dependencies
npm run install-all

# Start development servers
npm run dev
```

This will start:
   - Backend server on `http://localhost:3001`
- Frontend development server on `http://localhost:3000`

### Building for Production

```bash
# Build the React app
npm run build

# Start production server
npm start
```

## Technologies Used

### Frontend
- React 18
- Tailwind CSS
- Axios for API calls
- React Dropzone for file uploads
- Lucide React for icons

### Backend
- Express.js
- Multer for file uploads
- XLSX for Excel parsing
- Canvas for certificate generation
- Nodemailer for email sending

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For support and questions:
- Create an issue on GitHub
- Check the troubleshooting section
- Review the documentation

---

Made with ❤️ for easy certificate generation and distribution.
# bulkCertificateGen

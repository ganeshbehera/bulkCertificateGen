# Deployment Guide

## Deploy to Vercel

### Option 1: One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ganeshbehera/bulkCertificateGen)

### Option 2: Manual Deployment

1. **Fork or clone this repository**
2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect the configuration

3. **Environment Variables (Optional):**
   - Set `NODE_ENV=production`
   - Add any email configuration if needed

4. **Deploy:**
   - Vercel will automatically build and deploy both frontend and backend
   - The app will be available at your Vercel URL

## Project Structure for Deployment

```
bulkCertificateGen/
├── client/                 # React frontend
│   ├── src/               # React components
│   ├── public/            # Static files
│   └── package.json       # Frontend dependencies
├── server/                # Express backend
│   ├── routes/            # API routes
│   ├── utils/             # Certificate generator
│   └── index.js           # Server entry point
├── vercel.json            # Vercel configuration
├── package.json           # Root dependencies
└── README.md              # Documentation
```

## How it Works

1. **Frontend (React):** Built and served as static files
2. **Backend (Express):** Runs as Vercel serverless functions
3. **API Routes:** All `/api/*` requests go to the backend
4. **Static Routes:** All other routes serve the React app
5. **Certificate Generation:** Uses Canvas to create PNG certificates
6. **Email Sending:** Uses Nodemailer with SMTP configuration

## Features Available After Deployment

✅ **Excel File Upload & Processing**
✅ **Certificate Generation with Professional Design**
✅ **Email Configuration & Testing**
✅ **Bulk Certificate Generation**
✅ **Bulk Email Sending**
✅ **Responsive UI**

## Post-Deployment Setup

1. **Access your deployed app**
2. **Test certificate generation**
3. **Configure email settings** (Gmail recommended with App Password)
4. **Upload Excel file with recipients**
5. **Generate and send certificates**

## Support

- Frontend: React 18 with Tailwind CSS
- Backend: Express.js with Canvas for certificate generation
- Email: Nodemailer with SMTP support
- Deployment: Vercel with serverless functions

Your bulk certificate generator is now live and ready to use! 🚀

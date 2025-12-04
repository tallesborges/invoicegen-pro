# InvoiceGen Pro

A professional invoice generation application built with React, TypeScript, and jsPDF.

## Features

- 📄 **PDF Generation**: Create professional invoices with automatic PDF generation
- 💼 **Company Management**: Save and manage multiple client companies
- 📊 **Invoice History**: Track and duplicate previous invoices
- 🧮 **Automatic Calculations**: Auto-calculate subtotals, taxes, and totals
- 💾 **Local Storage**: All data stored locally in your browser
- 🎨 **Modern UI**: Clean, responsive interface with Tailwind CSS

## Run Locally

**Prerequisites:** Node.js (v16 or higher)

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open your browser at `http://localhost:5173`

## First Time Setup

On first run, the app will use default placeholder data. Update your business information:

1. Fill in your business details (name, address, phone) in the invoice form
2. Add your client companies in the "Companies" section
3. Create your first invoice

All data is stored locally in your browser's localStorage.

## Usage

### Creating an Invoice

1. Click "New Invoice" in the sidebar
2. Fill in your business information (sender details)
3. Select or add a client company to bill
4. Add line items with descriptions, rates, and quantities
5. Set sales tax rate if applicable
6. Click "Save & Generate PDF" to download the invoice

### Managing Companies

1. Go to "Companies" in the sidebar
2. Click "New Company" to add a client
3. Fill in company name, address, and contact details
4. Edit or delete companies as needed

### Viewing History

1. Go to "History" in the sidebar
2. View all previously generated invoices
3. Click "Duplicate" to create a new invoice based on an old one

## Tech Stack

- **React** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **jsPDF** - PDF generation
- **Lucide React** - Icons

## License

MIT

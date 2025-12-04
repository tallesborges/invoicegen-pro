# InvoiceGen Pro

A professional invoice generation application built with React, TypeScript, and jsPDF.

## Features

- 📄 **PDF Generation**: Create professional invoices with automatic PDF generation
- 💼 **Company Management**: Save and manage multiple client companies
- 📊 **Invoice History**: Track and duplicate previous invoices
- 🧮 **Automatic Calculations**: Auto-calculate subtotals, taxes, and totals
- ⚙️ **Settings Management**: Configure business info, invoice prefix, and defaults
- 🔢 **Auto-numbering**: Automatic invoice numbering with custom prefix support
- 💾 **Local Storage**: All data stored locally in your browser
- 🎨 **Modern UI**: Clean, responsive interface with Tailwind CSS

## Run Locally

**Prerequisites:** Bun (v1.0 or higher)

1. Install dependencies:
   ```bash
   bun install
   ```

2. Run the development server:
   ```bash
   bun dev
   ```

3. Open your browser at `http://localhost:5173`

## First Time Setup

On first run, the app will use default placeholder data. Set up your invoice system:

1. **Configure Settings**: Go to "Settings" in the sidebar and update:
   - Your business information (name, address, phone, email)
   - Invoice prefix (e.g., "INV-", "2024-", "INVOICE-")
   - Starting invoice number
   - Default tax rate

2. **Add Companies**: Go to "Companies" and add your client companies

3. **Create Invoices**: Go to "New Invoice" to create your first invoice

All data is stored locally in your browser's localStorage.

## Usage

### Configuring Settings

1. Go to "Settings" in the sidebar
2. Update **Your Business Information**:
   - Business name, address, phone, and email
3. Configure **Invoice Settings**:
   - Invoice prefix (appears before number, e.g., "INV-1001")
   - Next invoice number (auto-increments after each invoice)
   - Default sales tax rate
4. Click "Save Settings"

### Creating an Invoice

1. Click "New Invoice" in the sidebar
2. Invoice number is auto-generated using your prefix and counter
3. Your business information is pre-filled from settings (editable per invoice)
4. Select a client company to bill
5. Add line items with descriptions, rates, and quantities
6. Adjust sales tax rate if needed (defaults to your setting)
7. Click "Save & Generate PDF" to download the invoice

### Managing Companies

1. Go to "Companies" in the sidebar
2. Click "New Company" to add a client
3. Fill in company name, address, and contact details
4. Edit or delete companies as needed

### Viewing History

1. Go to "History" in the sidebar
2. View all previously generated invoices
3. Click "Duplicate" to create a new invoice based on an old one
4. Duplicated invoices get a new number and today's date

## Tech Stack

- **React** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **jsPDF** - PDF generation
- **Lucide React** - Icons

## License

MIT

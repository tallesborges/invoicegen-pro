export interface Company {
  id: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  rate: number;
  quantity: number; // Represents "Unit" or "Hours"
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  senderName: string;
  senderAddress: string;
  senderPhone: string;
  recipient: Company;
  items: InvoiceItem[];
  salesTaxRate: number; // Percentage
  instructions: string;
  createdAt: number;
}

export interface AppSettings {
  senderName: string;
  senderAddress: string;
  senderPhone: string;
  defaultTaxRate: number;
  nextInvoiceNumber: number;
}

import { Company, Invoice, AppSettings } from '../types';

const KEYS = {
  COMPANIES: 'invoicegen_companies',
  INVOICES: 'invoicegen_history',
  SETTINGS: 'invoicegen_settings',
};

const DEFAULT_SETTINGS: AppSettings = {
  senderName: 'Your Business Name',
  senderAddress: 'Your Street Address\nCity, State, ZIP',
  senderPhone: '+1 555 123 4567',
  defaultTaxRate: 0,
  nextInvoiceNumber: 1001,
};

export const StorageService = {
  getCompanies: (): Company[] => {
    const data = localStorage.getItem(KEYS.COMPANIES);
    return data ? JSON.parse(data) : [];
  },

  saveCompanies: (companies: Company[]) => {
    localStorage.setItem(KEYS.COMPANIES, JSON.stringify(companies));
  },

  getInvoices: (): Invoice[] => {
    const data = localStorage.getItem(KEYS.INVOICES);
    return data ? JSON.parse(data) : [];
  },

  saveInvoice: (invoice: Invoice) => {
    const invoices = StorageService.getInvoices();
    // Check if exists, update if so, otherwise unshift
    const index = invoices.findIndex((i) => i.id === invoice.id);
    if (index >= 0) {
      invoices[index] = invoice;
    } else {
      invoices.unshift(invoice);
    }
    localStorage.setItem(KEYS.INVOICES, JSON.stringify(invoices));
  },

  deleteInvoice: (id: string) => {
    const invoices = StorageService.getInvoices().filter(i => i.id !== id);
    localStorage.setItem(KEYS.INVOICES, JSON.stringify(invoices));
  },

  getSettings: (): AppSettings => {
    const data = localStorage.getItem(KEYS.SETTINGS);
    return data ? JSON.parse(data) : DEFAULT_SETTINGS;
  },

  saveSettings: (settings: AppSettings) => {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  },
};

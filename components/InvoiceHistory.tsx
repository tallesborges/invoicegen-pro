import React, { useState, useEffect } from 'react';
import { Invoice } from '../types';
import { StorageService } from '../services/storage';
import { generateInvoicePDF } from '../services/pdfGenerator';
import { Download, FileText, Trash2, Copy } from 'lucide-react';

interface InvoiceHistoryProps {
  onDuplicate: (invoice: Invoice) => void;
}

const InvoiceHistory: React.FC<InvoiceHistoryProps> = ({ onDuplicate }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = () => {
    setInvoices(StorageService.getInvoices());
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this invoice from history?')) {
      StorageService.deleteInvoice(id);
      loadInvoices();
    }
  };

  const handleDownload = (invoice: Invoice) => {
    generateInvoicePDF(invoice);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Invoice History</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invoices.map(invoice => {
              const subtotal = invoice.items.reduce((sum, item) => sum + (item.rate * item.quantity), 0);
              const total = subtotal + (subtotal * (invoice.salesTaxRate / 100));

              return (
                <tr key={invoice.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{invoice.invoiceNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{invoice.recipient?.name || 'Unknown'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-green-600">
                    {total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-3">
                    <button 
                      onClick={() => handleDownload(invoice)}
                      className="text-gray-600 hover:text-blue-600" 
                      title="Download PDF"
                    >
                      <Download size={18} />
                    </button>
                    <button 
                      onClick={() => onDuplicate(invoice)}
                      className="text-gray-600 hover:text-blue-600" 
                      title="Duplicate / Edit"
                    >
                      <Copy size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(invoice.id)}
                      className="text-gray-400 hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
            {invoices.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  <FileText className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p>No invoices generated yet.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoiceHistory;

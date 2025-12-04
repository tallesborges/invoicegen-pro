import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Download, Calculator } from 'lucide-react';
import { Company, Invoice, InvoiceItem } from '../types';
import { StorageService } from '../services/storage';
import { generateInvoicePDF } from '../services/pdfGenerator';
import { v4 as uuidv4 } from 'uuid';

interface InvoiceFormProps {
  onSave: () => void;
  existingInvoice?: Invoice | null;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ onSave, existingInvoice }) => {
  const [settings] = useState(StorageService.getSettings());
  const [companies, setCompanies] = useState<Company[]>([]);
  
  // Form State
  const [invoiceNumber, setInvoiceNumber] = useState(existingInvoice?.invoiceNumber || `INV${settings.nextInvoiceNumber}`);
  const [date, setDate] = useState(existingInvoice?.date || new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(existingInvoice?.dueDate || '');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(existingInvoice?.recipient?.id || '');
  const [items, setItems] = useState<InvoiceItem[]>(existingInvoice?.items || [
    { id: uuidv4(), description: 'Service Rendered', rate: 0, quantity: 1 }
  ]);
  const [taxRate, setTaxRate] = useState(existingInvoice?.salesTaxRate ?? settings.defaultTaxRate);
  const [instructions, setInstructions] = useState(existingInvoice?.instructions || 'Please make payment by the due date.');
  const [senderName, setSenderName] = useState(existingInvoice?.senderName || settings.senderName);
  const [senderAddress, setSenderAddress] = useState(existingInvoice?.senderAddress || settings.senderAddress);
  const [senderPhone, setSenderPhone] = useState(existingInvoice?.senderPhone || settings.senderPhone);

  useEffect(() => {
    setCompanies(StorageService.getCompanies());
  }, []);

  const handleAddItem = () => {
    setItems([...items, { id: uuidv4(), description: '', rate: 0, quantity: 1 }]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const calculateSubtotal = () => items.reduce((sum, item) => sum + (item.rate * item.quantity), 0);
  const calculateTax = () => calculateSubtotal() * (taxRate / 100);
  const calculateTotal = () => calculateSubtotal() + calculateTax();

  const handleSaveAndGenerate = () => {
    const recipient = companies.find(c => c.id === selectedCompanyId);
    
    if (!recipient) {
      alert("Please select a company to bill.");
      return;
    }

    const newInvoice: Invoice = {
      id: existingInvoice?.id || uuidv4(),
      invoiceNumber,
      date,
      dueDate,
      senderName,
      senderAddress,
      senderPhone,
      recipient,
      items,
      salesTaxRate: taxRate,
      instructions,
      createdAt: Date.now(),
    };

    StorageService.saveInvoice(newInvoice);
    
    // Update next invoice number if it's a new auto-generated one
    if (!existingInvoice && invoiceNumber === `INV${settings.nextInvoiceNumber}`) {
      StorageService.saveSettings({
        ...settings,
        nextInvoiceNumber: settings.nextInvoiceNumber + 1
      });
    }

    generateInvoicePDF(newInvoice);
    onSave();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
      {/* Header Inputs */}
      <div className="flex flex-col md:flex-row justify-between mb-8 gap-6 border-b pb-6">
        <div className="w-full md:w-1/2 space-y-4">
           <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">From (Sender)</label>
            <input 
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="Your Business Name"
            />
             <textarea 
              className="w-full mt-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              rows={3}
              value={senderAddress}
              onChange={(e) => setSenderAddress(e.target.value)}
              placeholder="Your Address"
            />
            <input 
              className="w-full mt-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              value={senderPhone}
              onChange={(e) => setSenderPhone(e.target.value)}
              placeholder="Phone Number"
            />
           </div>
        </div>
        <div className="w-full md:w-1/3 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Invoice #</label>
            <input 
              type="text" 
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border font-mono font-bold"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Date</label>
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            />
          </div>
           <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Due Date</label>
            <input 
              type="date" 
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            />
          </div>
        </div>
      </div>

      {/* Bill To */}
      <div className="mb-8">
        <label className="block text-lg font-bold text-gray-800 mb-2">BILL TO</label>
        <select
          value={selectedCompanyId}
          onChange={(e) => setSelectedCompanyId(e.target.value)}
          className="w-full md:w-1/2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border bg-gray-50"
        >
          <option value="">Select a Client...</option>
          {companies.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        {selectedCompanyId && (
          <div className="mt-2 text-sm text-gray-600 pl-2 border-l-4 border-gray-200">
            {(() => {
              const c = companies.find(comp => comp.id === selectedCompanyId);
              return c ? (
                <>
                  <p className="font-medium">{c.name}</p>
                  <p className="whitespace-pre-wrap">{c.address}</p>
                </>
              ) : null;
            })()}
          </div>
        )}
      </div>

      {/* Items Table */}
      <div className="mb-8 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/2">Description</th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Rate (USD)</th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-3 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="px-3 py-2">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    placeholder="Item description"
                    className="w-full border-0 border-b border-transparent focus:border-blue-500 focus:ring-0 sm:text-sm p-1"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    value={item.rate}
                    onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                    className="w-full text-right border-0 border-b border-transparent focus:border-blue-500 focus:ring-0 sm:text-sm p-1"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                    className="w-full text-right border-0 border-b border-transparent focus:border-blue-500 focus:ring-0 sm:text-sm p-1"
                  />
                </td>
                <td className="px-3 py-2 text-right text-sm font-medium text-gray-900">
                  {(item.rate * item.quantity).toFixed(2)}
                </td>
                <td className="px-3 py-2 text-right">
                  <button onClick={() => handleRemoveItem(item.id)} className="text-red-400 hover:text-red-600">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={handleAddItem}
          className="mt-4 flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          <Plus size={16} className="mr-1" /> Add Line Item
        </button>
      </div>

      {/* Totals */}
      <div className="flex flex-col items-end mb-8 space-y-2">
        <div className="flex justify-between w-full md:w-1/3 text-sm">
          <span className="font-medium text-gray-600">Subtotal</span>
          <span className="text-gray-900">{calculateSubtotal().toFixed(2)}</span>
        </div>
        <div className="flex justify-between w-full md:w-1/3 text-sm items-center">
          <span className="font-medium text-gray-600">Sales Tax (%)</span>
          <input 
            type="number" 
            value={taxRate} 
            onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
            className="w-16 text-right border-gray-300 rounded p-1 text-xs border"
          />
        </div>
        <div className="flex justify-between w-full md:w-1/3 text-sm">
          <span className="font-medium text-gray-600">Tax Amount</span>
          <span className="text-gray-900">{calculateTax().toFixed(2)}</span>
        </div>
        <div className="w-full md:w-1/3 border-t border-gray-300 my-2"></div>
        <div className="flex justify-between w-full md:w-1/3 text-lg font-bold">
          <span>TOTAL DUE</span>
          <span>{calculateTotal().toFixed(2)}</span>
        </div>
      </div>

      {/* Instructions */}
      <div className="mb-8">
        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Instructions</label>
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          rows={3}
          className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border bg-gray-50"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <button
          onClick={handleSaveAndGenerate}
          className="flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Save size={20} className="mr-2" />
          Save & Generate PDF
        </button>
      </div>
    </div>
  );
};

export default InvoiceForm;

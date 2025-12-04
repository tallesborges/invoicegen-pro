import React, { useState } from 'react';
import { LayoutDashboard, FileText, Users, Settings as SettingsIcon, PlusCircle } from 'lucide-react';
import InvoiceForm from './components/InvoiceForm';
import CompanyManager from './components/CompanyManager';
import InvoiceHistory from './components/InvoiceHistory';
import { Invoice } from './types';

type View = 'create' | 'history' | 'companies';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('create');
  const [invoiceToEdit, setInvoiceToEdit] = useState<Invoice | null>(null);

  // When duplicating or editing from history
  const handleEditInvoice = (invoice: Invoice) => {
    // We create a copy without the ID to treat it as a new draft based on old data
    // Or keep ID if we want actual editing. Let's do a "Copy to New" style for safety.
    setInvoiceToEdit({
      ...invoice,
      id: '', // Reset ID to create new
      invoiceNumber: '', // Reset number to trigger auto-gen
      date: new Date().toISOString().split('T')[0] // Reset date to today
    });
    setCurrentView('create');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'create':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-800">
                {invoiceToEdit ? 'New Invoice (From Copy)' : 'Create Invoice'}
              </h1>
            </div>
            <InvoiceForm 
              onSave={() => setCurrentView('history')} 
              existingInvoice={invoiceToEdit}
              key={invoiceToEdit ? 'edit-mode' : 'new-mode'} // Force re-mount on mode change
            />
          </div>
        );
      case 'companies':
        return <CompanyManager />;
      case 'history':
        return <InvoiceHistory onDuplicate={handleEditInvoice} />;
      default:
        return <div>Not Found</div>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100 font-sans text-gray-900">
      
      {/* Sidebar / Mobile Nav */}
      <nav className="bg-slate-900 text-white w-full md:w-64 flex-shrink-0 md:min-h-screen">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-2 font-bold text-xl">
            <FileText className="text-blue-400" />
            <span>InvoiceGen</span>
          </div>
        </div>
        <div className="p-4 space-y-2">
          <button 
            onClick={() => { setInvoiceToEdit(null); setCurrentView('create'); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentView === 'create' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            <PlusCircle size={20} />
            <span>New Invoice</span>
          </button>
          
          <button 
            onClick={() => setCurrentView('history')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentView === 'history' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            <LayoutDashboard size={20} />
            <span>History</span>
          </button>

          <button 
            onClick={() => setCurrentView('companies')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentView === 'companies' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            <Users size={20} />
            <span>Companies</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;

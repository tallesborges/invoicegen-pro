import React, { useState, useEffect } from 'react';
import { Company } from '../types';
import { StorageService } from '../services/storage';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const CompanyManager: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCompany, setCurrentCompany] = useState<Company>({
    id: '',
    name: '',
    address: '',
    phone: '',
    email: ''
  });

  useEffect(() => {
    setCompanies(StorageService.getCompanies());
  }, []);

  const handleSave = () => {
    if (!currentCompany.name) return;

    let updatedCompanies = [...companies];
    if (currentCompany.id) {
      // Update existing
      updatedCompanies = updatedCompanies.map(c => c.id === currentCompany.id ? currentCompany : c);
    } else {
      // Add new
      updatedCompanies.push({ ...currentCompany, id: uuidv4() });
    }

    StorageService.saveCompanies(updatedCompanies);
    setCompanies(updatedCompanies);
    setIsEditing(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if(confirm('Are you sure?')) {
      const updated = companies.filter(c => c.id !== id);
      StorageService.saveCompanies(updated);
      setCompanies(updated);
    }
  };

  const handleEdit = (company: Company) => {
    setCurrentCompany(company);
    setIsEditing(true);
  };

  const resetForm = () => {
    setCurrentCompany({ id: '', name: '', address: '', phone: '', email: '' });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Saved Companies</h2>
        <button 
          onClick={() => { resetForm(); setIsEditing(true); }}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          <Plus size={16} className="mr-2" /> New Company
        </button>
      </div>

      {isEditing && (
        <div className="mb-8 p-4 bg-gray-50 border rounded-lg">
          <h3 className="font-bold mb-4">{currentCompany.id ? 'Edit Company' : 'Add Company'}</h3>
          <div className="grid grid-cols-1 gap-4">
            <input
              placeholder="Company Name"
              className="p-2 border rounded"
              value={currentCompany.name}
              onChange={e => setCurrentCompany({...currentCompany, name: e.target.value})}
            />
            <textarea
              placeholder="Full Address (Multi-line)"
              className="p-2 border rounded"
              rows={3}
              value={currentCompany.address}
              onChange={e => setCurrentCompany({...currentCompany, address: e.target.value})}
            />
            <div className="grid grid-cols-2 gap-4">
               <input
                placeholder="Phone (Optional)"
                className="p-2 border rounded"
                value={currentCompany.phone}
                onChange={e => setCurrentCompany({...currentCompany, phone: e.target.value})}
              />
               <input
                placeholder="Email (Optional)"
                className="p-2 border rounded"
                value={currentCompany.email}
                onChange={e => setCurrentCompany({...currentCompany, email: e.target.value})}
              />
            </div>
            <div className="flex gap-2 justify-end mt-2">
              <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save Company</button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {companies.map(company => (
              <tr key={company.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{company.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">{company.address.split('\n')[0]}...</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleEdit(company)} className="text-blue-600 hover:text-blue-900 mr-4">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(company.id)} className="text-red-600 hover:text-red-900">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {companies.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-gray-500 text-sm">
                  No companies saved. Add one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompanyManager;

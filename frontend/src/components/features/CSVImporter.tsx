import { useState } from 'react';
import { Button } from '../ui/Button';
import toast from 'react-hot-toast';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const CSVImporter = ({ table, endpoint, onImportSuccess }: any) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImport = async () => {
    if (!file) return;
    setLoading(true);
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      const rows = text.split('\n').filter(r => r.trim());
      const headers = rows[0].split(',').map(h => h.trim());
      const token = localStorage.getItem('token');
      
      const parsedData = rows.slice(1).map(row => {
        const values = row.split(',');
        const obj: any = {};
        headers.forEach((header, idx) => {
          obj[header] = values[idx]?.trim() || '';
        });
        return obj;
      });

      try {
        const finalEndpoint = endpoint || `${API_BASE}/api/data/${table}`;
        for (const record of parsedData) {
          await fetch(finalEndpoint, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(record)
          });
        }
        toast.success('CSV Data imported to your account!');
        if(onImportSuccess) onImportSuccess();
      } catch (err) {
        toast.error('Failed to import CSV');
      } finally {
        setLoading(false);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-blue-100 w-full mb-6">
      <h2 className="text-xl font-bold mb-2 text-indigo-900">🚀 CSV Import (User-Scoped)</h2>
      <p className="text-indigo-700 mb-4 text-sm">Upload CSV files directly to your account. The engine auto-maps headers to JSONB.</p>
      <div className="flex gap-4 items-center">
        <input 
          type="file" 
          accept=".csv"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="border border-indigo-200 bg-white p-2 rounded-lg w-full max-w-sm"
        />
        <Button 
          label={loading ? 'Importing...' : 'Upload & Store'} 
          onClick={handleImport} 
          variant="primary"
        />
      </div>
    </div>
  );
};

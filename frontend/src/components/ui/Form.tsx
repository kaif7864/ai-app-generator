import { useState } from 'react';
import { DynamicRenderer } from '../DynamicRenderer';
import { Button } from './Button';
import toast from 'react-hot-toast';
import { useTranslation } from '../../context/LanguageContext';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const Form = ({ title, fields, table, submitLabel, endpoint, method, rootConfig }: any) => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  let finalFields = fields;
  if (!fields && table && rootConfig?.database?.tables) {
    const dbTable = rootConfig.database.tables.find((t: any) => t.name === table);
    if (dbTable) {
      finalFields = dbTable.fields.map((f: any) => ({
        name: f.name,
        type: f.type === 'number' ? 'number' : 'text',
        label: f.name.charAt(0).toUpperCase() + f.name.slice(1),
        required: f.required
      }));
    }
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    const token = localStorage.getItem('token');
    
    finalFields?.forEach((f: any) => {
      const val = data[f.name];
      if (f.type === 'number' && val) {
        data[f.name] = Number(val);
      }
    });

    try {
      const finalEndpoint = endpoint || `${API_BASE}/api/data/${table}`;
      const res = await fetch(finalEndpoint, {
        method: method || 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        toast.success(`Record Added`);
        (e.target as HTMLFormElement).reset();
      } else {
        const err = await res.json();
        toast.error(err.error || 'Save failed');
      }
    } catch (err) { toast.error('Connection error'); }
    finally { setLoading(false); }
  };

  return (
    <div className="glass p-10 rounded-[2.5rem] w-full max-w-xl animate-in fade-in slide-in-from-left duration-700">
      <h2 className="text-2xl font-black mb-8 tracking-tighter">
        {title || `New ${table} Entry`}
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {finalFields?.map((field: any, idx: number) => (
          <DynamicRenderer key={idx} config={{ ...field, type: 'input', label: t(field.name) }} />
        ))}
        <div className="mt-4">
          <Button label={loading ? '...' : (submitLabel || 'Save to DB')} variant="primary" className="w-full py-5 rounded-2xl" />
        </div>
      </form>
    </div>
  );
};

import { useEffect, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const CountWidget = ({ table, rootConfig }: any) => {
  const [count, setCount] = useState(0);

  const fetchCount = async () => {
    const token = localStorage.getItem('token');
    if (!table || !token) return;
    try {
      const res = await fetch(`${API_BASE}/api/data/${table}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.records) setCount(result.records.length);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchCount();
  }, [table, rootConfig?.refreshKey]);

  return (
    <div className="glass p-10 rounded-[2.5rem] flex flex-col items-center justify-center min-h-[200px] hover:scale-105 transition-all group">
      <p className="opacity-30 text-[10px] uppercase font-black tracking-[0.3em] mb-4">{table} TOTAL</p>
      <p className="text-6xl font-black text-blue-600 group-hover:drop-shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all">
        {count}
      </p>
      <div className="mt-6 w-12 h-1 bg-blue-600/20 rounded-full group-hover:w-20 transition-all"></div>
    </div>
  );
};

import { useEffect, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const Table = ({ title, columns, table, endpoint, rootConfig }: any) => {
  const [data, setData] = useState<any[]>([]);

  let finalColumns = columns;
  if (!columns && table && rootConfig?.database?.tables) {
    const dbTable = rootConfig.database.tables.find((t: any) => t.name === table);
    if (dbTable) {
      finalColumns = dbTable.fields.map((f: any) => ({
        key: f.name,
        label: f.name.charAt(0).toUpperCase() + f.name.slice(1)
      }));
    }
  }

  const finalEndpoint = endpoint || `${API_BASE}/api/data/${table}`;

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    if (!finalEndpoint || !token || finalEndpoint.includes('undefined')) return;
    try {
      const res = await fetch(finalEndpoint, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.records) setData(result.records);
    } catch (err) { console.error(err); }
  };

  // Re-fetch when endpoint OR rootConfig.refreshKey changes
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [finalEndpoint, rootConfig?.refreshKey]);

  if (!data.length) return (
    <div className="p-12 glass rounded-[2.5rem] text-center opacity-30 font-black uppercase tracking-[0.3em] text-[10px]">
      Awaiting data for "{table}"...
    </div>
  );

  return (
    <div className="glass rounded-[2.5rem] w-full overflow-hidden animate-in fade-in slide-in-from-right duration-700">
      <div className="p-10 border-b border-white/5 flex justify-between items-center">
        <h2 className="text-2xl font-black tracking-tighter">{title || `${table} Records`}</h2>
        <span className="bg-blue-600/10 text-blue-500 px-4 py-1 rounded-full text-[10px] font-black uppercase border border-blue-600/20">Live Sync</span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/[0.02] opacity-30 font-black uppercase tracking-[0.2em] text-[10px]">
            <tr>
              {finalColumns?.map((col: any) => (
                <th key={col.key} className="px-10 py-6">{col.label}</th>
              ))}
              <th className="px-10 py-6 text-right">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.map((row, i) => (
              <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                {finalColumns?.map((col: any) => (
                  <td key={col.key} className="px-10 py-6 font-medium opacity-80">{row[col.key] || '-'}</td>
                ))}
                <td className="px-10 py-6 text-right opacity-20 text-[10px] font-bold">
                  {new Date(row.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

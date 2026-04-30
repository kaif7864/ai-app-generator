import React from 'react';

export const SchemaExplorer = ({ rootConfig }: any) => {
  const tables = rootConfig?.database?.tables || [];

  if (!tables.length) return null;

  return (
    <div className="w-full bg-slate-900 p-8 rounded-[2rem] shadow-2xl border border-slate-800">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        <h2 className="text-xl font-bold text-white tracking-tight">Active Schema Explorer</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tables.map((table: any, i: number) => (
          <div key={i} className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 hover:border-blue-500 transition-all group">
            <h3 className="text-blue-400 font-black text-sm uppercase tracking-widest mb-4 group-hover:text-blue-300">
              {table.name}
            </h3>
            <div className="space-y-2">
              {table.fields.map((f: any, j: number) => (
                <div key={j} className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-300 font-mono">{f.name}</span>
                  <span className="bg-slate-700 text-slate-500 px-2 py-0.5 rounded uppercase">{f.type}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

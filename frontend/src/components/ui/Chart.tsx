import React from 'react';

export const Chart = ({ title, table }: any) => {
  const mockData = [
    { label: 'S', val: 40 }, { label: 'M', val: 30 }, { label: 'T', val: 60 },
    { label: 'W', val: 80 }, { label: 'T', val: 50 }, { label: 'F', val: 90 }, { label: 'S', val: 70 }
  ];

  return (
    <div className="glass p-10 rounded-[2.5rem] w-full animate-in zoom-in duration-700">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-2xl font-black tracking-tighter">{title || 'Data Velocity'}</h2>
        <span className="text-[10px] font-black opacity-20 uppercase tracking-widest">Entity: {table}</span>
      </div>
      <div className="flex items-end justify-between gap-4 h-48">
        {mockData.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
            <div 
              className="w-full bg-blue-600/20 rounded-xl transition-all duration-700 group-hover:bg-blue-600 relative overflow-hidden"
              style={{ height: `${d.val}%` }}
            >
               <div className="absolute inset-0 bg-gradient-to-t from-blue-600 to-transparent opacity-50"></div>
            </div>
            <span className="text-[10px] font-black opacity-20 uppercase">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

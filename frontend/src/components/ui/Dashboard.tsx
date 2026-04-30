import React from 'react';
import { DynamicRenderer } from '../DynamicRenderer';

export const Dashboard = ({ title, widgets, rootConfig }: any) => {
  // AUTO-GENERATION: If no widgets are provided, create summary counts for all tables
  let finalWidgets = widgets;
  
  if ((!widgets || widgets.length === 0) && rootConfig?.database?.tables) {
    finalWidgets = rootConfig.database.tables.map((table: any) => ({
      type: 'count',
      table: table.name,
      id: `auto-count-${table.name}`
    }));
  }

  return (
    <div className="w-full">
      {title && <h2 className="text-3xl font-black mb-10 tracking-tighter uppercase opacity-80">{title}</h2>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {finalWidgets?.map((widget: any, idx: number) => (
          <DynamicRenderer key={idx} config={widget} rootConfig={rootConfig} />
        ))}
      </div>
    </div>
  );
};

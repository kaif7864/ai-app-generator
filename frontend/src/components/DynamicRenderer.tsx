import React from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Form } from './ui/Form';
import { Table } from './ui/Table';
import { CSVImporter } from './features/CSVImporter';
import { Auth } from './ui/Auth';
import { Dashboard } from './ui/Dashboard';
import { SchemaExplorer } from './ui/SchemaExplorer';
import { Chart } from './ui/Chart';
import { CountWidget } from './ui/CountWidget';

// COMPONENT REGISTRY
const ComponentRegistry: Record<string, React.FC<any>> = {
  button: Button,
  input: Input,
  form: Form,
  table: Table,
  csv_importer: CSVImporter,
  auth: Auth,
  dashboard: Dashboard,
  schema_explorer: SchemaExplorer,
  chart: Chart,
  count: CountWidget,
};

export const DynamicRenderer = ({ config, rootConfig }: { config: any, rootConfig?: any }) => {
  if (!config) return null;

  // SMART MAPPING: Handle "pages" or "layout" or "widgets"
  const items = Array.isArray(config) ? config : (config.pages || config.layout || config.widgets);
  
  if (items && Array.isArray(items)) {
    return (
      <React.Fragment>
        {items.map((item, index) => (
          <DynamicRenderer key={item.id || index} config={item} rootConfig={rootConfig || config} />
        ))}
      </React.Fragment>
    );
  }

  // Handle single component
  const Component = ComponentRegistry[config.type];
  
  return Component ? <Component {...config} rootConfig={rootConfig} /> : (
    <div className="p-4 my-4 glass rounded-2xl border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest text-center">
      Schema Note: Component type "{config.type}" is not yet architected.
    </div>
  );
};

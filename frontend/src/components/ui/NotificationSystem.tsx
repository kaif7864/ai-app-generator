import { useState, useEffect } from 'react';

export const NotificationSystem = () => {
  const [logs, setLogs] = useState<{id: number, msg: string, time: string}[]>([]);

  useEffect(() => {
    // Mock system events
    const initialLogs = [
      { id: 1, msg: "AI App Engine Core Initialized", time: "00:01" },
      { id: 2, msg: "Database Connection Secured", time: "00:02" }
    ];
    setLogs(initialLogs);

    // Listen for custom events (we'll trigger these from other components)
    const handleEvent = (e: any) => {
      setLogs(prev => [{
        id: Date.now(),
        msg: e.detail,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }, ...prev].slice(0, 5));
    };

    window.addEventListener('app-event', handleEvent);
    return () => window.removeEventListener('app-event', handleEvent);
  }, []);

  return (
    <div className="glass p-8 rounded-[2.5rem] border border-white/5 w-full max-w-sm fixed bottom-10 right-10 z-[60] animate-in slide-in-from-right-10 duration-500">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-widest">System Activity</h3>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 opacity-20"></div>
        </div>
      </div>
      <div className="space-y-4">
        {logs.map(log => (
          <div key={log.id} className="flex gap-4 items-start animate-in fade-in slide-in-from-bottom-2 duration-300">
            <span className="text-[9px] font-mono opacity-20 mt-0.5">{log.time}</span>
            <p className="text-[11px] font-bold opacity-70 leading-tight">{log.msg}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper to trigger events
export const triggerAppEvent = (msg: string) => {
  window.dispatchEvent(new CustomEvent('app-event', { detail: msg }));
};

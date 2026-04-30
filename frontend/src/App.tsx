import { useState, useEffect } from 'react'
import { DynamicRenderer } from './components/DynamicRenderer'
import defaultAppConfig from './config/sample.json'
import { useTranslation } from './context/LanguageContext'
import { Auth } from './components/ui/Auth'
import { NotificationSystem, triggerAppEvent } from './components/ui/NotificationSystem'
import toast from 'react-hot-toast'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const { lang, setLang } = useTranslation();
  const [theme, setTheme] = useState<'light' | 'dark'>(localStorage.getItem('theme') as any || 'dark');
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem('token'));
  const [appState, setAppState] = useState<'editor' | 'preview'>('editor');
  const [configInput, setConfigInput] = useState(JSON.stringify(defaultAppConfig, null, 2));
  const [currentConfig, setCurrentConfig] = useState<any>(defaultAppConfig);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // For forcing re-fetches

  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const handleApplyConfig = async () => {
    setLoading(true);
    try {
      const parsed = JSON.parse(configInput);
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/system/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(parsed)
      });
      if (res.ok) {
        setCurrentConfig(parsed);
        setAppState('preview');
        triggerAppEvent(`Infrastructure Deployed: ${parsed.appName}`);
        toast.success('App Architecture Ready! 🚀');
      } else { 
        triggerAppEvent('System: Deployment Failed');
        const err = await res.json();
        toast.error(err.error || 'Infrastructure Generation Failed'); 
      }
    } catch (err) { 
      triggerAppEvent('Error: Invalid JSON Blueprint');
      toast.error('Invalid JSON Blueprint'); 
    }
    finally { setLoading(false); }
  };

  const fillMockData = async () => {
    setLoading(true);
    triggerAppEvent('AI: Generating smart mock data...');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/system/fill-mock-data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(currentConfig)
      });
      if (res.ok) {
        triggerAppEvent('AI: Mock data inserted successfully');
        toast.success('AI Mock Data Inserted Successfully!');
        setRefreshKey(prev => prev + 1); // Trigger re-fetch in components
      } else { 
        triggerAppEvent('AI: Mock generation failed');
        const err = await res.json();
        toast.error(err.error || 'AI Data Generation Failed'); 
      }
    } catch (err) { 
      triggerAppEvent('System: Connection Refused');
      toast.error('Connection Error'); 
    }
    finally { setLoading(false); }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { setConfigInput(ev.target?.result as string); toast.success('Blueprint Loaded!'); };
    reader.readAsText(file);
  };

  const logout = () => { localStorage.clear(); setIsAuth(false); setAppState('editor'); };

  return (
    <div className="min-h-screen flex flex-col items-center transition-all duration-500 pb-20">
      <header className="w-full h-24 px-12 flex justify-between items-center glass sticky top-0 z-50">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white italic shadow-lg shadow-blue-600/30">A</div>
            <h1 className="text-2xl font-black tracking-tighter uppercase">AI GEN <span className="text-blue-500">PRO</span></h1>
          </div>
          {appState === 'preview' && (
             <div className="flex gap-4 border-l border-white/10 pl-10">
                <button onClick={() => setAppState('editor')} className="bg-blue-600/10 text-blue-600 hover:bg-blue-600/20 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all">← Architect Mode</button>
                {currentConfig.database?.tables && (
                  <button onClick={fillMockData} disabled={loading} className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all border border-emerald-500/10">✨ AI Fill Data</button>
                )}
             </div>
          )}
        </div>
        
        <div className="flex items-center gap-6">
          <button onClick={toggleTheme} className="w-12 h-12 flex items-center justify-center rounded-2xl glass hover:scale-110 transition-all text-xl">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <div className="flex gap-1 glass p-1.5 rounded-2xl">
            <button onClick={() => setLang('en')} className={`px-4 py-1.5 rounded-xl text-[10px] font-black transition-all ${lang === 'en' ? 'bg-blue-600 text-white' : 'opacity-20'}`}>EN</button>
            <button onClick={() => setLang('hi')} className={`px-4 py-1.5 rounded-xl text-[10px] font-black transition-all ${lang === 'hi' ? 'bg-blue-600 text-white' : 'opacity-20'}`}>HI</button>
          </div>
          {isAuth && <button onClick={logout} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all font-bold">✕</button>}
        </div>
      </header>

      <main className="w-full max-w-7xl p-12 flex flex-col items-center">
        {!isAuth ? (
          <div className="mt-10 w-full flex justify-center animate-in zoom-in duration-700">
            <Auth onAuthSuccess={() => setIsAuth(true)} />
          </div>
        ) : (
          appState === 'editor' ? (
            <div className="w-full flex flex-col gap-10 animate-in slide-in-from-bottom-20 duration-1000">
              <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-6xl font-black mb-6 tracking-tighter">Blueprint Your Vision.</h2>
                <p className="opacity-40 text-xl font-medium">Generate a full-stack enterprise platform in seconds using our universal JSON engine.</p>
              </div>

              <div className="w-full flex flex-col lg:flex-row gap-10 min-h-[650px]">
                <div className="w-full lg:w-96 flex flex-col gap-8">
                  <div className="glass p-10 rounded-[3rem] flex flex-col gap-8">
                    <div>
                      <label className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] block mb-4">Project Blueprint</label>
                      <input type="file" accept=".json" onChange={handleFileUpload} className="text-xs opacity-50 bg-white/5 p-6 rounded-3xl border border-white/5 cursor-pointer w-full" />
                    </div>
                  </div>
                  <button onClick={handleApplyConfig} disabled={loading} className="w-full bg-blue-600 text-white py-8 rounded-[3rem] font-black text-2xl hover:bg-blue-500 shadow-2xl shadow-blue-600/20 transition-all disabled:opacity-50">
                    {loading ? 'ARCHITECTING...' : 'GENERATE SYSTEM ⚡'}
                  </button>
                </div>

                <div className={`flex-1 rounded-[3.5rem] overflow-hidden shadow-2xl relative border border-white/5 flex flex-col transition-all duration-500 ${theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-white'}`}>
                  <div className="h-14 bg-white/5 flex items-center px-8 gap-3 border-b border-white/5">
                    <div className="w-3 h-3 rounded-full bg-red-500/30"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/30"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/30"></div>
                    <span className="ml-6 text-[10px] font-black opacity-20 uppercase tracking-[0.4em]">blueprint_schema.json</span>
                  </div>
                  <textarea value={configInput} onChange={(e) => setConfigInput(e.target.value)} className={`w-full h-full font-mono text-sm p-10 border-none outline-none resize-none transition-colors duration-500 ${theme === 'dark' ? 'text-blue-400 bg-transparent' : 'text-slate-800 bg-slate-50/50'}`} spellCheck={false} />
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full space-y-12 animate-in slide-in-from-right-20 duration-1000">
               <div className="flex justify-between items-end p-12 glass rounded-[4rem]">
                  <div>
                    <h2 className="text-5xl font-black tracking-tighter mb-4">{currentConfig.appName}</h2>
                    <div className="flex gap-4">
                       <span className="text-[10px] font-black text-green-500 bg-green-500/10 px-4 py-1.5 rounded-full border border-green-500/20 uppercase tracking-widest">Instance Status: Production</span>
                    </div>
                  </div>
                  <div className="text-right opacity-20 text-[12px] font-black uppercase tracking-[0.5em] pb-2">Full-Stack Generated Runtime</div>
               </div>
               <div className="w-full space-y-16">
                  {/* Pass refreshKey to DynamicRenderer */}
                  <DynamicRenderer config={currentConfig} rootConfig={{ ...currentConfig, refreshKey }} />
               </div>
            </div>
          )
        )}
      </main>
      <NotificationSystem />
      <footer className="mt-auto py-12 opacity-10 text-[10px] font-black uppercase tracking-[0.6em] text-center w-full">AI Platform Architect Engine • V3.0 Enterprise</footer>
    </div>
  )
}

export default App

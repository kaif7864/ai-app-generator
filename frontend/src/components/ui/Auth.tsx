import React, { useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import toast from 'react-hot-toast';
import { supabase } from '../../supabaseClient';

export const Auth = ({ onAuthSuccess }: any) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        localStorage.setItem('token', data.session?.access_token || '');
        localStorage.setItem('user', JSON.stringify(data.user));
        toast.success('Access Granted (Supabase)');
        onAuthSuccess();
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast.success('Check your email for verification!');
        setIsLogin(true);
      }
    } catch (err: any) {
      toast.error(err.message || 'Auth Failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({ 
        provider,
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="relative group w-full max-w-md">
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[3rem] blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
      
      <div className="relative glass p-10 rounded-[3rem] shadow-2xl flex flex-col items-center border border-white/10">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl mb-8 flex items-center justify-center font-black text-2xl text-white shadow-2xl shadow-blue-500/40 italic">A</div>
        
        <h2 className="text-3xl font-black text-main text-center mb-2 tracking-tighter">
          {isLogin ? 'Nexus Cloud Login' : 'Initialize Identity'}
        </h2>
        <p className="opacity-40 text-sm mb-8 text-center font-medium">Securely managed by Supabase Infrastructure</p>

        <div className="w-full flex flex-col gap-3 mb-8">
           <button 
             onClick={() => handleSocialLogin('google')}
             className="w-full bg-white/5 border border-white/10 py-4 rounded-2xl flex items-center justify-center gap-4 hover:bg-white/10 transition-all group"
           >
             <span className="text-lg">G</span>
             <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Continue with Google</span>
           </button>
           <button 
             onClick={() => handleSocialLogin('github')}
             className="w-full bg-white/5 border border-white/10 py-4 rounded-2xl flex items-center justify-center gap-4 hover:bg-white/10 transition-all group"
           >
             <span className="text-lg">🐙</span>
             <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Continue with GitHub</span>
           </button>
        </div>

        <div className="w-full flex items-center gap-4 mb-8 opacity-20">
           <div className="flex-1 h-[1px] bg-white"></div>
           <span className="text-[9px] font-black uppercase tracking-widest">or email auth</span>
           <div className="flex-1 h-[1px] bg-white"></div>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-5">
          <Input name="email" type="email" label="Identity" required placeholder="email@nexus.io" />
          <Input name="password" type="password" label="Passcode" required placeholder="••••••••" />
          
          <div className="pt-4">
            <Button 
              label={loading ? '...' : (isLogin ? 'Sign In' : 'Sign Up')} 
              variant="primary" 
              className="w-full py-5 rounded-2xl"
            />
          </div>
        </form>

        <p className="mt-8 text-center text-[10px] opacity-30 font-black uppercase tracking-[0.2em]">
          {isLogin ? "New here?" : "Joined already?"}{' '}
          <button onClick={() => setIsLogin(!isLogin)} className="text-blue-500 hover:text-blue-400 underline">
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

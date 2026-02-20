"use client";

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import PoolBackground from '@/components/PoolBackground';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/components/SessionContextProvider';
import { Button } from '@/components/ui/button';

const Login = () => {
  const { session, loginAsGuest } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate('/dashboard');
    }
  }, [session, navigate]);

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <PoolBackground />
      <div className="z-10 w-full max-w-md bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-2xl">
        <h2 className="text-3xl font-black italic text-white text-center mb-8 uppercase tracking-tighter">
          Entrar no <span className="text-emerald-500">Clube</span>
        </h2>
        
        <div className="space-y-6">
          <Button 
            onClick={loginAsGuest}
            className="w-full bg-emerald-600 hover:bg-emerald-500 h-12 text-lg font-bold rounded-xl"
          >
            Entrar como Convidado (Dev)
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/10"></span></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-transparent px-2 text-white/40">Ou use Supabase</span></div>
          </div>

          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#10b981',
                    brandAccent: '#059669',
                    inputText: 'white',
                    inputLabelText: 'rgba(255,255,255,0.6)',
                  },
                },
              },
            }}
            theme="dark"
            providers={[]}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
"use client";

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import PoolBackground from '@/components/PoolBackground';
import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSession } from '@/components/SessionContextProvider';

const Register = () => {
  const { session } = useSession();
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
          Criar sua <span className="text-emerald-500">Conta</span>
        </h2>
        
        <Auth
          supabaseClient={supabase}
          view="sign_up"
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
          localization={{
            variables: {
              sign_up: {
                email_label: 'E-mail',
                password_label: 'Crie uma senha',
                button_label: 'Cadastrar',
                loading_button_label: 'Cadastrando...',
                social_provider_text: 'Cadastrar com {{provider}}',
                link_text: 'Já tem uma conta? Entre aqui',
              }
            }
          }}
          theme="dark"
          providers={[]}
        />

        <div className="mt-6 text-center">
          <Link to="/login" className="text-emerald-400 hover:text-emerald-300 text-sm font-bold uppercase transition-colors">
            Voltar para o Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
"use client";

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import PoolBackground from '@/components/PoolBackground';
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSession } from '@/components/SessionContextProvider';

const Login = () => {
  const { session } = useSession();
  const navigate = useNavigate();
  const [authView, setAuthView] = useState<'sign_in' | 'forgotten_password' | 'update_password'>('sign_in');

  useEffect(() => {
    // Se já estiver logado (e não estiver em processo de recuperação), vai para o dashboard
    if (session && authView !== 'update_password') {
      navigate('/dashboard');
    }

    // Detectar se o usuário veio de um link de recuperação de senha
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setAuthView('update_password');
      }
    });

    return () => subscription.unsubscribe();
  }, [session, navigate, authView]);

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <PoolBackground />
      <div className="z-10 w-full max-w-md bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-2xl">
        <h2 className="text-3xl font-black italic text-white text-center mb-8 uppercase tracking-tighter">
          {authView === 'update_password' ? (
            <>Nova <span className="text-emerald-500">Senha</span></>
          ) : authView === 'forgotten_password' ? (
            <>Recuperar <span className="text-emerald-500">Acesso</span></>
          ) : (
            <>Entrar no <span className="text-emerald-500">Clube</span></>
          )}
        </h2>
        
        <Auth
          supabaseClient={supabase}
          view={authView}
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
              sign_in: {
                email_label: 'E-mail',
                password_label: 'Senha',
                button_label: 'Entrar',
                loading_button_label: 'Entrando...',
                link_text: 'Não tem uma conta? Cadastre-se',
              },
              forgotten_password: {
                email_label: 'E-mail de recuperação',
                button_label: 'Enviar instruções',
                loading_button_label: 'Enviando...',
                link_text: 'Esqueceu sua senha?',
              },
              update_password: {
                password_label: 'Nova senha',
                button_label: 'Atualizar senha',
                loading_button_label: 'Atualizando...',
              }
            }
          }}
          theme="dark"
          providers={[]}
        />
        
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col items-center gap-4">
          {authView !== 'sign_in' ? (
            <button 
              onClick={() => setAuthView('sign_in')}
              className="text-emerald-400 hover:text-emerald-300 text-sm font-bold uppercase transition-colors"
            >
              Voltar para o Login
            </button>
          ) : (
            <Link to="/register" className="text-emerald-400 hover:text-emerald-300 text-sm font-bold uppercase transition-colors">
              Criar nova conta
            </Link>
          )}
          
          <div className="flex gap-4">
            <Link to="/legal" className="text-[10px] text-white/40 hover:text-white uppercase font-bold tracking-widest">Termos de Uso</Link>
            <Link to="/legal" className="text-[10px] text-white/40 hover:text-white uppercase font-bold tracking-widest">Privacidade</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
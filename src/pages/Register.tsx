"use client";

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import PoolBackground from '@/components/PoolBackground';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSession } from '@/components/SessionContextProvider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const Register = () => {
  const { session } = useSession();
  const navigate = useNavigate();
  const [acceptedTerms, setAcceptedTerms] = useState(false);

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
        
        <div className="mb-6 p-4 rounded-2xl bg-black/20 border border-white/5 space-y-4">
          <div className="flex items-start space-x-3">
            <Checkbox 
              id="terms" 
              checked={acceptedTerms}
              onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
              className="mt-1 border-white/40 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
            />
            <div className="grid gap-1.5 leading-none">
              <Label 
                htmlFor="terms" 
                className="text-xs font-bold text-white/80 cursor-pointer select-none uppercase tracking-tighter"
              >
                Eu li e aceito os <Link to="/legal" className="text-emerald-400 hover:underline">Termos de Uso</Link> e <Link to="/legal" className="text-emerald-400 hover:underline">Políticas</Link>
              </Label>
              <p className="text-[10px] text-white/40 font-medium">Você precisa aceitar para prosseguir.</p>
            </div>
          </div>
        </div>

        <div className={cn(
          "transition-all duration-300",
          !acceptedTerms ? "opacity-30 pointer-events-none grayscale blur-[1px]" : "opacity-100"
        )}>
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
                  link_text: 'Já tem uma conta? Entre aqui',
                }
              }
            }}
            theme="dark"
            providers={[]}
          />
        </div>

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
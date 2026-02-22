"use client";

import React from 'react';
import PoolBackground from '@/components/PoolBackground';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShieldCheck, FileText, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Legal = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen p-4 md:p-8 text-white overflow-hidden">
      <PoolBackground />
      
      <header className="z-10 relative flex items-center mb-8 max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => navigate(-1)} className="text-white hover:bg-white/10 rounded-full mr-4">
          <ArrowLeft size={24} />
        </Button>
        <h1 className="text-3xl font-black italic uppercase tracking-tighter">Documentos <span className="text-emerald-500">Legais</span></h1>
      </header>

      <main className="z-10 relative max-w-4xl mx-auto bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-10">
        <Tabs defaultValue="terms" className="space-y-8">
          <TabsList className="bg-white/5 border border-white/10 p-1 rounded-xl w-full grid grid-cols-3">
            <TabsTrigger value="terms" className="rounded-lg data-[state=active]:bg-emerald-600 font-bold uppercase text-xs">Termos</TabsTrigger>
            <TabsTrigger value="privacy" className="rounded-lg data-[state=active]:bg-emerald-600 font-bold uppercase text-xs">Privacidade</TabsTrigger>
            <TabsTrigger value="security" className="rounded-lg data-[state=active]:bg-emerald-600 font-bold uppercase text-xs">Segurança</TabsTrigger>
          </TabsList>

          <TabsContent value="terms" className="space-y-4 text-white/80 leading-relaxed text-sm">
            <div className="flex items-center gap-2 text-emerald-400 mb-4">
              <FileText size={24} />
              <h2 className="text-xl font-bold uppercase italic">Termos de Uso</h2>
            </div>
            <p>1. <strong>Aceitação:</strong> Ao utilizar o Amigos da Sinuca, você concorda em seguir todas as regras de convivência e fair play.</p>
            <p>2. <strong>Uso do Serviço:</strong> O aplicativo é destinado ao registro de partidas recreativas. O uso para apostas ilegais é terminantemente proibido.</p>
            <p>3. <strong>Dados:</strong> Você é responsável pela veracidade das informações inseridas em seu perfil e nos resultados das partidas.</p>
            <p>4. <strong>Conduta:</strong> Comportamentos ofensivos ou manipulação de resultados (cheating) resultarão na exclusão da conta sem aviso prévio.</p>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-4 text-white/80 leading-relaxed text-sm">
            <div className="flex items-center gap-2 text-emerald-400 mb-4">
              <Lock size={24} />
              <h2 className="text-xl font-bold uppercase italic">Política de Privacidade</h2>
            </div>
            <p>1. <strong>Coleta de Dados:</strong> Coletamos seu e-mail, nome/apelido e fotos para identificação no ranking do clube.</p>
            <p>2. <strong>Uso:</strong> Seus dados são utilizados exclusivamente para o funcionamento do ranking e histórico de partidas.</p>
            <p>3. <strong>Visibilidade:</strong> Seu nome, foto e estatísticas de jogo são públicos para todos os membros autenticados do clube.</p>
            <p>4. <strong>Exclusão:</strong> Você pode solicitar a exclusão de sua conta e dados associados a qualquer momento através do suporte.</p>
          </TabsContent>

          <TabsContent value="security" className="space-y-4 text-white/80 leading-relaxed text-sm">
            <div className="flex items-center gap-2 text-emerald-400 mb-4">
              <ShieldCheck size={24} />
              <h2 className="text-xl font-bold uppercase italic">Segurança</h2>
            </div>
            <p>1. <strong>Proteção:</strong> Utilizamos o Supabase (by Google Cloud/AWS) para armazenamento seguro de dados e autenticação criptografada.</p>
            <p>2. <strong>Acesso:</strong> Nunca compartilhe sua senha. O clube nunca solicitará sua senha por e-mail ou mensagens externas.</p>
            <p>3. <strong>Integridade:</strong> Implementamos políticas de Row Level Security (RLS) para garantir que apenas você possa alterar seus dados pessoais.</p>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Legal;
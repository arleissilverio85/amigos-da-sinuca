"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PoolBackground from '@/components/PoolBackground';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Swords, Trophy, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const MatchResult = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchMatch = async () => {
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          p1a:player1_a(*),
          p2a:player2_a(*),
          p1b:player1_b(*),
          p2b:player2_b(*)
        `)
        .eq('id', id)
        .single();

      if (error) {
        toast.error("Partida não encontrada");
        navigate('/dashboard');
      } else {
        setMatch(data);
      }
      setLoading(false);
    };

    fetchMatch();
  }, [id, navigate]);

  const handleFinishMatch = async (winner: 'a' | 'b') => {
    if (match.status !== 'pending') {
      toast.error("Esta partida já foi finalizada!");
      return;
    }

    setUpdating(true);
    toast.loading("Registrando vitória...");

    try {
      // 1. Atualizar a partida
      const { error: matchError } = await supabase
        .from('matches')
        .update({ status: 'finished', winner_side: winner })
        .eq('id', id);

      if (matchError) throw matchError;

      // 2. Atualizar perfis (lógica simplificada de pontos)
      const winners = winner === 'a' ? [match.player1_a, match.player2_a] : [match.player1_b, match.player2_b];
      const losers = winner === 'a' ? [match.player1_b, match.player2_b] : [match.player1_a, match.player2_a];

      for (const pid of winners.filter(Boolean)) {
        const { data: p } = await supabase.from('profiles').select('wins, matches, points').eq('id', pid).single();
        await supabase.from('profiles').update({ 
          wins: (p?.wins || 0) + 1, 
          matches: (p?.matches || 0) + 1,
          points: (p?.points || 0) + 50
        }).eq('id', pid);
      }

      for (const pid of losers.filter(Boolean)) {
        const { data: p } = await supabase.from('profiles').select('losses, matches, points').eq('id', pid).single();
        await supabase.from('profiles').update({ 
          losses: (p?.losses || 0) + 1, 
          matches: (p?.matches || 0) + 1,
          points: Math.max(0, (p?.points || 0) - 20)
        }).eq('id', pid);
      }

      toast.dismiss();
      toast.success("Resultado registrado com sucesso!");
      navigate('/dashboard');
    } catch (err: any) {
      toast.dismiss();
      toast.error("Erro ao salvar: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="animate-spin text-emerald-500" size={48} />
      </div>
    );
  }

  const PlayerSlot = ({ player, side }: { player: any, side: 'a' | 'b' }) => (
    <div className={cn(
      "flex items-center gap-4 p-4 rounded-2xl border bg-white/5",
      side === 'a' ? "border-emerald-500/20" : "border-red-500/20"
    )}>
      <Avatar className="w-12 h-12">
        <AvatarImage src={player?.photo || ''} />
        <AvatarFallback className="bg-white/10"><User /></AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <p className="font-bold uppercase italic tracking-tighter">{player?.name || 'Vazio'}</p>
        <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{player?.points} Pts</p>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen p-4 md:p-8 text-white">
      <PoolBackground />
      
      <header className="z-10 relative flex items-center mb-12 max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => navigate('/dashboard')} className="text-white hover:bg-white/10 rounded-full mr-4">
          <ArrowLeft size={24} />
        </Button>
        <h1 className="text-3xl font-black italic uppercase tracking-tighter">Gerenciar <span className="text-emerald-500">Partida</span></h1>
      </header>

      <main className="z-10 relative max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8 items-center mb-12">
          
          <div className="space-y-4">
            <h3 className="text-center text-xs font-black uppercase text-emerald-500/60 tracking-widest mb-4">Time A</h3>
            <PlayerSlot player={match.p1a} side="a" />
            {match.mode === 'doubles' && <PlayerSlot player={match.p2a} side="a" />}
            
            {match.status === 'pending' && (
              <Button 
                onClick={() => handleFinishMatch('a')}
                disabled={updating}
                className="w-full bg-emerald-600 hover:bg-emerald-500 h-16 text-xl font-black italic uppercase rounded-2xl shadow-xl shadow-emerald-900/20"
              >
                VENCEU!
              </Button>
            )}
            {match.winner_side === 'a' && (
              <div className="bg-yellow-500/20 border border-yellow-500/50 p-4 rounded-2xl flex items-center justify-center gap-2 text-yellow-500 font-black italic uppercase">
                <Trophy size={20} /> VENCEDOR
              </div>
            )}
          </div>

          <div className="flex flex-col items-center justify-center py-4">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
              <Swords size={32} className="text-white/20" />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-center text-xs font-black uppercase text-red-500/60 tracking-widest mb-4">Time B</h3>
            <PlayerSlot player={match.p1b} side="b" />
            {match.mode === 'doubles' && <PlayerSlot player={match.p2b} side="b" />}

            {match.status === 'pending' && (
              <Button 
                onClick={() => handleFinishMatch('b')}
                disabled={updating}
                className="w-full bg-red-600 hover:bg-red-500 h-16 text-xl font-black italic uppercase rounded-2xl shadow-xl shadow-red-900/20"
              >
                VENCEU!
              </Button>
            )}
            {match.winner_side === 'b' && (
              <div className="bg-yellow-500/20 border border-yellow-500/50 p-4 rounded-2xl flex items-center justify-center gap-2 text-yellow-500 font-black italic uppercase">
                <Trophy size={20} /> VENCEDOR
              </div>
            )}
          </div>
        </div>

        {match.status === 'finished' && (
          <div className="text-center py-12 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl">
            <CheckCircle2 size={64} className="text-emerald-500 mx-auto mb-4" />
            <h2 className="text-3xl font-black italic uppercase mb-2">Partida Finalizada</h2>
            <p className="text-white/40 font-bold uppercase tracking-widest text-sm">Os pontos já foram distribuídos aos atletas.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default MatchResult;
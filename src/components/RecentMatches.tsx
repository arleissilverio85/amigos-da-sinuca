"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Swords, Calendar, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface RecentMatchProps {
  matches: any[];
}

const RecentMatches = ({ matches }: RecentMatchProps) => {
  const navigate = useNavigate();

  if (matches.length === 0) {
    return (
      <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
        <Swords className="mx-auto text-white/10 mb-4" size={48} />
        <p className="text-white/40 font-bold uppercase tracking-tighter italic">Nenhuma partida registrada ainda</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {matches.map((match) => {
        const isPending = match.status === 'pending';
        
        return (
          <Card 
            key={match.id} 
            onClick={() => navigate(`/match/${match.id}`)}
            className="bg-white/5 border-white/10 hover:bg-white/10 hover:border-emerald-500/50 transition-all overflow-hidden cursor-pointer group"
          >
            <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "p-3 rounded-full transition-colors",
                  isPending ? "bg-emerald-500/20 text-emerald-500" : "bg-white/10 text-white/40"
                )}>
                  <Swords size={20} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-black italic uppercase text-xs tracking-tighter">
                      {match.mode === 'doubles' ? 'Duplas' : '1 vs 1'}
                    </span>
                    <span className={cn(
                      "text-[8px] px-1.5 py-0.5 rounded font-black uppercase",
                      isPending ? "bg-emerald-500 text-white animate-pulse" : "bg-white/10 text-white/40"
                    )}>
                      {isPending ? "Em Aberto" : "Finalizada"}
                    </span>
                  </div>
                  
                  <div className="text-sm font-bold uppercase italic tracking-tighter">
                    <span className="text-emerald-400">
                      {match.p1a?.name} {match.p2a?.name ? `& ${match.p2a.name}` : ''}
                    </span>
                    <span className="mx-2 text-white/20">VS</span>
                    <span className="text-red-400">
                      {match.p1b?.name} {match.p2b?.name ? `& ${match.p2b.name}` : ''}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-0 pt-3 md:pt-0 border-white/5">
                <div className="text-left md:text-right">
                  <div className="flex items-center gap-1 text-white/40 text-[10px] font-bold uppercase">
                    <Calendar size={10} />
                    {format(new Date(match.created_at), "dd/MM 'às' HH:mm", { locale: ptBR })}
                  </div>
                  {match.winner_side && (
                    <p className="text-[10px] font-black uppercase text-yellow-500 mt-1 italic">
                      Vencedor: Time {match.winner_side.toUpperCase()}
                    </p>
                  )}
                </div>
                <ChevronRight size={20} className="text-white/20 group-hover:text-emerald-500 transition-colors" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default RecentMatches;
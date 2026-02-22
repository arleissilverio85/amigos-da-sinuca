"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Swords, Calendar, ChevronRight, XCircle, CheckCircle2, Clock } from 'lucide-react';
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
        <p className="text-white/40 font-bold uppercase tracking-tighter italic">Nenhuma partida registrada</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {matches.map((match) => {
        const isPending = match.status === 'pending';
        const isCancelled = match.status === 'cancelled';
        const isFinished = match.status === 'finished';
        
        return (
          <Card 
            key={match.id} 
            onClick={() => navigate(`/match/${match.id}`)}
            className={cn(
              "bg-white/5 border-white/10 hover:bg-white/10 transition-all overflow-hidden cursor-pointer group",
              isCancelled ? "hover:border-red-500/50" : "hover:border-emerald-500/50"
            )}
          >
            <CardContent className="p-3 md:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2.5 rounded-full shrink-0",
                  isPending && "bg-emerald-500/20 text-emerald-500",
                  isCancelled && "bg-red-500/20 text-red-500",
                  isFinished && "bg-white/10 text-white/30"
                )}>
                  {isPending && <Clock size={18} className="animate-pulse" />}
                  {isCancelled && <XCircle size={18} />}
                  {isFinished && <CheckCircle2 size={18} />}
                </div>
                
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-black italic uppercase text-[10px] tracking-tighter text-white/60">
                      {match.mode === 'doubles' ? 'Duplas' : '1 vs 1'}
                    </span>
                    {isPending && (
                      <span className="text-[8px] px-1.5 py-0.5 rounded bg-emerald-500 text-white font-black uppercase animate-pulse">
                        Ao Vivo
                      </span>
                    )}
                    {isCancelled && (
                      <span className="text-[8px] px-1.5 py-0.5 rounded bg-red-600 text-white font-black uppercase">
                        Cancelada
                      </span>
                    )}
                  </div>
                  
                  <div className={cn(
                    "text-xs md:text-sm font-black uppercase italic tracking-tighter truncate",
                    isCancelled && "opacity-50"
                  )}>
                    <span className="text-emerald-400">
                      {match.p1a?.name}
                    </span>
                    <span className="mx-1.5 text-white/20">VS</span>
                    <span className="text-red-400">
                      {match.p1b?.name}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-0 pt-2 md:pt-0 border-white/5">
                <div className="text-left md:text-right">
                  <div className="flex items-center gap-1 text-white/30 text-[9px] font-bold uppercase tracking-widest">
                    <Calendar size={10} />
                    {format(new Date(match.created_at), "dd/MM HH:mm", { locale: ptBR })}
                  </div>
                </div>
                <ChevronRight size={18} className={cn(
                  "transition-colors",
                  isCancelled ? "group-hover:text-red-500" : "group-hover:text-emerald-500"
                )} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default RecentMatches;
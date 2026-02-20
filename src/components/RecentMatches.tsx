"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Swords, Trophy, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface RecentMatchProps {
  matches: any[];
}

const RecentMatches = ({ matches }: RecentMatchProps) => {
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
      {matches.map((match) => (
        <Card key={match.id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-all overflow-hidden">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-emerald-500/20 p-3 rounded-full">
                <Swords size={20} className="text-emerald-500" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black italic uppercase text-sm">
                    {match.mode === 'doubles' ? 'Duplas' : '1 vs 1'}
                  </span>
                  <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded font-black uppercase">
                    Ativa
                  </span>
                </div>
                <div className="flex items-center gap-1 text-white/40 text-[10px] font-bold uppercase mt-1">
                  <Calendar size={10} />
                  {format(new Date(match.created_at), "dd 'de' MMMM", { locale: ptBR })}
                </div>
              </div>
            </div>

            <div className="text-right">
              <p className="text-[10px] text-white/40 uppercase font-black mb-1">Status</p>
              <p className="text-xs font-bold text-emerald-400 uppercase italic">Aguardando Resultado</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RecentMatches;
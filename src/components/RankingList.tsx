"use client";

import React, { useState } from 'react';
import { Player } from '@/utils/mockPlayers';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User, Trophy, Medal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RankingListProps {
  players: Player[];
}

const RankingList = ({ players }: RankingListProps) => {
  const [activePlayerId, setActivePlayerId] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {players.map((player, index) => {
        const rank = index + 1;
        const isTop3 = rank <= 3;
        const isActive = activePlayerId === player.id;

        return (
          <div 
            key={player.id}
            onPointerDown={() => setActivePlayerId(player.id)}
            onPointerUp={() => setActivePlayerId(null)}
            onPointerLeave={() => setActivePlayerId(null)}
            className={cn(
              "flex items-center gap-4 p-5 rounded-3xl border transition-all duration-300 cursor-pointer select-none",
              player.isCurrentUser 
                ? "bg-emerald-600/30 border-emerald-400 shadow-xl shadow-emerald-900/40" 
                : "bg-white/5 border-white/10 hover:bg-white/10",
              isActive && "scale-[1.02] bg-white/20 border-emerald-500 ring-4 ring-emerald-500/20"
            )}
          >
            {/* Posição no Ranking */}
            <div className="flex items-center justify-center w-10 font-black italic text-2xl">
              {rank === 1 && <Medal className="text-yellow-400" size={32} />}
              {rank === 2 && <Medal className="text-slate-200" size={32} />}
              {rank === 3 && <Medal className="text-amber-600" size={32} />}
              {rank > 3 && <span className="text-white/40">#{rank}</span>}
            </div>

            {/* Foto do Jogador */}
            <Avatar className={cn(
              "w-16 h-16 border-4 transition-transform duration-300",
              isTop3 ? "border-emerald-500" : "border-white/10",
              isActive && "scale-110"
            )}>
              <AvatarImage src={player.photo || ''} />
              <AvatarFallback className="bg-white/10">
                <User size={32} />
              </AvatarFallback>
            </Avatar>

            {/* Nome e Info de Partidas */}
            <div className="flex-1 overflow-hidden">
              <div className="flex items-center gap-2 mb-1">
                <h3 className={cn(
                  "font-black uppercase italic tracking-tighter truncate transition-all duration-300",
                  isActive ? "text-2xl" : "text-lg"
                )}>
                  {player.name}
                </h3>
                {player.isCurrentUser && (
                  <span className="bg-emerald-500 text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest">Você</span>
                )}
              </div>
              
              <div className={cn(
                "flex flex-wrap gap-x-3 gap-y-1 text-white/60 font-bold uppercase tracking-widest transition-all duration-300",
                isActive ? "text-lg text-white" : "text-xs"
              )}>
                <span className="flex items-center gap-1">
                  <span className="text-emerald-400">{player.wins}</span> Vitórias
                </span>
                <span className="text-white/20">•</span>
                <span>{player.matches} Partidas</span>
              </div>
            </div>

            {/* Pontuação */}
            <div className="text-right flex flex-col items-end">
              <div className={cn(
                "flex items-center gap-2 text-emerald-400 font-black italic transition-all duration-300",
                isActive ? "text-5xl" : "text-2xl"
              )}>
                {!isActive && <Trophy size={20} className="text-yellow-500" />}
                {player.points}
              </div>
              <p className={cn(
                "text-white/40 uppercase font-bold tracking-tighter transition-all duration-300",
                isActive ? "text-sm text-emerald-500 mt-1" : "text-[10px]"
              )}>
                Pontos Ganhos
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RankingList;
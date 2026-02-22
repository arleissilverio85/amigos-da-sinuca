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
    <div className="space-y-3">
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
              "flex items-center gap-3 p-4 rounded-2xl border transition-all duration-300 cursor-pointer select-none overflow-hidden",
              player.isCurrentUser 
                ? "bg-emerald-600/30 border-emerald-400 shadow-lg" 
                : "bg-white/5 border-white/10 hover:bg-white/10",
              isActive && "scale-[1.01] bg-white/15 border-emerald-500 ring-2 ring-emerald-500/20"
            )}
          >
            {/* Posição no Ranking */}
            <div className="flex items-center justify-center w-8 shrink-0 font-black italic text-xl">
              {rank === 1 && <Medal className="text-yellow-400" size={28} />}
              {rank === 2 && <Medal className="text-slate-300" size={28} />}
              {rank === 3 && <Medal className="text-amber-600" size={28} />}
              {rank > 3 && <span className="text-white/30 text-sm">#{rank}</span>}
            </div>

            {/* Foto do Jogador */}
            <Avatar className={cn(
              "w-12 h-12 border-2 shrink-0 transition-transform duration-300",
              isTop3 ? "border-emerald-500" : "border-white/10",
              isActive && "scale-110"
            )}>
              <AvatarImage src={player.photo || ''} />
              <AvatarFallback className="bg-white/10">
                <User size={24} />
              </AvatarFallback>
            </Avatar>

            {/* Nome e Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <h3 className={cn(
                  "font-black uppercase italic tracking-tighter truncate transition-all duration-300 leading-tight",
                  isActive ? "text-xl text-emerald-400" : "text-base"
                )}>
                  {player.name}
                </h3>
                {player.isCurrentUser && !isActive && (
                  <span className="bg-emerald-500 text-[8px] px-1.5 py-0.5 rounded-full font-black uppercase shrink-0">Você</span>
                )}
              </div>
              
              <div className={cn(
                "flex flex-wrap items-center gap-x-2 text-white/50 font-bold uppercase tracking-widest transition-all duration-300",
                isActive ? "text-sm text-white" : "text-[10px]"
              )}>
                <span className="flex items-center gap-1">
                  <span className="text-emerald-400">{player.wins}</span>V
                </span>
                <span className="opacity-20">|</span>
                <span>{player.matches} Jogos</span>
              </div>
            </div>

            {/* Pontuação */}
            <div className="text-right shrink-0">
              <div className={cn(
                "flex items-center justify-end gap-1 text-emerald-400 font-black italic transition-all duration-300",
                isActive ? "text-3xl" : "text-lg"
              )}>
                {!isActive && <Trophy size={14} className="text-yellow-500" />}
                {player.points}
              </div>
              <p className={cn(
                "text-white/30 uppercase font-black tracking-tighter transition-all duration-300",
                isActive ? "text-[10px] text-emerald-500" : "text-[8px]"
              )}>
                Pontos
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RankingList;
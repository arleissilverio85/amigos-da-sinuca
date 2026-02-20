"use client";

import React from 'react';
import { Player } from '@/utils/mockPlayers';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User, Trophy, Medal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RankingListProps {
  players: Player[];
}

const RankingList = ({ players }: RankingListProps) => {
  return (
    <div className="space-y-3">
      {players.map((player, index) => {
        const rank = index + 1;
        const isTop3 = rank <= 3;

        return (
          <div 
            key={player.id}
            className={cn(
              "flex items-center gap-4 p-4 rounded-2xl border transition-all",
              player.isCurrentUser 
                ? "bg-emerald-600/20 border-emerald-500 shadow-lg shadow-emerald-900/20" 
                : "bg-white/5 border-white/10 hover:bg-white/10"
            )}
          >
            <div className="flex items-center justify-center w-8 font-black italic text-xl">
              {rank === 1 && <Medal className="text-yellow-500" size={24} />}
              {rank === 2 && <Medal className="text-slate-300" size={24} />}
              {rank === 3 && <Medal className="text-amber-700" size={24} />}
              {rank > 3 && <span className="text-white/40">#{rank}</span>}
            </div>

            <Avatar className={cn(
              "w-12 h-12 border-2",
              isTop3 ? "border-emerald-500" : "border-white/10"
            )}>
              <AvatarImage src={player.photo || ''} />
              <AvatarFallback className="bg-white/10">
                <User size={20} />
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold uppercase italic tracking-tighter">
                  {player.name}
                </h3>
                {player.isCurrentUser && (
                  <span className="bg-emerald-500 text-[8px] px-1.5 py-0.5 rounded font-black uppercase">Você</span>
                )}
              </div>
              <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">
                {player.wins} Vitórias • {player.matches} Partidas
              </p>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-1 justify-end text-emerald-400 font-black italic text-lg">
                <Trophy size={14} />
                {player.points}
              </div>
              <p className="text-[10px] text-white/40 uppercase">Pontos</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RankingList;
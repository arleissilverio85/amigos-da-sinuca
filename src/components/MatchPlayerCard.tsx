"use client";

import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { User, Trophy, Swords, Skull } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MatchPlayerCardProps {
  player: any;
  label: string;
  isOpponent?: boolean;
  onSelectClick?: () => void;
}

const MatchPlayerCard = ({ player, label, isOpponent, onSelectClick }: MatchPlayerCardProps) => {
  if (!player && isOpponent) {
    return (
      <div 
        onClick={onSelectClick}
        className="flex flex-col items-center justify-center p-8 rounded-3xl border-2 border-dashed border-white/20 bg-white/5 hover:bg-white/10 hover:border-emerald-500/50 transition-all cursor-pointer group h-full min-h-[350px]"
      >
        <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <User size={48} className="text-white/20" />
        </div>
        <p className="text-emerald-400 font-black italic uppercase tracking-tighter text-xl">Selecionar Adversário</p>
        <p className="text-white/40 text-sm mt-2">Clique para abrir a lista</p>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex flex-col items-center p-8 rounded-3xl border backdrop-blur-xl h-full min-h-[350px] transition-all",
      isOpponent ? "bg-red-500/5 border-red-500/20" : "bg-emerald-500/5 border-emerald-500/20"
    )}>
      <span className={cn(
        "px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6",
        isOpponent ? "bg-red-500 text-white" : "bg-emerald-500 text-white"
      )}>
        {label}
      </span>

      <Avatar className={cn(
        "w-32 h-32 border-4 mb-6",
        isOpponent ? "border-red-500/30" : "border-emerald-500/30"
      )}>
        <AvatarImage src={player?.photo || ''} />
        <AvatarFallback className="bg-white/10">
          <User size={48} />
        </AvatarFallback>
      </Avatar>

      <h3 className="text-2xl font-black italic uppercase text-center mb-8 tracking-tighter">
        {player?.name || 'Jogador'}
      </h3>

      <div className="grid grid-cols-2 gap-4 w-full">
        <div className="bg-white/5 p-3 rounded-xl text-center">
          <p className="text-[10px] text-white/40 uppercase font-bold mb-1">Vitórias</p>
          <p className="text-xl font-black text-emerald-400 italic">{player?.wins || 0}</p>
        </div>
        <div className="bg-white/5 p-3 rounded-xl text-center">
          <p className="text-[10px] text-white/40 uppercase font-bold mb-1">Derrotas</p>
          <p className="text-xl font-black text-red-400 italic">{player?.losses || 0}</p>
        </div>
        <div className="col-span-2 bg-emerald-500/10 p-3 rounded-xl text-center border border-emerald-500/20">
          <p className="text-[10px] text-emerald-400 uppercase font-bold mb-1">Total de Pontos</p>
          <div className="flex items-center justify-center gap-2">
            <Trophy size={16} className="text-yellow-500" />
            <p className="text-2xl font-black italic">{player?.points || 0}</p>
          </div>
        </div>
      </div>

      {isOpponent && (
        <Button 
          variant="ghost" 
          onClick={onSelectClick}
          className="mt-6 text-white/40 hover:text-white hover:bg-white/5 text-xs uppercase font-bold"
        >
          Trocar Adversário
        </Button>
      )}
    </div>
  );
};

export default MatchPlayerCard;
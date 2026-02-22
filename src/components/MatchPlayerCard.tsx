"use client";

import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { User, Trophy, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MatchPlayerCardProps {
  player: any;
  label: string;
  isOpponent?: boolean;
  onSelectClick?: () => void;
}

const MatchPlayerCard = ({ player, label, isOpponent, onSelectClick }: MatchPlayerCardProps) => {
  // Se não houver jogador selecionado, mostra o estado de seleção (botão de adicionar)
  if (!player) {
    return (
      <div 
        onClick={onSelectClick}
        className={cn(
          "flex flex-col items-center justify-center p-6 rounded-3xl border-2 border-dashed bg-white/5 transition-all cursor-pointer group h-full min-h-[220px] md:min-h-[350px]",
          isOpponent 
            ? "border-red-500/20 hover:border-red-500/50 hover:bg-red-500/5" 
            : "border-emerald-500/20 hover:border-emerald-500/50 hover:bg-emerald-500/5"
        )}
      >
        <span className={cn(
          "px-3 py-0.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-6",
          isOpponent ? "bg-red-500/20 text-red-400" : "bg-emerald-500/20 text-emerald-400"
        )}>
          {label}
        </span>
        
        <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <UserPlus size={32} className="text-white/20 md:hidden" />
          <UserPlus size={48} className="text-white/20 hidden md:block" />
        </div>
        
        <p className={cn(
          "font-black italic uppercase tracking-tighter text-lg md:text-xl",
          isOpponent ? "text-red-400" : "text-emerald-400"
        )}>
          Selecionar
        </p>
        <p className="text-white/40 text-xs mt-1">Toque para buscar</p>
      </div>
    );
  }

  // Estado com jogador selecionado
  return (
    <div className={cn(
      "flex flex-col items-center p-6 md:p-8 rounded-3xl border backdrop-blur-xl h-full min-h-[220px] md:min-h-[350px] transition-all relative overflow-hidden",
      isOpponent ? "bg-red-500/5 border-red-500/20" : "bg-emerald-500/5 border-emerald-500/20"
    )}>
      <span className={cn(
        "px-3 py-0.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-4 md:mb-6",
        isOpponent ? "bg-red-500 text-white" : "bg-emerald-500 text-white"
      )}>
        {label}
      </span>

      <Avatar className={cn(
        "w-20 h-20 md:w-32 md:h-32 border-2 md:border-4 mb-4 md:mb-6",
        isOpponent ? "border-red-500/30" : "border-emerald-500/30"
      )}>
        <AvatarImage src={player?.photo || ''} />
        <AvatarFallback className="bg-white/10">
          <User size={32} className="md:hidden" />
          <User size={48} className="hidden md:block" />
        </AvatarFallback>
      </Avatar>

      <h3 className="text-xl md:text-2xl font-black italic uppercase text-center mb-4 md:mb-8 tracking-tighter truncate w-full px-2">
        {player?.name || 'Jogador'}
      </h3>

      <div className="grid grid-cols-2 gap-2 md:gap-4 w-full mt-auto">
        <div className="bg-white/5 p-2 md:p-3 rounded-xl text-center border border-white/5">
          <p className="text-[8px] md:text-[10px] text-white/40 uppercase font-bold mb-0.5">V</p>
          <p className="text-base md:text-xl font-black text-emerald-400 italic">{player?.wins || 0}</p>
        </div>
        <div className="bg-white/5 p-2 md:p-3 rounded-xl text-center border border-white/5">
          <p className="text-[8px] md:text-[10px] text-white/40 uppercase font-bold mb-0.5">D</p>
          <p className="text-base md:text-xl font-black text-red-400 italic">{player?.losses || 0}</p>
        </div>
        <div className="col-span-2 bg-white/5 p-2 md:p-3 rounded-xl text-center border border-white/5">
          <div className="flex items-center justify-center gap-1.5">
            <Trophy size={14} className="text-yellow-500" />
            <p className="text-lg md:text-2xl font-black italic">{player?.points || 0}</p>
          </div>
        </div>
      </div>

      {/* Botão de troca para jogadores selecionados (exceto o próprio usuário logado) */}
      {onSelectClick && (
        <Button 
          variant="ghost" 
          onClick={onSelectClick}
          className="mt-4 md:mt-6 h-8 text-white/30 hover:text-white hover:bg-white/5 text-[10px] uppercase font-black"
        >
          Trocar Atleta
        </Button>
      )}
    </div>
  );
};

export default MatchPlayerCard;
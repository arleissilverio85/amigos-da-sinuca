"use client";

import React, { useState, useEffect } from 'react';
import PoolBackground from '@/components/PoolBackground';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Swords, Search, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MatchPlayerCard from '@/components/MatchPlayerCard';
import { generateMockPlayers, Player } from '@/utils/mockPlayers';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const NewMatch = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [opponent, setOpponent] = useState<Player | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('player_profile');
    const profile = saved ? JSON.parse(saved) : { name: 'Você', wins: 0, losses: 0, points: 0, photo: null };
    setCurrentUser(profile);
    
    // Pegamos a lista de jogadores excluindo o perfil atual
    const allPlayers = generateMockPlayers(profile).filter(p => !p.isCurrentUser);
    setPlayers(allPlayers);
  }, []);

  const filteredPlayers = players.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectOpponent = (player: Player) => {
    setOpponent(player);
    setIsSelectOpen(false);
  };

  return (
    <div className="relative min-h-screen p-4 md:p-8 text-white overflow-x-hidden">
      <PoolBackground />
      
      <header className="z-10 relative flex items-center mb-12 max-w-6xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/dashboard')}
          className="text-white hover:bg-white/10 rounded-full mr-4"
        >
          <ArrowLeft size={24} />
        </Button>
        <h1 className="text-3xl font-black italic uppercase tracking-tighter">Preparar <span className="text-emerald-500">Duelo</span></h1>
      </header>

      <main className="z-10 relative max-w-6xl mx-auto flex flex-col items-center">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8 items-center w-full">
          {/* Usuário Atual */}
          <div className="animate-in fade-in slide-in-from-left-8 duration-700">
            <MatchPlayerCard player={currentUser} label="Seu Perfil" />
          </div>

          {/* VS Icon */}
          <div className="flex flex-col items-center justify-center gap-4 py-8 lg:py-0">
            <div className="w-20 h-20 rounded-full bg-emerald-600 flex items-center justify-center shadow-2xl shadow-emerald-900/40 border-4 border-slate-950 z-20 animate-bounce">
              <Swords size={40} className="text-white" />
            </div>
            <div className="h-px w-32 bg-gradient-to-r from-transparent via-white/20 to-transparent lg:h-32 lg:w-px" />
          </div>

          {/* Adversário */}
          <div className="animate-in fade-in slide-in-from-right-8 duration-700">
            <MatchPlayerCard 
              player={opponent} 
              label="Adversário" 
              isOpponent 
              onSelectClick={() => setIsSelectOpen(true)}
            />
          </div>
        </div>

        {opponent && (
          <Button 
            className="mt-12 h-16 px-12 bg-emerald-600 hover:bg-emerald-500 text-2xl font-black italic uppercase rounded-2xl shadow-2xl shadow-emerald-900/40 animate-in fade-in zoom-in duration-500"
          >
            Começar Partida
          </Button>
        )}
      </main>

      {/* Modal de Seleção de Adversário */}
      <Dialog open={isSelectOpen} onOpenChange={setIsSelectOpen}>
        <DialogContent className="bg-slate-900 border-white/10 text-white max-w-md p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter">Escolha seu <span className="text-emerald-500">Oponente</span></DialogTitle>
          </DialogHeader>
          
          <div className="px-6 pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              <Input 
                placeholder="Procurar jogador..."
                className="bg-white/5 border-white/10 pl-10 h-12"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <ScrollArea className="h-[400px] px-6 pb-6">
            <div className="space-y-2">
              {filteredPlayers.map(player => (
                <div 
                  key={player.id}
                  onClick={() => handleSelectOpponent(player)}
                  className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-emerald-600/20 hover:border-emerald-500/50 transition-all cursor-pointer group"
                >
                  <Avatar className="w-12 h-12 border border-white/10">
                    <AvatarImage src={player.photo || ''} />
                    <AvatarFallback className="bg-white/10">
                      <User size={20} />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-bold uppercase italic tracking-tighter group-hover:text-emerald-400 transition-colors">{player.name}</p>
                    <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">{player.points} Pontos • {player.wins} Vitórias</p>
                  </div>
                  <div className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Swords size={20} />
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewMatch;
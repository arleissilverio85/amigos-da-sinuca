"use client";

import React, { useState, useEffect } from 'react';
import PoolBackground from '@/components/PoolBackground';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Swords, Search, User, Users, UserPlus, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MatchPlayerCard from '@/components/MatchPlayerCard';
import { Player } from '@/utils/mockPlayers';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/components/SessionContextProvider';
import { toast } from 'sonner';

type SlotType = 'partner' | 'opponent1' | 'opponent2';

const NewMatch = () => {
  const navigate = useNavigate();
  const { session } = useSession();
  const [matchMode, setMatchMode] = useState<'solo' | 'doubles'>('solo');
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const [partner, setPartner] = useState<Player | null>(null);
  const [opponent1, setOpponent1] = useState<Player | null>(null);
  const [opponent2, setOpponent2] = useState<Player | null>(null);
  
  const [dbPlayers, setDbPlayers] = useState<Player[]>([]);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [activeSlot, setActiveSlot] = useState<SlotType | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!session?.user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      setCurrentUser({ ...profile, isCurrentUser: true });

      const { data: allPlayers } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', session.user.id);

      if (allPlayers) {
        setDbPlayers(allPlayers);
      }
      setLoading(false);
    };

    loadData();
  }, [session]);

  const openSelector = (slot: SlotType) => {
    setActiveSlot(slot);
    setIsSelectOpen(true);
  };

  const handleSelectPlayer = (player: Player) => {
    if (activeSlot === 'partner') setPartner(player);
    if (activeSlot === 'opponent1') setOpponent1(player);
    if (activeSlot === 'opponent2') setOpponent2(player);
    setIsSelectOpen(false);
    setActiveSlot(null);
  };

  const selectedIds = [partner?.id, opponent1?.id, opponent2?.id].filter(Boolean);
  const filteredPlayers = dbPlayers
    .filter(p => !selectedIds.includes(p.id))
    .filter(p => p.name?.toLowerCase().includes(searchTerm.toLowerCase()));

  const canStart = matchMode === 'solo' 
    ? !!opponent1 
    : (!!partner && !!opponent1 && !!opponent2);

  const handleCreateMatch = async () => {
    if (!canStart || !session?.user) return;

    toast.loading("Iniciando partida...");
    
    const { error } = await supabase
      .from('matches')
      .insert({
        creator_id: session.user.id,
        mode: matchMode,
        player1_a: session.user.id,
        player2_a: partner?.id || null,
        player1_b: opponent1?.id || null,
        player2_b: opponent2?.id || null
      });

    toast.dismiss();

    if (error) {
      toast.error("Erro ao criar partida: " + error.message);
    } else {
      toast.success("Partida iniciada com sucesso!");
      navigate('/dashboard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="animate-spin text-emerald-500" size={48} />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen p-4 md:p-8 text-white overflow-x-hidden pb-32">
      <PoolBackground />
      
      <header className="z-10 relative flex flex-col md:flex-row md:items-center justify-between mb-8 max-w-7xl mx-auto gap-4">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="text-white hover:bg-white/10 rounded-full mr-2 h-10 w-10 p-0"
          >
            <ArrowLeft size={24} />
          </Button>
          <h1 className="text-2xl font-black italic uppercase tracking-tighter">Novo <span className="text-emerald-500">Duelo</span></h1>
        </div>

        <Tabs 
          value={matchMode} 
          onValueChange={(v) => setMatchMode(v as 'solo' | 'doubles')}
          className="bg-white/5 p-1 rounded-2xl border border-white/10 w-full md:w-auto"
        >
          <TabsList className="bg-transparent w-full">
            <TabsTrigger value="solo" className="flex-1 rounded-xl data-[state=active]:bg-emerald-600 gap-2 font-bold uppercase italic text-xs">
              <User size={14} /> 1 vs 1
            </TabsTrigger>
            <TabsTrigger value="doubles" className="flex-1 rounded-xl data-[state=active]:bg-emerald-600 gap-2 font-bold uppercase italic text-xs">
              <Users size={14} /> 2 vs 2
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </header>

      <main className="z-10 relative max-w-7xl mx-auto">
        <div className="flex flex-col gap-6">
          
          {/* Equipe A */}
          <div className="space-y-3">
            <h3 className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500/60">Sua Equipe</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MatchPlayerCard player={currentUser} label="Você" />
              {matchMode === 'doubles' && (
                <MatchPlayerCard 
                  player={partner} 
                  label="Seu Parceiro" 
                  isOpponent={false}
                  onSelectClick={() => openSelector('partner')}
                />
              )}
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-emerald-600 flex items-center justify-center shadow-2xl border-4 border-slate-950 shrink-0">
              <Swords size={28} className="text-white" />
            </div>
            <div className="h-px bg-white/10 flex-1 ml-4" />
            <div className="h-px bg-white/10 flex-1 mr-4" />
          </div>

          {/* Equipe B */}
          <div className="space-y-3">
            <h3 className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-red-500/60">Oponentes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MatchPlayerCard 
                player={opponent1} 
                label={matchMode === 'doubles' ? "Adversário 1" : "Adversário"} 
                isOpponent 
                onSelectClick={() => openSelector('opponent1')}
              />
              {matchMode === 'doubles' && (
                <MatchPlayerCard 
                  player={opponent2} 
                  label="Adversário 2" 
                  isOpponent 
                  onSelectClick={() => openSelector('opponent2')}
                />
              )}
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent z-30 flex justify-center pb-8">
          <Button 
            disabled={!canStart}
            onClick={handleCreateMatch}
            className={cn(
              "w-full max-w-sm h-16 text-xl font-black italic uppercase rounded-2xl shadow-2xl transition-all",
              canStart 
                ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/40" 
                : "bg-white/10 text-white/20 opacity-50 cursor-not-allowed"
            )}
          >
            Começar {matchMode === 'solo' ? 'Duelo' : 'Batalha'}
          </Button>
        </div>
      </main>

      {/* Seletor de Jogador adaptado para Mobile */}
      <Dialog open={isSelectOpen} onOpenChange={setIsSelectOpen}>
        <DialogContent className="bg-slate-950 border-white/10 text-white w-[95vw] max-w-md p-0 overflow-hidden rounded-3xl">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter">
              Selecionar <span className="text-emerald-500">
                {activeSlot === 'partner' ? 'Parceiro' : 'Oponente'}
              </span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="px-6 pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              <Input 
                placeholder="Procurar jogador..."
                className="bg-white/5 border-white/10 pl-10 h-12 focus:border-emerald-500 rounded-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <ScrollArea className="h-[60vh] px-6 pb-6">
            <div className="space-y-2">
              {filteredPlayers.length > 0 ? (
                filteredPlayers.map(player => (
                  <div 
                    key={player.id}
                    onClick={() => handleSelectPlayer(player)}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-emerald-600/20 active:scale-95 transition-all cursor-pointer group"
                  >
                    <Avatar className="w-12 h-12 border border-white/10">
                      <AvatarImage src={player.photo || ''} />
                      <AvatarFallback className="bg-white/10 font-black">
                        {player.name?.[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-bold uppercase italic tracking-tighter">{player.name}</p>
                      <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">{player.points} Pontos</p>
                    </div>
                    <UserPlus size={20} className="text-emerald-500" />
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-white/20">
                  <p className="font-bold uppercase italic">Nenhum atleta encontrado</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewMatch;
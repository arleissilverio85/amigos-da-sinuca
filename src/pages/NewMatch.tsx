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
    <div className="relative min-h-screen p-4 md:p-8 text-white overflow-x-hidden pb-24">
      <PoolBackground />
      
      <header className="z-10 relative flex flex-col md:flex-row md:items-center justify-between mb-12 max-w-7xl mx-auto gap-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="text-white hover:bg-white/10 rounded-full mr-4"
          >
            <ArrowLeft size={24} />
          </Button>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">Novo <span className="text-emerald-500">Duelo</span></h1>
        </div>

        <Tabs 
          value={matchMode} 
          onValueChange={(v) => setMatchMode(v as 'solo' | 'doubles')}
          className="bg-white/5 p-1 rounded-2xl border border-white/10"
        >
          <TabsList className="bg-transparent">
            <TabsTrigger value="solo" className="rounded-xl data-[state=active]:bg-emerald-600 gap-2 font-bold uppercase italic">
              <User size={16} /> 1 vs 1
            </TabsTrigger>
            <TabsTrigger value="doubles" className="rounded-xl data-[state=active]:bg-emerald-600 gap-2 font-bold uppercase italic">
              <Users size={16} /> 2 vs 2
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </header>

      <main className="z-10 relative max-w-7xl mx-auto flex flex-col items-center">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8 items-stretch w-full">
          
          <div className="flex flex-col gap-4">
            <h3 className="text-center text-xs font-black uppercase tracking-[0.2em] text-emerald-500/60 mb-2">Sua Equipe</h3>
            <div className="grid gap-4 h-full">
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

          <div className="flex flex-col items-center justify-center gap-4 py-8 lg:py-0 self-center">
            <div className="w-20 h-20 rounded-full bg-emerald-600 flex items-center justify-center shadow-2xl shadow-emerald-900/40 border-4 border-slate-950 z-20">
              <Swords size={40} className="text-white" />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-center text-xs font-black uppercase tracking-[0.2em] text-red-500/60 mb-2">Oponentes</h3>
            <div className="grid gap-4 h-full">
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

        <div className="fixed bottom-8 left-0 right-0 px-4 flex justify-center z-30">
          <Button 
            disabled={!canStart}
            onClick={handleCreateMatch}
            className={cn(
              "h-16 px-16 text-2xl font-black italic uppercase rounded-2xl shadow-2xl transition-all",
              canStart 
                ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/40" 
                : "bg-white/10 text-white/20 opacity-50 cursor-not-allowed"
            )}
          >
            Começar {matchMode === 'solo' ? 'Duelo' : 'Batalha'}
          </Button>
        </div>
      </main>

      <Dialog open={isSelectOpen} onOpenChange={setIsSelectOpen}>
        <DialogContent className="bg-slate-950 border-white/10 text-white max-w-md p-0 overflow-hidden">
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
                className="bg-white/5 border-white/10 pl-10 h-12 focus:border-emerald-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <ScrollArea className="h-[400px] px-6 pb-6">
            <div className="space-y-2">
              {filteredPlayers.length > 0 ? (
                filteredPlayers.map(player => (
                  <div 
                    key={player.id}
                    onClick={() => handleSelectPlayer(player)}
                    className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-emerald-600/20 hover:border-emerald-500/50 transition-all cursor-pointer group"
                  >
                    <Avatar className="w-12 h-12 border border-white/10">
                      <AvatarImage src={player.photo || ''} />
                      <AvatarFallback className="bg-white/10">
                        <User size={20} />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-bold uppercase italic tracking-tighter">{player.name}</p>
                      <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">{player.points} Pontos</p>
                    </div>
                    <UserPlus size={20} className="text-emerald-500 opacity-0 group-hover:opacity-100" />
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-white/20">
                  <p>Nenhum jogador encontrado</p>
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
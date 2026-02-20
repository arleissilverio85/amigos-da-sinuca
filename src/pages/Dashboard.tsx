"use client";

import React, { useState, useEffect } from 'react';
import PoolBackground from '@/components/PoolBackground';
import { useSession } from '@/components/SessionContextProvider';
import { Button } from '@/components/ui/button';
import { Trophy, Users, History, PlusCircle, LogOut, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PlayerForm from '@/components/PlayerForm';
import RankingList from '@/components/RankingList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from '@/integrations/supabase/client';
import { Player } from '@/utils/mockPlayers';
import { toast } from 'sonner';

const Dashboard = () => {
  const { session, logout } = useSession();
  const navigate = useNavigate();
  const [players, setPlayers] = useState<Player[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("stats");

  const fetchStats = async () => {
    if (!session?.user) return;

    const { data: userProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    setProfile(userProfile);

    const { data: allProfiles } = await supabase
      .from('profiles')
      .select('*')
      .order('points', { ascending: false });

    if (allProfiles) {
      const formattedPlayers = allProfiles.map(p => ({
        ...p,
        isCurrentUser: p.id === session.user.id
      }));
      setPlayers(formattedPlayers);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
    
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
        fetchStats();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session]);

  const handleNewMatch = () => {
    if (!profile?.name) {
      toast.error("Perfil incompleto!", {
        description: "Você precisa definir seu nome ou apelido na aba 'Meus Dados' antes de jogar."
      });
      setActiveTab("profile");
      return;
    }
    navigate('/new-match');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const myRank = players.findIndex(p => p.isCurrentUser) + 1;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="animate-spin text-emerald-500" size={48} />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen p-4 md:p-8 text-white">
      <PoolBackground />
      
      <header className="z-10 relative flex justify-between items-center mb-12 max-w-5xl mx-auto">
        <div>
          <h2 className="text-sm uppercase tracking-widest text-emerald-400 font-bold mb-1">Status do Atleta</h2>
          <h1 className="text-3xl font-black italic uppercase">
            {profile?.name || "Jogador Sem Nome"}
          </h1>
          {!profile?.name && (
            <p className="text-red-400 text-[10px] font-bold uppercase animate-pulse">⚠️ Complete seu perfil para jogar</p>
          )}
        </div>
        <Button 
          variant="ghost" 
          onClick={handleLogout}
          className="text-white hover:bg-white/10 rounded-full h-12 w-12 p-0"
        >
          <LogOut size={24} />
        </Button>
      </header>

      <main className="z-10 relative max-w-5xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="bg-white/5 border border-white/10 p-1 rounded-xl w-full max-w-2xl mx-auto grid grid-cols-3">
            <TabsTrigger value="stats" className="rounded-lg data-[state=active]:bg-emerald-600 font-bold uppercase italic tracking-tighter">Resumo</TabsTrigger>
            <TabsTrigger value="ranking" className="rounded-lg data-[state=active]:bg-emerald-600 font-bold uppercase italic tracking-tighter">Ranking</TabsTrigger>
            <TabsTrigger value="profile" className="rounded-lg data-[state=active]:bg-emerald-600 font-bold uppercase italic tracking-tighter">Meus Dados</TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm font-medium uppercase">Vitórias</p>
                  <p className="text-4xl font-black italic text-yellow-500">{profile?.wins || 0}</p>
                </div>
                <Trophy size={40} className="text-yellow-500/50" />
              </div>
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm font-medium uppercase">Total Partidas</p>
                  <p className="text-4xl font-black italic text-blue-500">{profile?.matches || 0}</p>
                </div>
                <History size={40} className="text-blue-500/50" />
              </div>
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm font-medium uppercase">Posição Ranking</p>
                  <p className="text-4xl font-black italic text-emerald-500">#{myRank || '-'}</p>
                </div>
                <Users size={40} className="text-emerald-500/50" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Button 
                onClick={handleNewMatch}
                className="h-28 bg-emerald-600 hover:bg-emerald-500 rounded-2xl flex flex-col items-center justify-center gap-2 text-2xl font-black italic uppercase shadow-2xl shadow-emerald-900/40 group transition-all"
              >
                <PlusCircle size={32} className="group-hover:rotate-90 transition-transform" />
                Nova Partida
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setActiveTab("ranking")}
                className="h-28 bg-white/5 hover:bg-white/10 border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 text-2xl font-black italic uppercase"
              >
                <Trophy size={32} className="text-yellow-500" />
                Ranking Global
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="ranking" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <RankingList players={players} />
          </TabsContent>

          <TabsContent value="profile" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <PlayerForm />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
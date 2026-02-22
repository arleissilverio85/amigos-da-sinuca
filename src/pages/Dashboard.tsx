"use client";

import React, { useState, useEffect } from 'react';
import PoolBackground from '@/components/PoolBackground';
import { useSession } from '@/components/SessionContextProvider';
import { Button } from '@/components/ui/button';
import { Trophy, Users, History, PlusCircle, LogOut, Loader2, Swords } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PlayerForm from '@/components/PlayerForm';
import RankingList from '@/components/RankingList';
import RecentMatches from '@/components/RecentMatches';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from '@/integrations/supabase/client';
import { Player } from '@/utils/mockPlayers';
import { toast } from 'sonner';

const Dashboard = () => {
  const { session, logout } = useSession();
  const navigate = useNavigate();
  const [players, setPlayers] = useState<Player[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [recentMatches, setRecentMatches] = useState<any[]>([]);
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

    const { data: matches } = await supabase
      .from('matches')
      .select(`
        *,
        p1a:player1_a(name),
        p2a:player2_a(name),
        p1b:player1_b(name),
        p2b:player2_b(name)
      `)
      .or(`player1_a.eq.${session.user.id},player2_a.eq.${session.user.id},player1_b.eq.${session.user.id},player2_b.eq.${session.user.id}`)
      .order('created_at', { ascending: false })
      .limit(8);

    if (matches) {
      setRecentMatches(matches);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
    
    const channel = supabase
      .channel('dashboard-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => fetchStats())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'matches' }, () => fetchStats())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session]);

  const handleNewMatch = () => {
    if (!profile?.name) {
      toast.error("Perfil incompleto!", {
        description: "Defina seu nome na aba 'Meus Dados' antes de jogar."
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
      
      <header className="z-10 relative flex justify-between items-center mb-8 md:mb-12 max-w-5xl mx-auto">
        <div className="min-w-0 flex-1 mr-4">
          <h2 className="text-[10px] uppercase tracking-[0.2em] text-emerald-400 font-black mb-0.5">Clube de Sinuca</h2>
          <h1 className="text-2xl md:text-3xl font-black italic uppercase truncate">
            {profile?.name || "Jogador"}
          </h1>
        </div>
        <Button 
          variant="ghost" 
          onClick={handleLogout}
          className="text-white hover:bg-white/10 rounded-full h-10 w-10 p-0 shrink-0"
        >
          <LogOut size={20} />
        </Button>
      </header>

      <main className="z-10 relative max-w-5xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 md:space-y-8">
          <TabsList className="bg-white/5 border border-white/10 p-1 rounded-2xl w-full max-w-2xl mx-auto grid grid-cols-3">
            <TabsTrigger value="stats" className="rounded-xl data-[state=active]:bg-emerald-600 font-bold uppercase italic text-[10px] md:text-xs tracking-tighter">Resumo</TabsTrigger>
            <TabsTrigger value="ranking" className="rounded-xl data-[state=active]:bg-emerald-600 font-bold uppercase italic text-[10px] md:text-xs tracking-tighter">Ranking</TabsTrigger>
            <TabsTrigger value="profile" className="rounded-xl data-[state=active]:bg-emerald-600 font-bold uppercase italic text-[10px] md:text-xs tracking-tighter">Perfil</TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="space-y-6 md:space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-4 md:p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <p className="text-white/40 text-[10px] md:text-xs font-bold uppercase">Vitórias</p>
                  <p className="text-2xl md:text-4xl font-black italic text-yellow-500">{profile?.wins || 0}</p>
                </div>
                <Trophy size={24} className="text-yellow-500/30 md:w-10 md:h-10" />
              </div>
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-4 md:p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <p className="text-white/40 text-[10px] md:text-xs font-bold uppercase">Partidas</p>
                  <p className="text-2xl md:text-4xl font-black italic text-blue-400">{profile?.matches || 0}</p>
                </div>
                <History size={24} className="text-blue-400/30 md:w-10 md:h-10" />
              </div>
              <div className="col-span-2 md:col-span-1 bg-white/5 backdrop-blur-lg border border-white/10 p-4 md:p-6 rounded-2xl flex md:items-center justify-between gap-2">
                <div>
                  <p className="text-white/40 text-[10px] md:text-xs font-bold uppercase">Ranking</p>
                  <p className="text-2xl md:text-4xl font-black italic text-emerald-400">{myRank > 0 ? `#${myRank}` : '-'}</p>
                </div>
                <Users size={24} className="text-emerald-400/30 md:w-10 md:h-10" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                onClick={handleNewMatch}
                className="h-20 md:h-28 bg-emerald-600 hover:bg-emerald-500 rounded-2xl flex items-center justify-center gap-3 text-xl md:text-2xl font-black italic uppercase shadow-xl transition-all"
              >
                <PlusCircle className="w-6 h-6 md:w-8 md:h-8" />
                Nova Partida
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setActiveTab("ranking")}
                className="h-20 md:h-28 bg-white/5 hover:bg-white/10 border-white/10 rounded-2xl flex items-center justify-center gap-3 text-xl md:text-2xl font-black italic uppercase"
              >
                <Trophy className="w-6 h-6 md:w-8 md:h-8 text-yellow-500" />
                Ranking Global
              </Button>
            </div>

            <div className="space-y-4 pt-2">
              <h3 className="text-lg font-black italic uppercase tracking-tighter flex items-center gap-2">
                <Swords className="text-emerald-500" size={20} />
                Partidas Recentes
              </h3>
              <RecentMatches matches={recentMatches} />
            </div>
          </TabsContent>

          <TabsContent value="ranking">
            <RankingList players={players} />
          </TabsContent>

          <TabsContent value="profile">
            <PlayerForm />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
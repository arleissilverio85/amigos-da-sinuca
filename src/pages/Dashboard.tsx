"use client";

import React from 'react';
import PoolBackground from '@/components/PoolBackground';
import { useSession } from '@/components/SessionContextProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Users, History, PlusCircle, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { session, logout } = useSession();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const stats = [
    { label: 'Vitórias', value: '12', icon: Trophy, color: 'text-yellow-500' },
    { label: 'Partidas', value: '24', icon: History, color: 'text-blue-500' },
    { label: 'Amigos', value: '8', icon: Users, color: 'text-emerald-500' },
  ];

  return (
    <div className="relative min-h-screen p-4 md:p-8 text-white">
      <PoolBackground />
      
      <header className="z-10 relative flex justify-between items-center mb-12 max-w-5xl mx-auto">
        <div>
          <h2 className="text-sm uppercase tracking-widest text-emerald-400 font-bold mb-1">Bem-vindo de volta</h2>
          <h1 className="text-3xl font-black italic uppercase">{session?.user?.user_metadata?.full_name || 'Jogador'}</h1>
        </div>
        <Button 
          variant="ghost" 
          onClick={handleLogout}
          className="text-white hover:bg-white/10 rounded-full h-12 w-12 p-0"
        >
          <LogOut size={24} />
        </Button>
      </header>

      <main className="z-10 relative max-w-5xl mx-auto space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat, i) => (
            <Card key={i} className="bg-white/5 backdrop-blur-lg border-white/10 text-white overflow-hidden group hover:border-emerald-500/50 transition-colors">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm font-medium">{stat.label}</p>
                  <p className="text-3xl font-black italic">{stat.value}</p>
                </div>
                <stat.icon className={`${stat.color} opacity-80 group-hover:scale-110 transition-transform`} size={32} />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Button className="h-24 bg-emerald-600 hover:bg-emerald-500 rounded-2xl flex items-center gap-4 text-xl font-bold shadow-lg shadow-emerald-900/40 group">
            <PlusCircle size={32} className="group-hover:rotate-90 transition-transform" />
            Nova Partida
          </Button>
          <Button variant="outline" className="h-24 bg-white/5 hover:bg-white/10 border-white/10 rounded-2xl flex items-center gap-4 text-xl font-bold">
            <Trophy size={32} className="text-yellow-500" />
            Ver Rankings
          </Button>
        </div>

        {/* Recent Matches Placeholder */}
        <Card className="bg-white/5 backdrop-blur-lg border-white/10 text-white">
          <CardHeader>
            <CardTitle className="text-xl font-black italic uppercase flex items-center gap-2">
              <History size={20} className="text-emerald-400" />
              Últimas Partidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-white/40">
              <p>Você ainda não registrou partidas hoje.</p>
              <p className="text-sm">Que tal começar uma agora?</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
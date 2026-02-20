"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Camera, User, Trophy, Hash, DollarSign, Save } from 'lucide-react';
import { toast } from 'sonner';

interface PlayerData {
  name: string;
  matches: number;
  wins: number;
  losses: number;
  points: number;
  balance: number;
  photo: string | null;
}

const PlayerForm = () => {
  const [formData, setFormData] = useState<PlayerData>({
    name: '',
    matches: 0,
    wins: 0,
    losses: 0,
    points: 0,
    balance: 0,
    photo: null,
  });

  useEffect(() => {
    const saved = localStorage.getItem('player_profile');
    if (saved) {
      setFormData(JSON.parse(saved));
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photo: reader.result as string }));
        toast.success("Foto carregada com sucesso!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('player_profile', JSON.stringify(formData));
    toast.success("Perfil atualizado com sucesso!", {
      description: "Suas estatísticas foram salvas no dispositivo."
    });
  };

  return (
    <Card className="bg-white/5 backdrop-blur-xl border-white/10 text-white overflow-hidden">
      <CardHeader className="border-b border-white/5">
        <CardTitle className="text-2xl font-black italic uppercase text-emerald-400">Dados do Jogador</CardTitle>
        <CardDescription className="text-white/60">Mantenha seu perfil atualizado para o ranking.</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Foto e Nome */}
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative group">
              <Avatar className="w-32 h-32 border-4 border-emerald-500/30">
                <AvatarImage src={formData.photo || ''} />
                <AvatarFallback className="bg-white/10 text-3xl">
                  <User size={48} className="text-white/20" />
                </AvatarFallback>
              </Avatar>
              <label className="absolute bottom-0 right-0 p-2 bg-emerald-600 hover:bg-emerald-500 rounded-full cursor-pointer shadow-lg transition-colors">
                <Camera size={20} />
                <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
              </label>
              <p className="text-[10px] text-center mt-2 text-white/40 uppercase tracking-widest">Toque para mudar</p>
            </div>
            
            <div className="flex-1 w-full space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-emerald-400 font-bold uppercase text-xs">Nome ou Apelido</Label>
                <Input 
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Como te chamam na mesa?"
                  className="bg-white/5 border-white/10 h-12 text-lg focus:border-emerald-500 transition-colors"
                />
                <p className="text-[10px] text-white/40 italic">Dica: Use um nome único para ser fácil de achar no ranking.</p>
              </div>
            </div>
          </div>

          {/* Estatísticas Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-white/60 text-xs font-bold uppercase">
                <Hash size={14} className="text-emerald-500" /> Partidas
              </Label>
              <Input 
                type="number" 
                name="matches"
                value={formData.matches}
                onChange={handleInputChange}
                className="bg-white/5 border-white/10 focus:border-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-white/60 text-xs font-bold uppercase">
                <Trophy size={14} className="text-yellow-500" /> Vitórias
              </Label>
              <Input 
                type="number" 
                name="wins"
                value={formData.wins}
                onChange={handleInputChange}
                className="bg-white/5 border-white/10 focus:border-yellow-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-white/60 text-xs font-bold uppercase">
                <User size={14} className="text-red-500" /> Derrotas
              </Label>
              <Input 
                type="number" 
                name="losses"
                value={formData.losses}
                onChange={handleInputChange}
                className="bg-white/5 border-white/10 focus:border-red-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-white/60 text-xs font-bold uppercase">
                <Trophy size={14} className="text-emerald-500" /> Pontos
              </Label>
              <Input 
                type="number" 
                name="points"
                value={formData.points}
                onChange={handleInputChange}
                className="bg-white/5 border-white/10 focus:border-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-white/60 text-xs font-bold uppercase">
                <DollarSign size={14} className="text-emerald-500" /> Saldo (R$)
              </Label>
              <Input 
                type="number" 
                name="balance"
                value={formData.balance}
                onChange={handleInputChange}
                className="bg-white/5 border-white/10 focus:border-emerald-500"
              />
            </div>
            <div className="space-y-2 opacity-50">
              <Label className="flex items-center gap-2 text-white/60 text-xs font-bold uppercase">
                <Hash size={14} /> Posição Ranking
              </Label>
              <div className="h-10 flex items-center px-3 rounded-md bg-white/5 border border-white/10 text-emerald-400 font-black italic">
                #1 (Simulado)
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 h-14 text-xl font-black italic uppercase shadow-xl shadow-emerald-900/40 group">
            <Save className="mr-2 group-hover:scale-110 transition-transform" /> Salvar Perfil
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PlayerForm;
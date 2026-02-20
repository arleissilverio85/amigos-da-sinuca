"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Camera, User, Trophy, Hash, DollarSign, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/components/SessionContextProvider';

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
  const { session } = useSession();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState<PlayerData>({
    name: '',
    matches: 0,
    wins: 0,
    losses: 0,
    points: 1000,
    balance: 0,
    photo: null,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (data) {
        setFormData({
          name: data.name || '',
          matches: data.matches || 0,
          wins: data.wins || 0,
          losses: data.losses || 0,
          points: data.points || 1000,
          balance: data.balance || 0,
          photo: data.photo || null,
        });
      }
      setFetching(false);
    };

    fetchProfile();
  }, [session]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) return;
    if (!formData.name.trim()) {
      toast.error("O nome ou apelido é obrigatório!");
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: session.user.id,
        ...formData,
        updated_at: new Date().toISOString(),
      });

    setLoading(false);

    if (error) {
      toast.error("Erro ao salvar perfil: " + error.message);
    } else {
      toast.success("Perfil atualizado com sucesso!", {
        description: "Seus dados estão sincronizados com o clube."
      });
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
      </div>
    );
  }

  return (
    <Card className="bg-white/5 backdrop-blur-xl border-white/10 text-white overflow-hidden">
      <CardHeader className="border-b border-white/5">
        <CardTitle className="text-2xl font-black italic uppercase text-emerald-400">Dados do Jogador</CardTitle>
        <CardDescription className="text-white/60">Mantenha seu perfil atualizado para o ranking.</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-8">
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
            </div>
            
            <div className="flex-1 w-full space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-emerald-400 font-bold uppercase text-xs">Nome ou Apelido</Label>
                <Input 
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Como te chamam na mesa?"
                  className="bg-white/5 border-white/10 h-12 text-lg focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-4">
            <div className="space-y-2">
              <Label className="text-white/60 text-xs font-bold uppercase">Partidas</Label>
              <Input type="number" name="matches" value={formData.matches} onChange={handleInputChange} className="bg-white/5 border-white/10" />
            </div>
            <div className="space-y-2">
              <Label className="text-white/60 text-xs font-bold uppercase">Vitórias</Label>
              <Input type="number" name="wins" value={formData.wins} onChange={handleInputChange} className="bg-white/5 border-white/10" />
            </div>
            <div className="space-y-2">
              <Label className="text-white/60 text-xs font-bold uppercase">Derrotas</Label>
              <Input type="number" name="losses" value={formData.losses} onChange={handleInputChange} className="bg-white/5 border-white/10" />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 h-14 text-xl font-black italic uppercase shadow-xl shadow-emerald-900/40"
          >
            {loading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />} 
            Salvar Perfil
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PlayerForm;
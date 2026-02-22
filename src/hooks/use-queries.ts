"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Hook para buscar o perfil do usuário logado
export const useUserProfile = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutos de cache
  });
};

// Hook para buscar todos os jogadores (Ranking)
export const useRanking = () => {
  return useQuery({
    queryKey: ['ranking'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('points', { ascending: false });
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutos de cache
  });
};

// Hook para buscar partidas recentes do usuário
export const useRecentMatches = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['matches', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          p1a:player1_a(name),
          p2a:player2_a(name),
          p1b:player1_b(name),
          p2b:player2_b(name)
        `)
        .or(`player1_a.eq.${userId},player2_a.eq.${userId},player1_b.eq.${userId},player2_b.eq.${userId}`)
        .order('created_at', { ascending: false })
        .limit(8);
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
    staleTime: 1000 * 30, // 30 segundos de cache
  });
};
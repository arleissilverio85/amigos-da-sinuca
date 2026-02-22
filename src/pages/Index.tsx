"use client";

import { MadeWithDyad } from "@/components/made-with-dyad";
import PoolBackground from "@/components/PoolBackground";
import { Button } from "@/components/ui/button";
import { useSession } from "@/components/SessionContextProvider";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { session } = useSession();
  const navigate = useNavigate();

  const handleStart = () => {
    if (!session) {
      navigate('/login');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col text-white overflow-hidden">
      <PoolBackground />

      <main className="flex-1 flex flex-col items-center justify-center z-10 px-6 text-center">
        <div className="space-y-2 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
          <p className="text-emerald-400 font-bold tracking-[0.3em] uppercase text-xs md:text-sm animate-pulse">
            O Clube Oficial
          </p>
          <h1 className="text-5xl md:text-9xl font-black tracking-tighter italic uppercase leading-[0.8] mb-4">
            Amigos da <br />
            <span className="text-emerald-500 underline decoration-8 underline-offset-[8px] md:underline-offset-[16px]">Sinuca</span>
          </h1>
        </div>
      </main>
      
      <footer className="z-10 flex flex-col items-center pb-12 px-6 space-y-8 w-full animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 fill-mode-both">
        <Button 
          onClick={handleStart}
          size="lg" 
          className="w-full max-w-sm bg-emerald-600 hover:bg-emerald-500 text-white font-black h-20 rounded-2xl text-2xl italic uppercase transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-emerald-900/40"
        >
          {session ? "Continuar" : "Começar Agora"}
        </Button>
        
        <MadeWithDyad />
      </footer>
    </div>
  );
};

export default Index;
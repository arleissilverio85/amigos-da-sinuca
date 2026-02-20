import { MadeWithDyad } from "@/components/made-with-dyad";
import PoolBackground from "@/components/PoolBackground";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-white overflow-x-hidden">
      <PoolBackground />

      <main className="z-10 flex flex-col items-center text-center space-y-12">
        <h1 className="text-6xl md:text-9xl font-black tracking-tighter italic uppercase leading-none">
          Amigos da <span className="text-emerald-500 block md:inline underline decoration-8 underline-offset-[12px]">Sinuca</span>
        </h1>

        <Button size="lg" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-16 px-12 rounded-full text-xl transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-emerald-900/40">
          Começar Agora
        </Button>
      </main>
      
      <footer className="mt-auto py-8 z-10 w-full">
        <MadeWithDyad />
      </footer>
    </div>
  );
};

export default Index;
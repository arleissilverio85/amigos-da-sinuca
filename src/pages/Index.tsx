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
      // Aqui iremos para a tela de perfil/dashboard futuramente
      console.log("Usuário logado:", session.user.email);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col text-white overflow-hidden">
      <PoolBackground />

      <main className="flex-1 flex items-center justify-center z-10 px-4">
        <h1 className="text-6xl md:text-9xl font-black tracking-tighter italic uppercase text-center leading-none">
          Amigos da <span className="text-emerald-500 block md:inline underline decoration-8 underline-offset-[12px]">Sinuca</span>
        </h1>
      </main>
      
      <footer className="z-10 flex flex-col items-center pb-8 space-y-8 w-full">
        <Button 
          onClick={handleStart}
          size="lg" 
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-16 px-12 rounded-full text-xl transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-emerald-900/40"
        >
          {session ? "Continuar" : "Começar Agora"}
        </Button>
        
        <MadeWithDyad />
      </footer>
    </div>
  );
};

export default Index;
import { MadeWithDyad } from "@/components/made-with-dyad";
import PoolBackground from "@/components/PoolBackground";
import { Button } from "@/components/ui/button";
import { ChevronRight, Trophy, Users, Target } from "lucide-react";

const Index = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-white overflow-x-hidden">
      <PoolBackground />

      <main className="container max-w-5xl px-4 py-20 z-10 flex flex-col items-center text-center space-y-8">
        <header className="space-y-6">
          <div className="inline-block px-4 py-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-[0.2em]">
              Edição Digital Arcade
            </span>
          </div>
          
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter italic uppercase leading-none">
            Amigos da <span className="text-emerald-500 block md:inline underline decoration-8 underline-offset-[12px]">Sinuca</span>
          </h1>
          
          <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            A experiência clássica do bilhar com a nostalgia da arte pixelada em alta fidelidade.
          </p>
        </header>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button size="lg" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-14 px-8 rounded-full text-lg transition-all hover:scale-105 active:scale-95 shadow-xl shadow-emerald-900/20">
            Começar Agora
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
          <Button size="lg" variant="outline" className="border-slate-700 bg-slate-900/40 hover:bg-slate-800 text-white h-14 px-8 rounded-full text-lg backdrop-blur-sm">
            Ver Ranking
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 w-full">
          {[
            { 
              icon: <Target className="text-emerald-500 mb-3" size={24} />,
              title: "Estética Retro", 
              desc: "Paletas de cores clássicas de 16-bits e técnicas de dithering autênticas." 
            },
            { 
              icon: <Users className="text-emerald-500 mb-3" size={24} />,
              title: "Comunidade", 
              desc: "Jogue com amigos em tempo real e mostre quem é o mestre do taco." 
            },
            { 
              icon: <Trophy className="text-emerald-500 mb-3" size={24} />,
              title: "Espírito Arcade", 
              desc: "Sinta o impacto perfeito em cada tacada com animação frame-a-frame." 
            }
          ].map((feature, i) => (
            <div key={i} className="bg-slate-900/40 backdrop-blur-md border border-slate-800/50 p-8 rounded-2xl hover:border-emerald-500/40 transition-all group hover:-translate-y-1">
              <div className="flex flex-col items-center">
                {feature.icon}
                <h3 className="text-white font-black mb-3 uppercase text-sm tracking-widest">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
      
      <footer className="mt-auto py-8 z-10 w-full bg-gradient-to-t from-slate-950 to-transparent">
        <MadeWithDyad />
      </footer>
    </div>
  );
};

export default Index;
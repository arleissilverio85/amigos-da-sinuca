import { MadeWithDyad } from "@/components/made-with-dyad";
import PoolAnimation from "@/components/PoolAnimation";

const Index = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-5xl space-y-8 py-12">
        <header className="text-center space-y-4">
          <div className="inline-block px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">
              Digital Arcade Edition
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter italic uppercase">
            Pixel <span className="text-emerald-500 underline decoration-4 underline-offset-8">Pool</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Experience the classic game of 8-ball through the lens of high-fidelity 16-bit pixel art.
          </p>
        </header>

        <PoolAnimation />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
          {[
            { title: "Retro Aesthetic", desc: "Classic 16-bit color palettes and dithering techniques." },
            { title: "Fluid Motion", desc: "Smooth 12-FPS frame-by-frame hand-drawn animation." },
            { title: "Arcade Spirit", desc: "Captured the perfect moment of impact." }
          ].map((feature, i) => (
            <div key={i} className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl hover:border-emerald-500/30 transition-colors">
              <h3 className="text-emerald-400 font-bold mb-2 uppercase text-xs tracking-wider">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-auto">
        <MadeWithDyad />
      </div>
    </div>
  );
};

export default Index;
"use client";

import React, { useState, useEffect } from "react";

const FRAME_COUNT = 80;
const FRAME_RATE = 1000 / 12; // 12 FPS

const PoolBackground = () => {
  const [currentFrame, setCurrentFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % FRAME_COUNT);
    }, FRAME_RATE);

    return () => clearInterval(interval);
  }, []);

  const framePath = `/frames/pool/frame_${currentFrame.toString().padStart(3, "0")}.jpg`;

  return (
    <div className="fixed inset-0 -z-10 w-full h-full overflow-hidden bg-black">
      {/* Imagem da Animação */}
      <img
        src={framePath}
        alt="Background Animation"
        className="w-full h-full object-cover opacity-60 grayscale-[0.2]"
      />
      
      {/* Overlay para melhorar a leitura do texto */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-transparent to-slate-950/90" />
      <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[2px]" />
    </div>
  );
};

export default PoolBackground;
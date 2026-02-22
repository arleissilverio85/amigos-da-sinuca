"use client";

import React, { useState, useEffect, useRef } from "react";

const FRAME_COUNT = 80;
const FRAME_RATE = 1000 / 12; // 12 FPS para equilíbrio entre fluidez e performance mobile

const PoolBackground = () => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const frameRef = useRef(0);

  useEffect(() => {
    // Pré-carregamento básico das primeiras imagens para evitar flash branco
    const preloadImages = () => {
      for (let i = 0; i < 10; i++) {
        const img = new Image();
        img.src = `/frames/pool/frame_${i.toString().padStart(3, "0")}.jpg`;
      }
    };
    preloadImages();

    const interval = setInterval(() => {
      frameRef.current = (frameRef.current + 1) % FRAME_COUNT;
      setCurrentFrame(frameRef.current);
    }, FRAME_RATE);

    return () => clearInterval(interval);
  }, []);

  const framePath = `/frames/pool/frame_${currentFrame.toString().padStart(3, "0")}.jpg`;

  return (
    <div className="fixed inset-0 -z-10 w-full h-full overflow-hidden bg-black touch-none">
      <img
        src={framePath}
        alt=""
        className="w-full h-full object-cover opacity-60 grayscale-[0.2] transition-opacity duration-300"
        loading="eager"
      />
      {/* Camadas de gradiente para garantir leitura no mobile */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-transparent to-slate-950/95" />
      <div className="absolute inset-0 bg-emerald-950/10 backdrop-blur-[1px]" />
    </div>
  );
};

export default PoolBackground;
"use client";

import React, { useEffect, useRef } from "react";

const FRAME_COUNT = 80;
const FPS = 12;

const PoolBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const requestRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const frameIndexRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Pré-carregar todas as imagens para o Canvas
    const loadFrames = async () => {
      const loadPromises = Array.from({ length: FRAME_COUNT }).map((_, i) => {
        return new Promise<HTMLImageElement>((resolve) => {
          const img = new Image();
          img.src = `/frames/pool/frame_${i.toString().padStart(3, "0")}.jpg`;
          img.onload = () => resolve(img);
        });
      });

      framesRef.current = await Promise.all(loadPromises);
      
      // Ajustar tamanho do canvas
      const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };
      window.addEventListener('resize', resize);
      resize();

      // Loop de animação otimizado com requestAnimationFrame
      const animate = (time: number) => {
        if (lastTimeRef.current === 0) lastTimeRef.current = time;
        const deltaTime = time - lastTimeRef.current;

        if (deltaTime > 1000 / FPS) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          const img = framesRef.current[frameIndexRef.current];
          if (img) {
            // Desenhar imagem com cover-fill manual
            const canvasRatio = canvas.width / canvas.height;
            const imgRatio = img.width / img.height;
            let drawWidth, drawHeight, offsetX, offsetY;

            if (canvasRatio > imgRatio) {
              drawWidth = canvas.width;
              drawHeight = canvas.width / imgRatio;
              offsetX = 0;
              offsetY = (canvas.height - drawHeight) / 2;
            } else {
              drawWidth = canvas.height * imgRatio;
              drawHeight = canvas.height;
              offsetX = (canvas.width - drawWidth) / 2;
              offsetY = 0;
            }

            ctx.globalAlpha = 0.6; // Opacidade controlada no canvas
            ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
          }

          frameIndexRef.current = (frameIndexRef.current + 1) % FRAME_COUNT;
          lastTimeRef.current = time;
        }

        requestRef.current = requestAnimationFrame(animate);
      };

      requestRef.current = requestAnimationFrame(animate);
    };

    loadFrames();

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      window.removeEventListener('resize', () => {});
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 w-full h-full overflow-hidden bg-black touch-none">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full grayscale-[0.2]"
      />
      {/* Camadas de gradiente para garantir leitura no mobile */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-transparent to-slate-950/95" />
      <div className="absolute inset-0 bg-emerald-950/10 backdrop-blur-[1px]" />
    </div>
  );
};

export default PoolBackground;
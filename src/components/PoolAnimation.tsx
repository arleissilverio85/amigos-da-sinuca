"use client";

import React, { useState, useEffect } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const FRAME_COUNT = 80;
const FRAME_RATE = 1000 / 12; // 12 FPS

const PoolAnimation = () => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentFrame((prev) => (prev + 1) % FRAME_COUNT);
      }, FRAME_RATE);
    }

    return () => clearInterval(interval);
  }, [isPlaying]);

  const framePath = `/frames/pool/frame_${currentFrame.toString().padStart(3, "0")}.jpg`;

  return (
    <Card className="p-6 bg-slate-900 border-slate-800 shadow-2xl max-w-4xl mx-auto">
      <div className="relative aspect-video rounded-lg overflow-hidden bg-black border-4 border-slate-700">
        <img
          src={framePath}
          alt={`Pool break frame ${currentFrame}`}
          className="w-full h-full object-contain"
        />
        
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-4">
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="icon"
              className="bg-slate-800/80 hover:bg-slate-700 text-white border-slate-600"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="bg-slate-800/80 hover:bg-slate-700 text-white border-slate-600"
              onClick={() => {
                setCurrentFrame(0);
                setIsPlaying(false);
              }}
            >
              <RotateCcw size={20} />
            </Button>
          </div>
          
          <div className="flex-1 px-4">
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-75" 
                style={{ width: `${(currentFrame / (FRAME_COUNT - 1)) * 100}%` }}
              />
            </div>
          </div>
          
          <span className="text-xs font-mono text-slate-400 bg-slate-900/80 px-2 py-1 rounded">
            FRAME_{currentFrame.toString().padStart(3, "0")}
          </span>
        </div>
      </div>
      
      <div className="mt-6 text-center space-y-2">
        <h2 className="text-2xl font-bold text-emerald-400 font-mono tracking-tighter uppercase italic">
          16-BIT BREAKOUT
        </h2>
        <p className="text-slate-400 text-sm">
          A retro-style pixel art pool simulation.
        </p>
      </div>
    </Card>
  );
};

export default PoolAnimation;
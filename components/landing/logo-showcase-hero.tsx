"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

export function LogoShowcaseHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let time = 0;
    let animationId = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    const render = () => {
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

      // DO NOT fill background - let CSS handle it, canvas is ONLY for effects
      // In light mode: pure white background from CSS
      // In dark mode: dark background from CSS
      // Canvas only draws animated effects on top

      ctx.clearRect(0, 0, w, h);

      const centerX = w * 0.5;
      const centerY = h * 0.5;

      // Draw flowing gradient circles - only in dark mode make them bright
      for (let i = 0; i < 3; i++) {
        const radius = 300 + i * 200 + Math.sin(time * 0.0008 + i) * 100;
        const angle = time * (0.0003 - i * 0.00005) + i * (Math.PI * 2 / 3);
        
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        const grad = ctx.createRadialGradient(x, y, 0, x, y, 400);
        
        if (isDark) {
          grad.addColorStop(0, `rgba(59, 130, 246, 0.2)`);
          grad.addColorStop(0.5, `rgba(30, 64, 175, 0.12)`);
          grad.addColorStop(1, `rgba(30, 64, 175, 0)`);
        } else {
          grad.addColorStop(0, `rgba(59, 130, 246, 0.12)`);
          grad.addColorStop(0.5, `rgba(30, 64, 175, 0.06)`);
          grad.addColorStop(1, `rgba(30, 64, 175, 0)`);
        }
        
        ctx.fillStyle = grad;
        ctx.fillRect(x - 400, y - 400, 800, 800);
      }

      // Add flowing wave patterns with more fluidity
      ctx.strokeStyle = isDark 
        ? `rgba(59, 130, 246, ${0.08 + Math.sin(time * 0.003) * 0.05})` 
        : `rgba(30, 64, 175, ${0.08 + Math.sin(time * 0.003) * 0.04})`;
      ctx.lineWidth = 1.5;

      for (let waveLayer = 0; waveLayer < 6; waveLayer++) {
        ctx.beginPath();
        for (let x = 0; x < w; x += 25) {
          const y =
            h * 0.5 +
            Math.sin(x * 0.01 + time * 0.0025 + waveLayer * 1.2) * 50 +
            Math.cos(x * 0.006 + time * 0.002 + waveLayer * 0.8) * 40 +
            Math.sin(time * 0.001 + waveLayer * 0.5) * 30 +
            waveLayer * 15;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Draw animated morphing circles with pulsing effect
      ctx.globalAlpha = 0.08;

      for (let ring = 0; ring < 4; ring++) {
        const baseRadius = 100 + ring * 80;
        const pulse = Math.sin(time * 0.003 + ring * 0.5) * 30;
        
        ctx.strokeStyle = isDark
          ? `rgba(59, 130, 246, ${0.12 + Math.sin(time * 0.004 + ring) * 0.1})`
          : `rgba(30, 64, 175, ${0.08 + Math.sin(time * 0.004 + ring) * 0.06})`;
        ctx.lineWidth = 1;
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, baseRadius + pulse, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;

      time += 1;
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  const handleScroll = () => {
    const nextSection = document.querySelector("#hero-second");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full flex flex-col items-center justify-between overflow-hidden bg-white dark:bg-slate-950"
    >
      {/* Canvas background - overlay only */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-100"
      />

      {/* Content container with proper flex layout */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-start py-12 lg:py-16 px-4 lg:px-8 pt-40 lg:pt-56">
        {/* Main content - centered */}
        <div className="flex flex-col items-center justify-center gap-8 lg:gap-12">
          {/* Animated title */}
          <div className="text-center space-y-4 animate-fade-in">
            <p className="text-xs lg:text-sm font-mono text-foreground/50 dark:text-foreground/70 uppercase tracking-[0.2em]">
              Introducing
            </p>
            <h1 className="text-6xl lg:text-8xl font-display font-bold tracking-tight text-foreground dark:text-white">
              SABAT
            </h1>
            <p className="text-sm lg:text-base text-foreground/60 dark:text-foreground/75 font-light tracking-wide">
              Professional Corporate Travel Management
            </p>
          </div>

          {/* Logo */}
          <div className="relative w-48 h-48 lg:w-64 lg:h-64 animate-fade-in" style={{ animationDelay: "0.1s", animation: "fade-in 0.6s ease-out !important" }}>
            {/* Glowing frame - STATIC, NO ROTATION */}
            <div className="absolute inset-0 rounded-3xl border-2 border-foreground/20 dark:border-foreground/30 shadow-2xl shadow-blue-500/20 dark:shadow-blue-600/30" style={{ animation: "none !important" }} />
            
            {/* Rotating rings container */}
            <div style={{ animation: "spin 20s linear infinite", position: "absolute", inset: 0 }}>
              <div className="absolute inset-0 rounded-3xl border border-foreground/10 dark:border-foreground/20" />
            </div>
            <div style={{ animation: "spin 30s linear infinite reverse", position: "absolute", inset: "0.5rem" }}>
              <div className="rounded-3xl border border-foreground/5 dark:border-foreground/10 h-full" />
            </div>

            {/* Logo image */}
            <div className="absolute inset-0 flex items-center justify-center" style={{ animation: "none !important" }}>
              <Image
                src="/sabat-logo.png"
                alt="SABAT"
                width={240}
                height={240}
                className="object-contain w-2/3 h-2/3"
                priority
                style={{ animation: "none !important" }}
              />
            </div>
          </div>
        </div>

        {/* Scroll indicator button at bottom */}
        <div className="mt-auto pb-12">
        <button
          onClick={handleScroll}
          className="group cursor-pointer animate-fade-in"
          style={{ animationDelay: "0.2s" }}
          aria-label="Scroll to next section"
        >
          <div className="flex flex-col items-center gap-3">
            <span className="text-xs font-mono text-foreground/50 dark:text-foreground/60 uppercase tracking-widest transition-colors group-hover:text-foreground/70 dark:group-hover:text-foreground/80">
              Explore
            </span>
            <div className="w-5 h-8 border border-foreground/40 dark:border-foreground/50 rounded-full flex items-start justify-center p-1.5 group-hover:border-foreground/60 dark:group-hover:border-foreground/70 transition-colors">
              <ChevronDown 
                className="w-3 h-3 text-foreground/50 dark:text-foreground/60 animate-bounce" 
              />
            </div>
          </div>
        </button>
        </div>
      </div>
    </section>
  );
}

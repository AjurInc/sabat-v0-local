"use client";

import { useEffect, useRef } from "react";

export function AnimatedSphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const sabatLetters = "SABAT";
    let time = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      
      // Determine text color based on background
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches || 
                     document.documentElement.classList.contains("dark");
      const textColor = isDark ? "rgba(200, 200, 200, 0.8)" : "rgba(100, 100, 100, 0.6)";
      
      ctx.clearRect(0, 0, rect.width, rect.height);

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const radius = Math.min(rect.width, rect.height) * 0.35;

      ctx.font = "bold 24px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const points: { x: number; y: number; z: number; char: string }[] = [];

      // Generate sphere points with SABAT letters only
      let charIndex = 0;
      for (let phi = 0; phi < Math.PI * 2; phi += 0.25) {
        for (let theta = 0.2; theta < Math.PI - 0.2; theta += 0.25) {
          const x = Math.sin(theta) * Math.cos(phi + time * 0.5);
          const y = Math.sin(theta) * Math.sin(phi + time * 0.5);
          const z = Math.cos(theta);

          // Rotate around Y axis
          const rotY = time * 0.3;
          const newX = x * Math.cos(rotY) - z * Math.sin(rotY);
          const newZ = x * Math.sin(rotY) + z * Math.cos(rotY);

          // Rotate around X axis
          const rotX = time * 0.2;
          const newY = y * Math.cos(rotX) - newZ * Math.sin(rotX);
          const finalZ = y * Math.sin(rotX) + newZ * Math.cos(rotX);

          const letter = sabatLetters[charIndex % sabatLetters.length];
          charIndex++;

          points.push({
            x: centerX + newX * radius,
            y: centerY + newY * radius,
            z: finalZ,
            char: letter,
          });
        }
      }

      // Sort by z for depth
      points.sort((a, b) => a.z - b.z);

      // Draw points
      points.forEach((point) => {
        const alpha = Math.max(0.3, (point.z + 1) * 0.5);
        ctx.fillStyle = textColor;
        ctx.globalAlpha = alpha;
        ctx.fillText(point.char, point.x, point.y);
      });
      
      // Draw center dot
      ctx.globalAlpha = 1;
      ctx.fillStyle = textColor;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.04, 0, Math.PI * 2);
      ctx.fill();

      time += 0.02;
      frameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: "block" }}
    />
  );
}

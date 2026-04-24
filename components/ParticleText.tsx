"use client";

import { useEffect, useRef, useState } from "react";

export default function ParticleText() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isHovered = useRef(true); // Always form text
  const mouse = useRef({ x: -1000, y: -1000, radius: 60 });
  const [wordIndex, setWordIndex] = useState(0);

  const words = ["HI", "READY?", "LET'S TALK"];

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    let animationFrameId: number;
    let particles: any[] = [];
    const step = 8;

    const initParticles = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      const offscreen = document.createElement("canvas");
      offscreen.width = canvas.width;
      offscreen.height = canvas.height;
      const offCtx = offscreen.getContext("2d");
      if (!offCtx) return;

      offCtx.fillStyle = "white";
      const currentWord = words[wordIndex];
      const fontSize = Math.min(160, canvas.width / (currentWord.length * 0.6));
      offCtx.font = `900 ${fontSize}px "Syncopate", "Inter", sans-serif`;
      offCtx.textAlign = "center";
      offCtx.textBaseline = "middle";
      offCtx.fillText(currentWord, canvas.width / 2, canvas.height / 2);

      const imgData = offCtx.getImageData(0, 0, canvas.width, canvas.height).data;
      const targetPoints = [];

      for (let y = 0; y < canvas.height; y += step) {
        for (let x = 0; x < canvas.width; x += step) {
          const alpha = imgData[(y * canvas.width + x) * 4 + 3];
          if (alpha > 128) {
            targetPoints.push({ x, y });
          }
        }
      }

      for (let i = targetPoints.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [targetPoints[i], targetPoints[j]] = [targetPoints[j], targetPoints[i]];
      }

      particles = [];
      let targetIndex = 0;

      for (let y = 0; y < canvas.height; y += step) {
        for (let x = 0; x < canvas.width; x += step) {
          let tx, ty;
          let isText = false;

          if (targetIndex < targetPoints.length) {
            tx = targetPoints[targetIndex].x;
            ty = targetPoints[targetIndex].y;
            isText = true;
            targetIndex++;
          } else {
            tx = x + (Math.random() - 0.5) * 150;
            ty = canvas.height + 200 + Math.random() * 100;
          }

          particles.push({
            ox: x, 
            oy: y, 
            tx, 
            ty, 
            x: x + (Math.random() - 0.5) * 50, 
            y: y + (Math.random() - 0.5) * 50, 
            vx: 0,
            vy: 0,
            isText,
          });
        }
      }
    };

    initParticles();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const style = getComputedStyle(document.documentElement);
      const textColor = style.getPropertyValue("--text").trim() || "#fff";
      const mutedColor = style.getPropertyValue("--muted").trim() || "#888";

      ctx.fillStyle = isHovered.current ? textColor : mutedColor;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        let destX = isHovered.current ? p.tx : p.ox;
        let destY = isHovered.current ? p.ty : p.oy;

        const dxMouse = mouse.current.x - p.x;
        const dyMouse = mouse.current.y - p.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

        if (distMouse < mouse.current.radius) {
          const force = (mouse.current.radius - distMouse) / mouse.current.radius;
          destX -= (dxMouse / distMouse) * force * 50;
          destY -= (dyMouse / distMouse) * force * 50;
        }

        p.vx += (destX - p.x) * 0.08;
        p.vy += (destY - p.y) * 0.08;
        p.vx *= 0.73; 
        p.vy *= 0.73;

        p.x += p.vx;
        p.y += p.vy;

        if (isHovered.current && !p.isText && p.y > canvas.height + 20) {
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      initParticles();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [wordIndex]);

  return (
    <div
      ref={containerRef}
      className="frame particle-card"
      style={{
        width: "100%",
        height: "260px",
        position: "relative",
        marginBottom: "1.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
        border: "none"
      }}
      onMouseMove={(e) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          mouse.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            radius: 80,
          };
        }
      }}
      onMouseLeave={() => {
        mouse.current = { x: -1000, y: -1000, radius: 80 };
      }}
    >
      <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />
    </div>
  );
}

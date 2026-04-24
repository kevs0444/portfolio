"use client";

import { useEffect, useRef, useState } from "react";

type Particle = {
  ox: number;
  oy: number;
  tx: number;
  ty: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  isText: boolean;
};

type Point = {
  x: number;
  y: number;
};

type ParticleTextProps = {
  words?: string[];
  className?: string;
  height?: number | string;
};

const defaultWords = ["HI", "READY?", "LET'S TALK"];
const mouseReset = { x: -1000, y: -1000, radius: 80 };

function getStep(width: number) {
  return width < 720 ? 10 : 8;
}

function buildBasePoints(width: number, height: number, step: number) {
  const points: Point[] = [];

  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      points.push({ x, y });
    }
  }

  return points;
}

function buildTextTargets(width: number, height: number, word: string, step: number) {
  const offscreen = document.createElement("canvas");
  offscreen.width = width;
  offscreen.height = height;

  const offCtx = offscreen.getContext("2d", { willReadFrequently: true });
  if (!offCtx) {
    return [] as Point[];
  }

  offCtx.clearRect(0, 0, width, height);
  offCtx.fillStyle = "#ffffff";

  const horizontalPadding = width < 640 ? 28 : 60;
  let fontSize = Math.min(height * 0.58, width / 2.3);

  do {
    offCtx.font = `900 ${fontSize}px "Syncopate", "Inter", sans-serif`;
    if (offCtx.measureText(word).width <= width - horizontalPadding * 2) {
      break;
    }
    fontSize -= 4;
  } while (fontSize > 24);

  offCtx.textAlign = "center";
  offCtx.textBaseline = "middle";
  offCtx.fillText(word, width / 2, height / 2);

  const imageData = offCtx.getImageData(0, 0, width, height).data;
  const targets: Point[] = [];

  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const alpha = imageData[(y * width + x) * 4 + 3];
      if (alpha > 128) {
        targets.push({ x, y });
      }
    }
  }

  return targets;
}

export default function ParticleText({ words = defaultWords, className = "", height = 260 }: ParticleTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef(mouseReset);
  const particlesRef = useRef<Particle[]>([]);
  const currentWordRef = useRef(words[0] ?? defaultWords[0]);
  const updateTargetsRef = useRef<() => void>(() => {});
  const animationFrameRef = useRef<number | null>(null);
  const resizeFrameRef = useRef<number | null>(null);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    setWordIndex(0);
    currentWordRef.current = words[0] ?? defaultWords[0];
    updateTargetsRef.current();
  }, [words]);

  useEffect(() => {
    if (words.length <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      setWordIndex((current) => (current + 1) % words.length);
    }, 3600);

    return () => window.clearInterval(interval);
  }, [words]);

  useEffect(() => {
    currentWordRef.current = words[wordIndex] ?? defaultWords[0];
    updateTargetsRef.current();
  }, [wordIndex, words]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) {
      return;
    }

    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) {
      return;
    }

    const syncTargets = () => {
      const rect = container.getBoundingClientRect();
      const width = Math.max(Math.floor(rect.width), 1);
      const height = Math.max(Math.floor(rect.height), 1);

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      const step = getStep(width);
      const basePoints = buildBasePoints(width, height, step);
      const targetPoints = buildTextTargets(width, height, currentWordRef.current, step);
      const nextCount = Math.max(basePoints.length, targetPoints.length);
      const previousParticles = particlesRef.current;
      const nextParticles: Particle[] = [];

      for (let index = 0; index < nextCount; index += 1) {
        const basePoint = basePoints[index] ?? basePoints[index % Math.max(basePoints.length, 1)] ?? { x: width / 2, y: height / 2 };
        const previousParticle = previousParticles[index];
        const nextTarget = targetPoints[index];
        const isText = Boolean(nextTarget);

        nextParticles.push({
          ox: basePoint.x,
          oy: basePoint.y,
          tx: isText ? nextTarget.x : basePoint.x + (Math.random() - 0.5) * 120,
          ty: isText ? nextTarget.y : height + 140 + Math.random() * 80,
          x: previousParticle ? previousParticle.x : basePoint.x + (Math.random() - 0.5) * 50,
          y: previousParticle ? previousParticle.y : basePoint.y + (Math.random() - 0.5) * 50,
          vx: previousParticle?.vx ?? 0,
          vy: previousParticle?.vy ?? 0,
          isText,
        });
      }

      particlesRef.current = nextParticles;
    };

    updateTargetsRef.current = syncTargets;
    syncTargets();

    const animate = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);

      const style = getComputedStyle(document.documentElement);
      const textColor = style.getPropertyValue("--text").trim() || "#ffffff";

      for (const particle of particlesRef.current) {
        let destinationX = particle.tx;
        let destinationY = particle.ty;

        const dxMouse = mouseRef.current.x - particle.x;
        const dyMouse = mouseRef.current.y - particle.y;
        const mouseDistance = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

        if (mouseDistance < mouseRef.current.radius) {
          const force = (mouseRef.current.radius - mouseDistance) / mouseRef.current.radius;
          const safeDistance = Math.max(mouseDistance, 1);
          destinationX -= (dxMouse / safeDistance) * force * 42;
          destinationY -= (dyMouse / safeDistance) * force * 42;
        }

        particle.vx += (destinationX - particle.x) * 0.08;
        particle.vy += (destinationY - particle.y) * 0.08;
        particle.vx *= 0.76;
        particle.vy *= 0.76;
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (!particle.isText && particle.y > canvas.height + 20) {
          continue;
        }

        context.globalAlpha = particle.isText ? 1 : 0.12;
        context.fillStyle = textColor;
        context.beginPath();
        context.arc(particle.x, particle.y, 1.45, 0, Math.PI * 2);
        context.fill();
      }

      context.globalAlpha = 1;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (resizeFrameRef.current) {
        cancelAnimationFrame(resizeFrameRef.current);
      }

      resizeFrameRef.current = requestAnimationFrame(() => {
        syncTargets();
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (resizeFrameRef.current) {
        cancelAnimationFrame(resizeFrameRef.current);
      }
    };
  }, [words]);

  return (
    <div
      ref={containerRef}
      className={`particle-card ${className}`.trim()}
      style={{
        width: "100%",
        height: typeof height === "number" ? `${height}px` : height,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onMouseMove={(event) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) {
          return;
        }

        mouseRef.current = {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
          radius: 80,
        };
      }}
      onMouseLeave={() => {
        mouseRef.current = mouseReset;
      }}
    >
      <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />
    </div>
  );
}

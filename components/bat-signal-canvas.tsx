"use client";

import { useEffect, useRef } from "react";

type BatSignalCanvasProps = {
  className?: string;
};

export function BatSignalCanvas({ className }: BatSignalCanvasProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let mouseX = 0.5;
    let mouseY = 0.35;
    let targetX = 0.5;
    let targetY = 0.35;
    let time = 0;
    let rafId = 0;

    const lerp = (a: number, b: number, v: number) => a + (b - a) * v;

    const roundedRectPath = (x: number, y: number, w: number, h: number, r: number) => {
      const rr = Math.min(r, w * 0.5, h * 0.5);
      ctx.beginPath();
      ctx.moveTo(x + rr, y);
      ctx.lineTo(x + w - rr, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
      ctx.lineTo(x + w, y + h - rr);
      ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
      ctx.lineTo(x + rr, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
      ctx.lineTo(x, y + rr);
      ctx.quadraticCurveTo(x, y, x + rr, y);
      ctx.closePath();
    };

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      dpr = window.devicePixelRatio || 1;
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = wrap.getBoundingClientRect();
      mouseX = (e.clientX - rect.left) / rect.width;
      mouseY = (e.clientY - rect.top) / rect.height;
      mouseX = Math.max(0, Math.min(1, mouseX));
      mouseY = Math.max(0, Math.min(1, mouseY));
    };

    const onMouseLeave = () => {
      mouseX = 0.5;
      mouseY = 0.35;
    };

    const drawBeam = (
      cx: number,
      cy: number,
      rx: number,
      ry: number,
      alpha: number,
      spreadX: number,
      spreadY: number
    ) => {
      const tipX = cx + spreadX * 0.04;
      const spread = 180 + spreadX * 44 + spreadY * 0.08;
      const top = ry - 16;
      const mid = (top + cy) * 0.5;

      const grad = ctx.createLinearGradient(tipX, cy + 26, tipX, top - 46);
      grad.addColorStop(0, `rgba(240,192,36,${alpha * 0.0})`);
      grad.addColorStop(0.15, `rgba(240,192,36,${alpha * 0.12})`);
      grad.addColorStop(0.5, `rgba(240,192,36,${alpha * 0.2})`);
      grad.addColorStop(0.82, `rgba(255,220,80,${alpha * 0.28})`);
      grad.addColorStop(1, `rgba(255,230,100,${alpha * 0.48})`);

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(tipX, cy + 24);
      ctx.quadraticCurveTo(tipX - spread * 0.6, mid, tipX - spread, top - 34);
      ctx.lineTo(tipX + spread, top - 34);
      ctx.quadraticCurveTo(tipX + spread * 0.6, mid, tipX, cy + 24);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();

      const core = ctx.createLinearGradient(tipX, cy + 18, tipX, top);
      core.addColorStop(0, "rgba(255,240,150,0)");
      core.addColorStop(0.3, `rgba(255,240,150,${alpha * 0.08})`);
      core.addColorStop(0.75, `rgba(255,240,150,${alpha * 0.24})`);
      core.addColorStop(1, `rgba(255,255,200,${alpha * 0.44})`);

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(tipX, cy + 24);
      ctx.quadraticCurveTo(tipX - spread * 0.25, mid, tipX - spread * 0.45, top - 34);
      ctx.lineTo(tipX + spread * 0.45, top - 34);
      ctx.quadraticCurveTo(tipX + spread * 0.25, mid, tipX, cy + 24);
      ctx.closePath();
      ctx.fillStyle = core;
      ctx.fill();
      ctx.restore();

      for (let i = 0; i < 20; i += 1) {
        const fi = i * 0.618033;
        const py = top + (cy - top) * (Math.sin(fi * 7.3 + time * 0.4 + i * 0.9) * 0.5 + 0.5);
        const progress = (cy - py) / (cy - top);
        const hw = spread * progress * 0.9;
        const px = tipX + hw * (Math.sin(fi * 13.1 + time * 0.3) * 0.85);
        const size = 0.7 + Math.sin(fi * 5 + time * 0.7) * 0.4;
        const dustAlpha = (0.13 + Math.sin(fi * 11 + time * 0.5) * 0.08) * alpha * progress;
        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,240,160,${dustAlpha})`;
        ctx.fill();
      }
    };

    const drawBatLogo = (cx: number, cy: number, radius: number, alpha: number) => {
      const scale = radius * 0.55;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(scale / 32, scale / 32);

      const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, 34);
      glow.addColorStop(0, `rgba(240,192,36,${alpha * 0.28})`);
      glow.addColorStop(0.6, `rgba(240,192,36,${alpha * 0.08})`);
      glow.addColorStop(1, "rgba(240,192,36,0)");
      ctx.beginPath();
      ctx.arc(0, 0, 34, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(0, 0, 30, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(240,192,36,${alpha * 0.74})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.fillStyle = `rgba(240,192,36,${alpha})`;
      ctx.beginPath();
      ctx.moveTo(0, -9);
      ctx.bezierCurveTo(-4, -14, -10, -14, -14, -8);
      ctx.bezierCurveTo(-18, -4, -20, 1, -18, 4);
      ctx.bezierCurveTo(-16, 7, -12, 6, -9, 2);
      ctx.lineTo(-7, -2);
      ctx.bezierCurveTo(-6, -5, -5, -6, -4, -4);
      ctx.lineTo(-1, 2);
      ctx.bezierCurveTo(-0.5, 3, 0.5, 3, 1, 2);
      ctx.lineTo(4, -4);
      ctx.bezierCurveTo(5, -6, 6, -5, 7, -2);
      ctx.lineTo(9, 2);
      ctx.bezierCurveTo(12, 6, 16, 7, 18, 4);
      ctx.bezierCurveTo(20, 1, 18, -4, 14, -8);
      ctx.bezierCurveTo(10, -14, 4, -14, 0, -9);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(-6, 5);
      ctx.bezierCurveTo(-7, 9, -9, 10, -8, 12);
      ctx.bezierCurveTo(-7, 13, -5, 11, -4, 9);
      ctx.bezierCurveTo(-3, 11, -2, 13, 0, 12);
      ctx.bezierCurveTo(2, 13, 3, 11, 4, 9);
      ctx.bezierCurveTo(5, 11, 7, 13, 8, 12);
      ctx.bezierCurveTo(9, 10, 7, 9, 6, 5);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    };

    const drawProjector = (cx: number, cy: number) => {
      ctx.save();
      ctx.translate(cx, cy);

      const pole = ctx.createLinearGradient(-4, 0, 4, 0);
      pole.addColorStop(0, "rgba(80,80,80,0.8)");
      pole.addColorStop(0.5, "rgba(140,140,130,0.9)");
      pole.addColorStop(1, "rgba(60,60,60,0.8)");
      ctx.fillStyle = pole;
      ctx.fillRect(-5, 0, 10, 34);

      ctx.fillStyle = "rgba(60,58,50,0.9)";
      roundedRectPath(-18, 32, 36, 10, 3);
      ctx.fill();

      const body = ctx.createLinearGradient(-24, -20, 24, 20);
      body.addColorStop(0, "rgba(70,68,55,0.95)");
      body.addColorStop(0.4, "rgba(100,95,75,0.95)");
      body.addColorStop(1, "rgba(50,50,40,0.95)");
      ctx.fillStyle = body;
      roundedRectPath(-22, -22, 44, 30, 5);
      ctx.fill();
      ctx.strokeStyle = "rgba(200,180,80,0.35)";
      ctx.lineWidth = 1;
      ctx.stroke();

      const lens = ctx.createRadialGradient(0, -8, 0, 0, -8, 14);
      lens.addColorStop(0, "rgba(255,240,150,0.95)");
      lens.addColorStop(0.35, "rgba(240,192,36,0.85)");
      lens.addColorStop(0.7, "rgba(180,140,20,0.6)");
      lens.addColorStop(1, "rgba(100,80,10,0.3)");
      ctx.beginPath();
      ctx.arc(0, -8, 14, 0, Math.PI * 2);
      ctx.fillStyle = lens;
      ctx.fill();
      ctx.strokeStyle = "rgba(240,192,36,0.7)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(-4, -14, 5, 3, -0.4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,220,0.45)";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(0, -8, 10, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(240,192,36,0.25)";
      ctx.lineWidth = 0.8;
      ctx.stroke();

      ctx.restore();
    };

    const drawCloud = (x: number, y: number, w: number, h: number, alpha: number) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      const grad = ctx.createLinearGradient(x, y, x, y + h);
      grad.addColorStop(0, "rgba(30,28,20,0.85)");
      grad.addColorStop(1, "rgba(10,10,8,0.4)");
      ctx.fillStyle = grad;

      ctx.beginPath();
      const by = y + h * 0.5;
      ctx.moveTo(x, by + h * 0.5);
      for (let i = 0; i <= 8; i += 1) {
        const fx = x + (i / 8) * w;
        const fy = by + Math.sin(i * 0.9 + time * 0.2) * h * 0.4;
        const cpx = x + ((i - 0.5) / 8) * w;
        const cpy = fy - h * 0.35;
        ctx.quadraticCurveTo(cpx, cpy, fx, fy);
      }
      ctx.lineTo(x + w, by + h);
      ctx.lineTo(x, by + h);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      targetX = lerp(targetX, mouseX, 0.05);
      targetY = lerp(targetY, mouseY, 0.05);

      const projectorX = width * 0.5;
      const projectorY = height - 26;

      const diskX = width * (0.2 + targetX * 0.6);
      const diskY = height * (0.08 + targetY * 0.26);
      const diskRadius = Math.min(width, height) * 0.16 + Math.sin(time * 0.5) * 4;

      const spreadX = (targetX - 0.5) * width * 0.4;
      const spreadY = (targetY - 0.4) * height * 0.2;

      const ambient = ctx.createRadialGradient(diskX, diskY, diskRadius * 0.25, diskX, diskY, Math.max(width, height) * 0.95);
      ambient.addColorStop(0, "rgba(255,230,120,0.08)");
      ambient.addColorStop(0.35, "rgba(240,192,36,0.045)");
      ambient.addColorStop(0.7, "rgba(240,192,36,0.02)");
      ambient.addColorStop(1, "rgba(240,192,36,0)");
      ctx.fillStyle = ambient;
      ctx.fillRect(0, 0, width, height);

      const haze = ctx.createLinearGradient(projectorX, projectorY, projectorX, 0);
      haze.addColorStop(0, "rgba(240,192,36,0)");
      haze.addColorStop(0.4, "rgba(240,192,36,0.02)");
      haze.addColorStop(1, "rgba(255,235,130,0.03)");
      ctx.fillStyle = haze;
      ctx.fillRect(0, 0, width, height);

      drawBeam(projectorX, projectorY - 20, diskX, diskY, 0.42, spreadX, spreadY);

      drawCloud(width * 0.0 + Math.sin(time * 0.07) * 24, height * 0.1, width * 0.45, 58, 0.5);
      drawCloud(width * 0.5 + Math.cos(time * 0.09) * 16, height * 0.05, width * 0.5, 52, 0.45);
      drawCloud(width * 0.15 + Math.sin(time * 0.05) * 12, height * 0.22, width * 0.38, 46, 0.35);
      drawBatLogo(diskX, diskY, diskRadius, 0.92);
      drawProjector(projectorX, projectorY - 15);

      const lensGlow = ctx.createRadialGradient(projectorX, projectorY - 23, 0, projectorX, projectorY - 23, 32);
      lensGlow.addColorStop(0, "rgba(255,240,120,0.24)");
      lensGlow.addColorStop(0.4, "rgba(240,192,36,0.1)");
      lensGlow.addColorStop(1, "rgba(240,192,36,0)");
      ctx.save();
      ctx.beginPath();
      ctx.arc(projectorX, projectorY - 23, 32, 0, Math.PI * 2);
      ctx.fillStyle = lensGlow;
      ctx.fill();
      ctx.restore();

      time += 0.016;
      rafId = requestAnimationFrame(draw);
    };

    resize();
    draw();

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div ref={wrapRef} className={className ?? "hero-batsignal-wrap"}>
      <canvas ref={canvasRef} className="hero-batsignal-canvas" />
      <div className="hero-batsignal-label">bat-signal active - hover to interact</div>
    </div>
  );
}

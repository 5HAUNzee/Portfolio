"use client";

import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import arkhamBg from "@/assets/Bg.jpg";

import trophyImage from "@/assets/trophy.jpg";
import { ModelViewer } from "@/components/model-viewer";
import { BatSignalCanvas } from "@/components/bat-signal-canvas";
import TechStack from "@/components/tech-stack";

export function PortfolioWebsite() {
  const bgCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const navLinksRef = useRef<HTMLUListElement | null>(null);
  const contactShellRef = useRef<HTMLDivElement | null>(null);
  const loaderLine = "Welcome to Arkham City...";

  const [isLoading, setIsLoading] = useState(true);
  const [isLoaderLeaving, setIsLoaderLeaving] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [commendationPulseIndex, setCommendationPulseIndex] = useState<number | null>(null);
  const [lightningFlash, setLightningFlash] = useState(0);
  const [activeSection, setActiveSection] = useState("about");
  const [navIndicator, setNavIndicator] = useState({ left: 0, width: 0, opacity: 0 });
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [contactSubmitMessage, setContactSubmitMessage] = useState<string | null>(null);

  const commendationCards = [
    {
      id: "REC-001",
      icon: "01",
      title: "1st Place - Technathon Hackathon",
      sub: "NIT Goa · National Hackathon",
      status: "VERIFIED",
      rank: 100,
    },
    {
      id: "REC-002",
      icon: "02",
      title: "Top 30 Innovators in India",
      sub: "National Innovation Challenge · IIT Delhi",
      status: "CERTIFIED",
      rank: 90,
    },
    {
      id: "REC-003",
      icon: "03",
      title: "Award Winner - CIIA 4.0",
      sub: "Innovation Challenge by Marshalls · Mumbai",
      status: "CONFIRMED",
      rank: 85,
    },
    {
      id: "REC-004",
      icon: "04",
      title: "Live App on Google Play Store",
      sub: "IBS Buddy · Healthcare App · Deployed & Maintained",
      status: "ACTIVE",
      rank: 95,
    },
    {
      id: "REC-005",
      icon: "05",
      title: "CTO - Asksummu Pvt. Ltd.",
      sub: "Technical Lead · Jan 2025 - Present · Goa, India",
      status: "CURRENT",
      rank: 88,
    },
    {
      id: "REC-006",
      icon: "06",
      title: "Lenovo LEAP Intern",
      sub: "Enterprise-level development & agile methodologies · 2024",
      status: "LOGGED",
      rank: 80,
    },
  ];

  const certificationCards = [
    {
      id: "CERT-001",
      icon: "C1",
      title: "Associate Android Developer",
      sub: "Google · Mobile Engineering Track",
      status: "VERIFIED",
      rank: 94,
    },
    {
      id: "CERT-002",
      icon: "C2",
      title: "React Native Specialization",
      sub: "Meta · App Architecture & Deployment",
      status: "CERTIFIED",
      rank: 91,
    },
    {
      id: "CERT-003",
      icon: "C3",
      title: "Cloud Practitioner",
      sub: "AWS · Cloud Foundations",
      status: "ACTIVE",
      rank: 88,
    },
    {
      id: "CERT-004",
      icon: "C4",
      title: "Cybersecurity Essentials",
      sub: "Cisco · Security Operations & Networking",
      status: "CONFIRMED",
      rank: 89,
    },
  ];

  const binaryDataStrip = useMemo(
    () => Array.from({ length: 300 }, (_, idx) => ((idx * 17 + 3) % 2 === 0 ? "1" : "0")).join("\n"),
    []
  );

  const cardMotionProps = {
    whileHover: { scale: 1.04, y: -10 },
    whileTap: { scale: 0.995 },
  };

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      const idx = Math.floor(Math.random() * commendationCards.length);
      setCommendationPulseIndex(idx);

      window.setTimeout(() => {
        setCommendationPulseIndex((prev) => (prev === idx ? null : prev));
      }, 400);
    }, 2200);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [commendationCards.length]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".project-card.card-motion");

      cards.forEach((card, idx) => {
        gsap.fromTo(
          card,
          { autoAlpha: 0, y: 36, scale: 0.98 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.72,
            delay: Math.min(idx * 0.03, 0.18),
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    });

    return () => {
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    let isActive = true;
    let sequenceTimers: number[] = [];
    let nextFlashTimer = 0;

    const clearAllTimers = () => {
      sequenceTimers.forEach((id) => window.clearTimeout(id));
      sequenceTimers = [];
      if (nextFlashTimer) {
        window.clearTimeout(nextFlashTimer);
      }
    };

    const runFlashSequence = () => {
      if (!isActive) return;

      const pulses = [0.95, 0.18, 0.82, 0.1, 0.62, 0];
      const pulseDelays = [0, 52, 112, 182, 236, 320];

      pulses.forEach((value, index) => {
        const timer = window.setTimeout(() => {
          if (!isActive) return;
          setLightningFlash(value);
        }, pulseDelays[index]);
        sequenceTimers.push(timer);
      });

      const nextDelay = 2600 + Math.random() * 5200;
      nextFlashTimer = window.setTimeout(() => {
        runFlashSequence();
      }, nextDelay);
    };

    nextFlashTimer = window.setTimeout(runFlashSequence, 1400);

    return () => {
      isActive = false;
      clearAllTimers();
    };
  }, []);

  useEffect(() => {
    let resetFrame = 0;
    resetFrame = requestAnimationFrame(() => {
      setIsLoading(true);
      setIsLoaderLeaving(false);
      setTypedText("");
    });

    let charIndex = 0;
    const typeDelayMs = 65;

    const typeTimer = window.setInterval(() => {
      charIndex += 1;
      setTypedText(loaderLine.slice(0, charIndex));

      if (charIndex >= loaderLine.length) {
        window.clearInterval(typeTimer);
      }
    }, typeDelayMs);

    const minimumLoaderDuration = 3800;
    const finishTypingDuration = loaderLine.length * typeDelayMs + 800;
    const transitionStart = Math.max(minimumLoaderDuration, finishTypingDuration);

    const leaveTimer = window.setTimeout(() => {
      setIsLoaderLeaving(true);
      window.setTimeout(() => {
        setIsLoading(false);
      }, 760);
    }, transitionStart);

    return () => {
      cancelAnimationFrame(resetFrame);
      window.clearInterval(typeTimer);
      window.clearTimeout(leaveTimer);
    };
  }, [loaderLine]);

  useEffect(() => {
    const trackedSections = ["about", "projects", "arsenal", "achievements", "certifications", "contact"];

    const updateIndicator = () => {
      const navList = navLinksRef.current;
      if (!navList) return;

      const activeLink = navList.querySelector<HTMLAnchorElement>(`a[href="#${activeSection}"]`);
      if (!activeLink) {
        setNavIndicator((prev) => ({ ...prev, opacity: 0 }));
        return;
      }

      const listRect = navList.getBoundingClientRect();
      const linkRect = activeLink.getBoundingClientRect();
      setNavIndicator({
        left: linkRect.left - listRect.left,
        width: linkRect.width,
        opacity: 1,
      });
    };

    const updateActiveSectionFromScroll = () => {
      const scanLine = window.innerHeight * 0.36;
      let bestId = trackedSections[0];
      let bestDistance = Number.POSITIVE_INFINITY;

      trackedSections.forEach((id) => {
        const section = document.getElementById(id);
        if (!section) return;

        const rect = section.getBoundingClientRect();
        const isAroundScanLine = rect.top <= scanLine && rect.bottom >= scanLine;
        if (isAroundScanLine) {
          bestId = id;
          bestDistance = -1;
          return;
        }

        if (bestDistance >= 0) {
          const distance = Math.abs(rect.top - scanLine);
          if (distance < bestDistance) {
            bestDistance = distance;
            bestId = id;
          }
        }
      });

      setActiveSection((prev) => (prev === bestId ? prev : bestId));
    };

    updateActiveSectionFromScroll();
    updateIndicator();

    const observer = new IntersectionObserver(
      () => {
        updateActiveSectionFromScroll();
      },
      {
        threshold: [0, 0.2, 0.4, 0.6, 0.8],
        rootMargin: "-20% 0px -60% 0px",
      }
    );

    trackedSections.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    window.addEventListener("scroll", updateActiveSectionFromScroll, { passive: true });
    window.addEventListener("resize", updateActiveSectionFromScroll);
    window.addEventListener("resize", updateIndicator);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateActiveSectionFromScroll);
      window.removeEventListener("resize", updateActiveSectionFromScroll);
      window.removeEventListener("resize", updateIndicator);
    };
  }, [activeSection]);

  useEffect(() => {
    const cur = document.getElementById("cur") as HTMLDivElement | null;
    const trail = document.getElementById("cur-trail") as HTMLDivElement | null;

    let mx = 0;
    let my = 0;
    let tx = 0;
    let ty = 0;
    let cursorFrame = 0;

    const onMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (cur) {
        cur.style.left = `${mx}px`;
        cur.style.top = `${my}px`;
      }
    };

    document.addEventListener("mousemove", onMouseMove);

    const loopCursor = () => {
      tx += (mx - tx) * 0.15;
      ty += (my - ty) * 0.15;
      if (trail) {
        trail.style.left = `${tx}px`;
        trail.style.top = `${ty}px`;
      }
      cursorFrame = requestAnimationFrame(loopCursor);
    };
    cursorFrame = requestAnimationFrame(loopCursor);

    const hoverTargets = Array.from(
      document.querySelectorAll<HTMLElement>("a,button,.project-card,.achievement-card,.comm-card,.cert-card,.skill")
    );
    const onEnter = () => {
      if (cur) {
        cur.style.transform = "translate(-50%,-50%) rotate(45deg) scale(2.5)";
      }
    };
    const onLeave = () => {
      if (cur) {
        cur.style.transform = "translate(-50%,-50%) rotate(45deg) scale(1)";
      }
    };
    hoverTargets.forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    const interactiveCards = Array.from(
      document.querySelectorAll<HTMLElement>(".project-card,.achievement-card,.comm-card,.cert-card")
    );
    const isTouchDevice = window.matchMedia("(hover: none), (pointer: coarse)").matches;

    const onCardMove = (e: MouseEvent) => {
      const card = e.currentTarget as HTMLElement;
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const rotY = (px - 0.5) * 12;
      const rotX = (0.5 - py) * 10;

      card.style.setProperty("--mx", `${px * 100}%`);
      card.style.setProperty("--my", `${py * 100}%`);
      card.style.setProperty("--rx", `${rotX.toFixed(2)}deg`);
      card.style.setProperty("--ry", `${rotY.toFixed(2)}deg`);
      card.classList.add("is-tilting");
    };

    const onCardLeave = (e: MouseEvent) => {
      const card = e.currentTarget as HTMLElement;
      card.style.setProperty("--mx", "50%");
      card.style.setProperty("--my", "50%");
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
      card.classList.remove("is-tilting");
    };

    interactiveCards.forEach((card) => {
      card.style.setProperty("--mx", "50%");
      card.style.setProperty("--my", "50%");
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
      if (!isTouchDevice) {
        card.addEventListener("mousemove", onCardMove);
        card.addEventListener("mouseleave", onCardLeave);
      }
    });

    const bgc = bgCanvasRef.current;
    const bx = bgc?.getContext("2d") ?? null;
    let bw = 0;
    let bh = 0;
    let bgFrame = 0;

    const rbg = () => {
      if (!bgc) return;
      bw = bgc.width = window.innerWidth;
      bh = bgc.height = window.innerHeight;
    };
    rbg();
    window.addEventListener("resize", rbg);

    const drops = Array.from({ length: 130 }, () => ({
      x: Math.random() * 1440,
      y: Math.random() * 900,
      len: Math.random() * 60 + 20,
      speed: Math.random() * 3.4 + 1.6,
      alpha: Math.random() * 0.3 + 0.28,
    }));

    const drawBG = () => {
      if (!bx) return;
      bx.clearRect(0, 0, bw, bh);

      const cg = bx.createLinearGradient(0, bh * 0.7, 0, bh);
      cg.addColorStop(0, "transparent");
      cg.addColorStop(1, "rgba(240,192,36,0.03)");
      bx.fillStyle = cg;
      bx.fillRect(0, bh * 0.7, bw, bh);

      drops.forEach((d) => {
        bx.beginPath();
        bx.moveTo(d.x, d.y);
        bx.lineTo(d.x - 2, d.y + d.len);
        bx.strokeStyle = `rgba(200,210,255,${d.alpha})`;
        bx.lineWidth = 0.8;
        bx.stroke();
        d.y += d.speed;
        if (d.y > bh) {
          d.y = -d.len;
          d.x = Math.random() * bw;
        }
      });

      bgFrame = requestAnimationFrame(drawBG);
    };
    bgFrame = requestAnimationFrame(drawBG);

    const pcCleanups: Array<() => void> = [];

    const initPC = (id: string, type: "wave" | "grid" | "particles" | "circuit") => {
      const c = document.getElementById(id) as HTMLCanvasElement | null;
      if (!c) return;
      const ctx = c.getContext("2d");
      if (!ctx) return;

      let t = 0;
      let frame = 0;
      let ro: ResizeObserver | null = null;

      const rs = () => {
        c.width = c.offsetWidth;
        c.height = c.offsetHeight;
      };
      rs();

      if (typeof ResizeObserver !== "undefined") {
        ro = new ResizeObserver(rs);
        ro.observe(c);
      }

      const drawWave = () => {
        const w = c.width;
        const h = c.height;
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = "#07070f";
        ctx.fillRect(0, 0, w, h);
        for (let l = 0; l < 6; l += 1) {
          ctx.beginPath();
          for (let i = 0; i <= 100; i += 1) {
            const x = (i / 100) * w;
            const y =
              h / 2 +
              Math.sin(i * 0.09 + t * 0.6 + l * 1.1) * (25 + l * 14) +
              Math.sin(i * 0.16 + t * 0.35) * 15;
            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          const a = 0.2 - l * 0.025;
          ctx.strokeStyle = l < 3 ? `rgba(240,192,36,${a + 0.06})` : `rgba(138,110,14,${a})`;
          ctx.lineWidth = 1.4;
          ctx.stroke();
        }
        t += 0.014;
        frame = requestAnimationFrame(drawWave);
      };

      const drawGrid = () => {
        const w = c.width;
        const h = c.height;
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = "#060610";
        ctx.fillRect(0, 0, w, h);
        const cols = 20;
        const rows = 8;
        const cw = w / cols;
        const ch = h / rows;
        for (let r = 0; r < rows; r += 1) {
          for (let cc = 0; cc < cols; cc += 1) {
            const v = (Math.sin(cc * 0.45 + t) + Math.cos(r * 0.6 + t * 0.7) + 2) / 4;
            const s = v * cw * 0.5;
            const x = cc * cw + cw / 2 - s / 2;
            const y = r * ch + ch / 2 - s / 2;
            ctx.fillStyle =
              v > 0.6 ? `rgba(240,192,36,${v * 0.65})` : `rgba(240,192,36,${v * 0.12})`;
            ctx.fillRect(x, y, s, s);
          }
        }
        t += 0.016;
        frame = requestAnimationFrame(drawGrid);
      };

      const pts = Array.from({ length: 55 }, () => ({
        x: Math.random(),
        y: Math.random(),
        vx: (Math.random() - 0.5) * 0.004,
        vy: (Math.random() - 0.5) * 0.004,
      }));

      const drawParticles = () => {
        const w = c.width;
        const h = c.height;
        ctx.fillStyle = "rgba(6,6,16,.2)";
        ctx.fillRect(0, 0, w, h);

        pts.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > 1) p.vx *= -1;
          if (p.y < 0 || p.y > 1) p.vy *= -1;
          ctx.beginPath();
          ctx.arc(p.x * w, p.y * h, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(240,192,36,.8)";
          ctx.fill();
        });

        for (let i = 0; i < pts.length; i += 1) {
          for (let j = i + 1; j < pts.length; j += 1) {
            const dx = (pts[i].x - pts[j].x) * w;
            const dy = (pts[i].y - pts[j].y) * h;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < 90) {
              ctx.beginPath();
              ctx.moveTo(pts[i].x * w, pts[i].y * h);
              ctx.lineTo(pts[j].x * w, pts[j].y * h);
              ctx.strokeStyle = `rgba(240,192,36,${0.22 * (1 - d / 90)})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }

        frame = requestAnimationFrame(drawParticles);
      };

      const nodes = Array.from({ length: 18 }, () => ({
        x: Math.floor(Math.random() * 9) * 0.11 + 0.05,
        y: Math.floor(Math.random() * 5) * 0.19 + 0.08,
        pulse: Math.random() * Math.PI * 2,
      }));

      const drawCircuit = () => {
        const w = c.width;
        const h = c.height;
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = "#040410";
        ctx.fillRect(0, 0, w, h);

        for (let i = 0; i < nodes.length; i += 1) {
          for (let j = i + 1; j < nodes.length; j += 1) {
            const dx = (nodes[i].x - nodes[j].x) * w;
            const dy = (nodes[i].y - nodes[j].y) * h;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < w * 0.25) {
              ctx.beginPath();
              ctx.moveTo(nodes[i].x * w, nodes[i].y * h);
              ctx.lineTo(nodes[j].x * w, nodes[i].y * h);
              ctx.lineTo(nodes[j].x * w, nodes[j].y * h);
              ctx.strokeStyle = "rgba(240,192,36,0.1)";
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }
        }

        nodes.forEach((n) => {
          n.pulse += 0.04;
          const glow = (Math.sin(n.pulse) + 1) / 2;
          ctx.beginPath();
          ctx.arc(n.x * w, n.y * h, 3 + glow * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(240,192,36,${0.4 + glow * 0.5})`;
          ctx.fill();
        });

        t += 0.01;
        frame = requestAnimationFrame(drawCircuit);
      };

      if (type === "wave") drawWave();
      if (type === "grid") drawGrid();
      if (type === "particles") drawParticles();
      if (type === "circuit") drawCircuit();

      pcCleanups.push(() => {
        cancelAnimationFrame(frame);
        ro?.disconnect();
      });
    };

    initPC("pc1", "wave");
    initPC("pc2", "grid");
    initPC("pc3", "particles");
    initPC("pc4", "circuit");

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const revealEls = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    revealEls.forEach((el) => obs.observe(el));

    const countUp = (el: HTMLElement) => {
      const target = Number.parseInt(el.dataset.count ?? "0", 10);
      const dur = 1600;
      const start = performance.now();
      let countFrame = 0;

      const update = (now: number) => {
        const p = Math.min((now - start) / dur, 1);
        const ease = 1 - (1 - p) ** 3;
        el.textContent = `${Math.round(ease * target)}`;
        if (p < 1) {
          countFrame = requestAnimationFrame(update);
        }
      };

      countFrame = requestAnimationFrame(update);
      return () => cancelAnimationFrame(countFrame);
    };

    const countCleanups: Array<() => void> = [];
    const co = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cleanup = countUp(entry.target as HTMLElement);
            countCleanups.push(cleanup);
            co.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    const countEls = Array.from(document.querySelectorAll<HTMLElement>("[data-count]"));
    countEls.forEach((el) => co.observe(el));

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", rbg);
      hoverTargets.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
      interactiveCards.forEach((card) => {
        if (!isTouchDevice) {
          card.removeEventListener("mousemove", onCardMove);
          card.removeEventListener("mouseleave", onCardLeave);
        }
      });
      cancelAnimationFrame(cursorFrame);
      cancelAnimationFrame(bgFrame);
      pcCleanups.forEach((fn) => fn());
      obs.disconnect();
      co.disconnect();
      countCleanups.forEach((fn) => fn());
    };
  }, []);

  const handleContactSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmittingContact) return;

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
    };

    if (!payload.name || !payload.email || !payload.message) {
      setContactSubmitMessage("Please fill out all fields before transmitting the signal.");
      return;
    }

    try {
      setIsSubmittingContact(true);
      setContactSubmitMessage(null);

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "Failed to transmit signal");
      }

      form.reset();
      setContactSubmitMessage("Signal transmitted successfully. I will get back to you soon.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to transmit signal";
      setContactSubmitMessage(message);
    } finally {
      setIsSubmittingContact(false);
    }
  };

  return (
    <>
      {isLoading && (
        <div
          className={`arkham-loader ${isLoaderLeaving ? "is-leaving" : ""}`}
          style={{ backgroundImage: `url(${arkhamBg.src})` }}
        >
          <div className="arkham-loader-vignette" />
          <div className="arkham-loader-noise" />
          <div className="arkham-loader-center">
            <p className="arkham-loader-directed">Directed by Shaun Dsouza</p>
            <h2 className="arkham-loader-title">
              {typedText}
              <span className="arkham-loader-cursor">|</span>
            </h2>
            <div className="arkham-loader-bar">
              <span className="arkham-loader-bar-fill" />
            </div>
          </div>
        </div>
      )}

      <div id="cur" />
      <div id="cur-trail" />
      <canvas id="bg" ref={bgCanvasRef} />
      <div className="lightning-overlay" style={{ opacity: lightningFlash }} aria-hidden="true" />

      <nav>
        <a href="#" className="nav-bat">
          <svg className="bat-icon" viewBox="0 0 64 40" fill="var(--yellow)">
            <path d="M32 8 C20 8 10 14 4 20 C10 18 16 20 20 24 C18 20 22 16 32 16 C42 16 46 20 44 24 C48 20 54 18 60 20 C54 14 44 8 32 8Z" />
            <path d="M32 16 C22 16 18 20 20 24 C22 28 26 32 32 34 C38 32 42 28 44 24 C46 20 42 16 32 16Z" />
            <path d="M4 20 C2 24 4 30 8 32 C10 28 12 24 20 24 C16 20 10 18 4 20Z" />
            <path d="M60 20 C54 18 48 20 44 24 C52 24 54 28 56 32 C60 30 62 24 60 20Z" />
            <path d="M8 32 C8 36 12 38 16 36 C14 32 12 28 20 24 C12 24 10 28 8 32Z" />
            <path d="M56 32 C54 28 52 24 44 24 C52 28 50 32 48 36 C52 38 56 36 56 32Z" />
          </svg>
          SHAUN D&apos;SOUZA
        </a>
        <ul className="nav-links" ref={navLinksRef}>
          <li>
            <a href="#about" className={activeSection === "about" ? "active" : undefined}>
              About
            </a>
          </li>
          <li>
            <a href="#projects" className={activeSection === "projects" ? "active" : undefined}>
              Projects
            </a>
          </li>
          <li>
            <a href="#achievements" className={activeSection === "achievements" ? "active" : undefined}>
              Achievements
            </a>
          </li>
          <li>
            <a href="#certifications" className={activeSection === "certifications" ? "active" : undefined}>
              Certifications
            </a>
          </li>
          <li>
            <a href="#arsenal" className={activeSection === "arsenal" ? "active" : undefined}>
              Tech Stack
            </a>
          </li>
          <li>
            <a href="#contact" className={activeSection === "contact" ? "active" : undefined}>
              Contact
            </a>
          </li>
          <li
            className="nav-active-indicator"
            aria-hidden="true"
            style={{
              transform: `translateX(${navIndicator.left}px)`,
              width: `${navIndicator.width}px`,
              opacity: navIndicator.opacity,
            }}
          />
        </ul>
      </nav>

      <section id="hero">
        <div className="hero-model reveal rd1">
          <ModelViewer className="hero-model-canvas" />
        </div>
        <div className="hero-batsignal-node reveal rd2">
          <BatSignalCanvas />
        </div>

        <svg className="batsignal" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="sigGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F0C024" stopOpacity="0.18" />
              <stop offset="60%" stopColor="#F0C024" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#F0C024" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="200" cy="200" r="190" fill="url(#sigGrad)" />
          <circle cx="200" cy="200" r="190" fill="none" stroke="rgba(240,192,36,0.12)" strokeWidth="1" />
          <circle cx="200" cy="200" r="150" fill="none" stroke="rgba(240,192,36,0.08)" strokeWidth="1" />
          <g transform="translate(200,200)" opacity="0.55">
            <path
              d="M0,-50 C-30,-50 -55,-35 -70,-15 C-55,-20 -38,-15 -28,-5 C-32,-18 -18,-28 0,-28 C18,-28 32,-18 28,-5 C38,-15 55,-20 70,-15 C55,-35 30,-50 0,-50Z"
              fill="rgba(240,192,36,0.5)"
            />
            <path
              d="M0,-28 C-18,-28 -32,-18 -28,-5 C-24,8 -14,18 0,24 C14,18 24,8 28,-5 C32,-18 18,-28 0,-28Z"
              fill="rgba(240,192,36,0.5)"
            />
          </g>
        </svg>

        <svg className="hero-city" viewBox="0 0 1440 300" preserveAspectRatio="xMidYMax slice" fill="rgba(240,192,36,0.06)">
          <rect x="0" y="120" width="40" height="180" />
          <rect x="50" y="60" width="60" height="240" />
          <rect x="60" y="40" width="8" height="20" />
          <rect x="120" y="90" width="80" height="210" />
          <rect x="155" y="70" width="8" height="20" />
          <rect x="210" y="140" width="30" height="160" />
          <rect x="250" y="50" width="90" height="250" />
          <rect x="270" y="30" width="6" height="20" />
          <rect x="288" y="35" width="6" height="15" />
          <rect x="350" y="100" width="50" height="200" />
          <rect x="410" y="70" width="70" height="230" />
          <rect x="440" y="50" width="8" height="20" />
          <rect x="490" y="110" width="40" height="190" />
          <rect x="540" y="40" width="80" height="260" />
          <rect x="570" y="20" width="8" height="20" />
          <rect x="630" y="90" width="55" height="210" />
          <rect x="695" y="60" width="75" height="240" />
          <rect x="720" y="40" width="8" height="20" />
          <rect x="780" y="100" width="50" height="200" />
          <rect x="840" y="50" width="85" height="250" />
          <rect x="870" y="30" width="8" height="20" />
          <rect x="935" y="80" width="60" height="220" />
          <rect x="1005" y="110" width="45" height="190" />
          <rect x="1060" y="55" width="80" height="245" />
          <rect x="1090" y="35" width="8" height="20" />
          <rect x="1150" y="90" width="55" height="210" />
          <rect x="1215" y="60" width="70" height="240" />
          <rect x="1240" y="40" width="8" height="20" />
          <rect x="1295" y="100" width="50" height="200" />
          <rect x="1355" y="45" width="85" height="255" />
        </svg>

        <p className="hero-tag">React Native Developer · Mobile Application Engineer · CTO</p>
        <h1 className="hero-name">
          <span>SHAUN</span>
          <span>D&apos;Souza</span>
        </h1>
        <p className="hero-role">Gotham&apos;s Code Knight · Goa, India · CGPA 9.0</p>
        <div className="hero-contacts">
          <a href="tel:+917385577659" className="hc-link">
            +91 73855 77659
          </a>
          <a href="mailto:samsonshaun03@gmail.com" className="hc-link">
            samsonshaun03@gmail.com
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hc-link">
            LinkedIn ↗
          </a>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="hc-link">
            GitHub ↗
          </a>
        </div>
        <div className="hero-scroll">
          <div className="scroll-bar" />
          Scroll Down
        </div>
      </section>

      <section className="section" id="about">
        <div className="section-header reveal">
          <span className="sec-num">01</span>
          <div className="sec-line" />
          <h2 className="sec-title sec-title-marquee" data-banner="THE DARK KNIGHT STACK" aria-label="The Dark Knight Stack">
            <span className="sec-title-marquee-track" aria-hidden="true">
              <span>
                The <em>Dark Knight</em> Stack
              </span>
              <span>
                The <em>Dark Knight</em> Stack
              </span>
            </span>
          </h2>
          <div className="sec-line" />
        </div>
        <div className="about-grid">
          <div>
            <p className="about-text reveal">
              Results-driven <strong>React Native Developer</strong> with hands-on experience building and shipping
              production-grade mobile applications. Currently serving as <strong>CTO of an early-stage startup</strong>,
              leading end-to-end technical strategy and mobile architecture.
            </p>
            <br />
            <p className="about-text reveal rd1">
              Recognized among the <strong>Top 30 Innovators in India (IIT Delhi)</strong> and awarded <strong>1st place
              at NIT Goa&apos;s Technathon</strong>. Like Batman - I work best at night, ship before dawn, and leave no bug
              alive.
            </p>
          </div>
          <div className="stats-panel reveal rd1">
            <div className="stat-row">
              <div className="stat-item">
                <div className="stat-num" data-count="9">
                  0
                </div>
                <div className="stat-label">CGPA / 10.0 - GCE</div>
              </div>
              <div className="stat-div" />
              <div className="stat-item">
                <div className="stat-num" data-count="4">
                  0
                </div>
                <div className="stat-label">Live Production Apps</div>
              </div>
              <div className="stat-div" />
              <div className="stat-item">
                <div className="stat-num" data-count="3">
                  0
                </div>
                <div className="stat-label">National Awards Won</div>
              </div>
              <div className="stat-div" />
              <div className="stat-item">
                <div className="stat-num">CTO</div>
                <div className="stat-label">Asksummu Pvt. Ltd. - Jan 2025</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="projects" style={{ paddingTop: 60 }}>
        <div className="section-header reveal">
          <span className="sec-num">02</span>
          <div className="sec-line" />
          <h2 className="sec-title sec-title-marquee" data-banner="DEPLOYED OPERATIONS" aria-label="Deployed Operations">
            <span className="sec-title-marquee-track" aria-hidden="true">
              <span>
                <em>Deployed</em> Operations
              </span>
              <span>
                <em>Deployed</em> Operations
              </span>
            </span>
          </h2>
          <div className="sec-line" />
        </div>
        <div className="projects-grid">
          <motion.div {...cardMotionProps} className="project-card card-motion featured reveal">
            <canvas className="project-canvas" id="pc1" data-type="wave" />
            <div className="project-body">
              <p className="proj-num">01 · LIVE ON PLAY STORE</p>
              <h3 className="proj-name">IBS Buddy - Gut Hypnotherapy App</h3>
              <p className="proj-desc">
                Designed, developed, and deployed a live healthcare app on the Google Play Store for users managing
                Irritable Bowel Syndrome. Sole developer responsible for architecture, Firebase integration, and full
                Play Store submission. Focused on intuitive UX and guided audio content delivery with a calming
                interface.
              </p>
              <div className="proj-tags">
                <span className="proj-tag">React Native</span>
                <span className="proj-tag">Firebase</span>
                <span className="proj-tag">Google Play Store</span>
                <span className="proj-tag">UX Design</span>
              </div>
              <div className="proj-links">
                <a href="#" className="proj-link">
                  Play Store ↗
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div {...cardMotionProps} className="project-card card-motion reveal rd1">
            <canvas className="project-canvas" id="pc2" data-type="grid" />
            <div className="project-body">
              <p className="proj-num">02 · GITHUB</p>
              <h3 className="proj-name">Mentify</h3>
              <p className="proj-desc">
                Digitised the semester form submission process for college students, replacing paper-based workflows.
                Automated validation and digital record-keeping reduced administrative overhead and improved submission
                accuracy.
              </p>
              <div className="proj-tags">
                <span className="proj-tag">React Native</span>
                <span className="proj-tag">Firebase BaaS</span>
                <span className="proj-tag">Cloudinary</span>
              </div>
              <div className="proj-links">
                <a href="#" className="proj-link">
                  GitHub ↗
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div {...cardMotionProps} className="project-card card-motion reveal rd2">
            <canvas className="project-canvas" id="pc3" data-type="particles" />
            <div className="project-body">
              <p className="proj-num">03 · GITHUB</p>
              <h3 className="proj-name">Gamified Tourism Platform</h3>
              <p className="proj-desc">
                Gamified tourism platform with badges, points, and leaderboards. Real-time SOS emergency feature with
                GPS location sharing. Firebase Realtime DB for live leaderboard sync across concurrent users.
              </p>
              <div className="proj-tags">
                <span className="proj-tag">React Native</span>
                <span className="proj-tag">Firebase Realtime DB</span>
                <span className="proj-tag">Expo</span>
                <span className="proj-tag">GPS</span>
              </div>
              <div className="proj-links">
                <a href="#" className="proj-link">
                  GitHub ↗
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div {...cardMotionProps} className="project-card card-motion reveal rd1">
            <canvas className="project-canvas" id="pc4" data-type="circuit" />
            <div className="project-body">
              <p className="proj-num">04 · NATIONAL RECOGNITION</p>
              <h3 className="proj-name">Smart Baby Monitoring System</h3>
              <p className="proj-desc">
                Intelligent infant monitoring system integrating sensor data with a mobile-accessible cloud dashboard.
                Recognised at national-level innovation competitions across India for innovative design and real-world
                impact.
              </p>
              <div className="proj-tags">
                <span className="proj-tag">IoT</span>
                <span className="proj-tag">Embedded Systems</span>
                <span className="proj-tag">Cloud</span>
                <span className="proj-tag">Mobile Dashboard</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section arsenal-section" id="arsenal" style={{ paddingTop: 60 }}>
        <div className="section-header reveal">
          <span className="sec-num">03</span>
          <div className="sec-line" />
          <h2 className="sec-title sec-title-marquee" data-banner="TACTICAL ARSENAL" aria-label="Tactical Arsenal">
            <span className="sec-title-marquee-track" aria-hidden="true">
              <span>
                Tactical <em>Arsenal</em>
              </span>
              <span>
                Tactical <em>Arsenal</em>
              </span>
            </span>
          </h2>
          <div className="sec-line" />
        </div>

        <div className="reveal rd1">
          <TechStack />
        </div>
      </section>

      <section className="section" id="achievements" style={{ paddingTop: 60 }}>
        <div className="comm-scene reveal">
          <div className="comm-scanline-el" />

          <div className="comm-data-strip" aria-hidden="true">
            <div className="comm-data-inner">{binaryDataStrip}</div>
          </div>

          <div className="comm-top-bar">
            <div className="comm-top-dot" />
            <div className="comm-top-dot" />
            <div className="comm-top-dot" />
            <span className="comm-top-title">BATCOMPUTER // WAYNE TECH v9.4</span>
            <span className="comm-top-right">
              SYS:<span className="comm-blink-cur">_</span>
            </span>
          </div>

          <div className="comm-section-head">
            <div className="comm-section-head-title comm-title-marquee" data-text="ACHIEVEMENTS" aria-label="Achievements">
                <span className="comm-title-marquee-track" aria-hidden="true">
                  <span>ACHIEVEMENTS</span>
                  <span>ACHIEVEMENTS</span>
                </span>
              </div>
            <div className="comm-section-head-sub">CLASSIFIED - LEVEL 9 CLEARANCE</div>
            <div className="comm-boot-line">INITIALIZING BATCOMPUTER...</div>
          </div>

          <div className="comm-grid">
            {commendationCards.map((card, index) => (
              <motion.article
                key={card.id}
                {...cardMotionProps}
                className={`comm-card ${commendationPulseIndex === index ? "comm-card-pulse" : ""}`}
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.12 }}
              >
                <div className="comm-corner comm-corner-tl" />
                <div className="comm-corner comm-corner-tr" />
                <div className="comm-corner comm-corner-bl" />
                <div className="comm-corner comm-corner-br" />
                <div className="comm-sweep" />

                <div className="comm-card-id">
                  <span className="comm-card-id-num">{card.id}</span>
                </div>

                <div className="comm-rank-bar-wrap">
                  <div
                    className="comm-rank-bar"
                    style={{ animationDelay: `${0.6 + index * 0.12}s`, width: `${card.rank}%` }}
                  />
                </div>

                <div className="comm-image-placeholder" role="img" aria-label="Trophy image placeholder">
                  <Image
                    src={trophyImage}
                    alt="Trophy"
                    className="comm-image-placeholder-img"
                    fill
                    sizes="(max-width: 900px) 84vw, 420px"
                  />
                </div>

                <div className="comm-card-icon-row">
                  <div className="comm-hex-icon" aria-hidden="true">
                    <svg width="32" height="32" viewBox="0 0 32 32">
                      <polygon
                        points="16,3 27,9.5 27,22.5 16,29 5,22.5 5,9.5"
                        fill="rgba(250,199,117,0.08)"
                        stroke="rgba(250,199,117,0.5)"
                        strokeWidth="1"
                      />
                    </svg>
                    <span className="comm-hi-char">{card.icon}</span>
                  </div>
                  <div className="comm-card-title">{card.title}</div>
                </div>

                <div className="comm-card-sub">{card.sub}</div>

                <div className="comm-card-bottom">
                  <span className="comm-status-pill">{card.status}</span>
                  <div className="comm-pulse-dot" />
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="certifications" style={{ paddingTop: 60 }}>
        <div className="comm-scene reveal">
          <div className="comm-scanline-el" />

          <div className="comm-data-strip" aria-hidden="true">
            <div className="comm-data-inner">{binaryDataStrip}</div>
          </div>

          <div className="comm-top-bar">
            <div className="comm-top-dot" />
            <div className="comm-top-dot" />
            <div className="comm-top-dot" />
            <span className="comm-top-title">BATCOMPUTER // WAYNE TECH v9.4</span>
            <span className="comm-top-right">
              SYS:<span className="comm-blink-cur">_</span>
            </span>
          </div>

          <div className="comm-section-head">
            <div className="comm-section-head-title comm-title-marquee" data-text="CERTIFICATIONS" aria-label="Certifications">
                <span className="comm-title-marquee-track" aria-hidden="true">
                  <span>CERTIFICATIONS</span>
                  <span>CERTIFICATIONS</span>
                </span>
              </div>
            <div className="comm-section-head-sub">CLASSIFIED - LEVEL 9 CLEARANCE</div>
            <div className="comm-boot-line">INITIALIZING BATCOMPUTER...</div>
          </div>

          <div className="cert-carousel-wrap" aria-label="3D rotating certifications carousel">
            <div className="cert-carousel" role="list">
              {certificationCards.map((card, index) => (
                <div
                  key={card.id}
                  className="cert-carousel-orbit"
                  style={{
                    transform: `translate(-50%, -50%) rotateY(${(360 / certificationCards.length) * index}deg) translateZ(clamp(220px, 30vw, 340px))`,
                  }}
                >
                  <article role="listitem" className="comm-card cert-carousel-card">
                    <div className="comm-corner comm-corner-tl" />
                    <div className="comm-corner comm-corner-tr" />
                    <div className="comm-corner comm-corner-bl" />
                    <div className="comm-corner comm-corner-br" />
                    <div className="comm-sweep" />

                    <div className="comm-card-id">
                      <span className="comm-card-id-num">{card.id}</span>
                    </div>

                    <div className="comm-rank-bar-wrap">
                      <div className="comm-rank-bar" style={{ width: `${card.rank}%` }} />
                    </div>

                    <div className="comm-card-icon-row">
                      <div className="comm-hex-icon" aria-hidden="true">
                        <svg width="32" height="32" viewBox="0 0 32 32">
                          <polygon
                            points="16,3 27,9.5 27,22.5 16,29 5,22.5 5,9.5"
                            fill="rgba(250,199,117,0.08)"
                            stroke="rgba(250,199,117,0.5)"
                            strokeWidth="1"
                          />
                        </svg>
                        <span className="comm-hi-char">{card.icon}</span>
                      </div>
                      <div className="comm-card-title">{card.title}</div>
                    </div>

                    <div className="comm-card-sub">{card.sub}</div>

                    <div className="comm-card-bottom">
                      <span className="comm-status-pill">{card.status}</span>
                      <div className="comm-pulse-dot" />
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="contact">
        <div
          className="contact-shell"
          ref={contactShellRef}
          onMouseMove={(e) => {
            const shell = contactShellRef.current;
            if (!shell) return;
            const rect = shell.getBoundingClientRect();
            const px = (e.clientX - rect.left) / rect.width - 0.5;
            const py = (e.clientY - rect.top) / rect.height - 0.5;
            shell.style.setProperty("--orb-x", `${px * 42}px`);
            shell.style.setProperty("--orb-y", `${py * 26}px`);
          }}
          onMouseLeave={() => {
            const shell = contactShellRef.current;
            if (!shell) return;
            shell.style.setProperty("--orb-x", "0px");
            shell.style.setProperty("--orb-y", "0px");
          }}
        >
          <span className="contact-shell-batman-orb" aria-hidden="true" />
          <span className="contact-shell-batman-badge" aria-hidden="true">
           
          </span>

          <p className="contact-kicker">Reach Out</p>
          <h2 className="contact-headline contact-headline-marquee" aria-label="Send the Signal">
            <span className="contact-headline-marquee-track" aria-hidden="true">
              <span>Send the Signal</span>
              <span>Send the Signal</span>
            </span>
          </h2>
          <p className="contact-subtext">Got a mission, idea, or question? Send the signal.</p>

          <div className="contact-panels">
            <form className="contact-form" onSubmit={handleContactSubmit}>
              <div className="contact-field">
                <label htmlFor="contact-name">Name</label>
                <input id="contact-name" name="name" type="text" autoComplete="name" required />
              </div>

              <div className="contact-field">
                <label htmlFor="contact-email">Email</label>
                <input id="contact-email" name="email" type="email" autoComplete="email" required />
              </div>

              <div className="contact-field contact-field-message">
                <label htmlFor="contact-message">Message</label>
                <textarea id="contact-message" name="message" rows={5} required />
              </div>

              <button type="submit" className="contact-submit" disabled={isSubmittingContact}>
                <span className="contact-submit-label">Transmit Signal</span>
              </button>

              {contactSubmitMessage ? (
                <p className="contact-submit-feedback" role="status" aria-live="polite">
                  {contactSubmitMessage}
                </p>
              ) : null}
            </form>

            <div className="contact-legacy">
              <svg className="contact-signal" viewBox="0 0 80 80" fill="none" aria-hidden="true">
                <circle cx="40" cy="40" r="38" stroke="rgba(240,192,36,0.3)" strokeWidth="1" />
                <g transform="translate(40,40)">
                  <path
                    d="M0,-18 C-10,-18 -19,-12 -24,-5 C-19,-7 -13,-5 -9,-1 C-11,-6 -6,-10 0,-10 C6,-10 11,-6 9,-1 C13,-5 19,-7 24,-5 C19,-12 10,-18 0,-18Z"
                    fill="var(--yellow)"
                  />
                  <path
                    d="M0,-10 C-6,-10 -11,-6 -9,-1 C-8,3 -4,7 0,9 C4,7 8,3 9,-1 C11,-6 6,-10 0,-10Z"
                    fill="var(--yellow)"
                  />
                </g>
              </svg>

              <h3 className="contact-knight-headline">
                CONTACT
                <br />
                THE <em>Knight</em>
              </h3>

              <div className="contact-grid">
                <div className="contact-item">
                  <div className="ci-label">Phone</div>
                  <div className="ci-val">
                    <a href="tel:+917385577659">+91 73855 77659</a>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="ci-label">Email</div>
                  <div className="ci-val">
                    <a href="mailto:samsonshaun03@gmail.com">samsonshaun03@gmail.com</a>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="ci-label">Location</div>
                  <div className="ci-val">Goa, India</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <span>© 2025 Shaun D&apos;Souza - Goa College of Engineering · Graduating 2027</span>
        <span style={{ color: "var(--yellow)" }}>I AM VENGEANCE. I AM THE CODE.</span>
      </footer>
    </>
  );
}

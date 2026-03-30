"use client";

import { useEffect, useState } from "react";
import type { RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function useHeroScroll(triggerRef: RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!triggerRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const state = { value: 0 };

    const tween = gsap.to(state, {
      value: 1,
      ease: "power3.inOut",
      scrollTrigger: {
        trigger: triggerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      },
      onUpdate: () => setProgress(state.value),
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [triggerRef]);

  return progress;
}

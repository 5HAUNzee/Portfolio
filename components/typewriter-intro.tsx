"use client";

import { useEffect, useState } from "react";

const introText = "Hi, I'm Shaun D'Souza - React Native Developer & Mobile Application Engineer.";

export function TypewriterIntro() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index >= introText.length) return;

    const timer = window.setTimeout(() => {
      setIndex((prev) => prev + 1);
    }, 38);

    return () => window.clearTimeout(timer);
  }, [index]);

  return (
    <div className="typewriter-overlay" aria-live="polite">
      <p className="typewriter-text">
        {introText.slice(0, index)}
        <span className="typewriter-cursor" aria-hidden="true">
          |
        </span>
      </p>
    </div>
  );
}
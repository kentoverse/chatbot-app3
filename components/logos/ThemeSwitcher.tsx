"use client";

import { useLayoutEffect, useState } from "react";

export const ThemeSwitcher = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useLayoutEffect(() => {
    const el = document.documentElement;
    setIsDarkMode(el.classList.contains("dark"));
  }, []);

  return (
    <img
      src={isDarkMode ? "/botdw-white.png" : "/botdw-black.png"}
      alt="BotDW Logo"
      className="h-10 w-auto transition-all duration-300 ease-in-out"
    />
  );
};
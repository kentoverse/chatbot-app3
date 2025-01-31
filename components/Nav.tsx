"use client";

import { useLayoutEffect, useState } from "react";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";
import Github from "./logos/GitHub";
import Hume from "./logos/Hume";
import pkg from '@/package.json';
import { ThemeSwitcher } from "./logos/ThemeSwitcher";

export const Nav = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useLayoutEffect(() => {
    const el = document.documentElement;
    setIsDarkMode(el.classList.contains("dark"));
  }, []);

  const toggleDark = () => {
    const el = document.documentElement;
    el.classList.toggle("dark");
    setIsDarkMode((prev) => !prev);
  };

  return (
    <div className="px-4 py-2 flex items-center h-16 md:h-20 lg:h-24 z-50 bg-card border-b border-border">
      <div className="flex items-center gap-2">
        <ThemeSwitcher /> {/* Render the dynamic logo */}
        <span className="text-md font-bold">BOT WORKS</span>
      </div>
      <div className="ml-auto flex items-center gap-1">
        <Button
          onClick={() => window.open(pkg.homepage, "_blank", "noopener noreferrer")}
          variant="ghost"
          className="ml-auto flex items-center gap-1.5"
        >
          <Hume className="size-4" />
          <span>Prototype</span>
        </Button>
        <Button
          onClick={() => window.open(pkg.readmore, "_blank", "noopener noreferrer")}
          variant="ghost"
          className="ml-auto flex items-center gap-1.5"
        >
          <Github className="size-4" />
          <span>Read More</span>
        </Button>
        <Button
          onClick={toggleDark}
          variant="ghost"
          className="ml-auto flex items-center gap-1.5"
        >
          {isDarkMode ? <Sun className="size-4" /> : <Moon className="size-4" />}
          <span>{isDarkMode ? "Light" : "Dark"} Mode</span>
        </Button>
      </div>
    </div>
  );
};
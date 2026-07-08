"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const resolvedTheme = mounted && theme === "system"
    ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    : theme;

  const isLight = resolvedTheme === "light";
  const label = mounted && isLight ? "Switch to dark theme" : "Switch to light theme";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(isLight ? "dark" : "light")}
          className="border-primary/20 hover:bg-primary/10 transition-colors"
          aria-label={mounted ? label : "Toggle theme"}
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-primary" aria-hidden="true" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-primary" aria-hidden="true" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{mounted ? label : "Toggle theme"}</p>
      </TooltipContent>
    </Tooltip>
  );
}

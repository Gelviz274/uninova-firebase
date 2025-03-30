"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, Monitor } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevenir errores de hidratación
  useEffect(() => {
    setMounted(true);
  }, []);

  // Si no está montado, no renderizamos nada para evitar errores de hidratación
  if (!mounted) {
    return <div className="w-[120px] h-[38px]" aria-hidden="true" />;
  }

  return (
    <div className="flex items-center space-x-2 bg-neutral-700 p-1 rounded-lg dark:bg-neutral-700">
      <button
        className={cn(
          "rounded-md p-2 transition-colors",
          theme === "light"
            ? "bg-neutral-600 text-beige shadow-sm"
            : "text-beige/60 hover:text-beige dark:text-beige/60 dark:hover:text-beige"
        )}
        onClick={() => setTheme("light")}
        aria-label="Tema claro"
      >
        <Sun className="h-5 w-5" />
      </button>
      
      <button
        className={cn(
          "rounded-md p-2 transition-colors",
          theme === "dark"
            ? "bg-neutral-600 text-beige shadow-sm"
            : "text-beige/60 hover:text-beige dark:text-beige/60 dark:hover:text-beige"
        )}
        onClick={() => setTheme("dark")}
        aria-label="Tema oscuro"
      >
        <Moon className="h-5 w-5" />
      </button>
      
      <button
        className={cn(
          "rounded-md p-2 transition-colors",
          theme === "system"
            ? "bg-neutral-600 text-beige shadow-sm dark:bg-neutral-600 dark:text-beige"
            : "text-beige/60 hover:text-beige dark:text-beige/60 dark:hover:text-beige"
        )}
        onClick={() => setTheme("system")}
        aria-label="Tema del sistema"
      >
        <Monitor className="h-5 w-5" />
      </button>
    </div>
  );
} 
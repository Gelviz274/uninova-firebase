"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <>
      <main className="font-sans antialiased relative overflow-hidden min-h-screen">
        {/* Luces animadas de fondo - una en cada esquina */}
        <div className="fixed inset-0 z-30 pointer-events-none overflow-hidden">
          {/* Esquina superior izquierda */}
          <div className="absolute top-0 left-0 w-96 h-96 -translate-x-1/2 -translate-y-1/2 bg-cafe dark:bg-beige/20 rounded-full blur-[120px] animate-pulse" />
          
          {/* Esquina superior derecha */}
          <div className="absolute top-0 right-0 w-96 h-96 translate-x-1/2 -translate-y-1/2 bg-cafe dark:bg-beige/15 rounded-full blur-[120px] animate-pulse delay-700" />
          
          {/* Esquina inferior izquierda */}
          <div className="absolute bottom-0 left-0 w-96 h-96 -translate-x-1/2 translate-y-1/2 bg-cafe dark:bg-beige/20 rounded-full blur-[120px] animate-pulse delay-1000" />
          
          {/* Esquina inferior derecha */}
          <div className="absolute bottom-0 right-0 w-96 h-96 translate-x-1/2 translate-y-1/2 bg-cafe dark:bg-beige/15 rounded-full blur-[120px] animate-pulse delay-1200" />
        </div>
        
        {/* Botón de cambio de tema - posicionado en esquina inferior derecha para mejor accesibilidad */}
        <button
          onClick={toggleTheme}
          className="fixed top-6 right-6 z-40 flex items-center gap-2 px-4 py-3 bg-white/80 dark:bg-neutral-900 backdrop-blur-md  dark:text-white rounded-full shadow-lg border border-gray-200 dark:border-gray-800 transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-xl  group"
          aria-label={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
        >
          <span className="text-sm text-neutral-900 dark:text-white font-medium transition-opacity duration-300 opacity-100  md:group-hover:opacity-100 md:mr-1">
            {isDarkMode ? "Modo Claro" : "Modo Oscuro"}
          </span>
          <span className="relative flex items-center justify-center w-7 h-7">
            <Sun 
              size={18} 
              className={`absolute transition-all duration-500 ${
                isDarkMode ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-0'
              }`} 
            />
            <Moon 
              size={18} 
              className={`absolute transition-all duration-500 ${
                isDarkMode ? 'opacity-0 -rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100 text-neutral-900 '
              }`} 
            />
          </span>
        </button>
        
        {/* Contenido principal - z-10 para estar por encima de las luces */}
        <div className="relative z-10">
          {children}
        </div>
      </main>
    </>
  );
}
  
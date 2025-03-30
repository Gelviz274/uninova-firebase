"use client";

import { useEffect } from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Mantener solo la función vacía para evitar otros errores
  }, []);

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
        
        {/* Contenido principal - z-10 para estar por encima de las luces */}
        <div className="relative z-10">
          {children}
        </div>
      </main>
    </>
  );
}
  
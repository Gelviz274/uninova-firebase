"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeProvider({ 
  children, 
  ...props 
}: { 
  children: React.ReactNode 
} & Parameters<typeof NextThemesProvider>[0]) {
  const [mounted, setMounted] = useState(false);
  
  // Esperar a que el componente esté montado en el cliente para evitar errores de hidratación
  useEffect(() => {
    setMounted(true);
  }, []);

  // Usar suppressHydrationWarning para evitar errores en el servidor
  return (
    <NextThemesProvider {...props}>
      <div suppressHydrationWarning>
        {mounted ? children : <div style={{ visibility: "hidden" }}>{children}</div>}
      </div>
    </NextThemesProvider>
  );
} 
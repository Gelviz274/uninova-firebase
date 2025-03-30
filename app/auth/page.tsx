"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { LogIn, UserPlus } from "lucide-react";


export default function AuthPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900 flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
      {/* Luces animadas de fondo */}
      
      <div className="bg-white dark:bg-neutral-900 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-xl p-8 relative border border-white/10 dark:border-neutral-700/50 transition-colors duration-300">
        <div className="flex flex-col items-center justify-center mb-8 border-b border-gray-200 dark:border-neutral-700/50 pb-6">
          <Image
            width={125}
            height={125}
            alt="Logouninova"
            src="/LOGOUNINOVA.png"
          />
          <h1 className="text-black dark:text-beige text-3xl font-bold text-center transition-colors">
            Uni-nova
          </h1>
          <p className="text-gray-600 dark:text-beige/60 text-center text-sm mt-2 transition-colors">
            Plataforma educativa para el futuro académico
          </p>
        </div>

        <div className="space-y-6">
        <div className="flex flex-col gap-5 items-center md:flex-row">

            {/* Sección de inicio de sesión */}
            <div className="flex flex-col gap-4 w-full">
              <h2 className="text-black dark:text-beige text-lg font-bold text-center transition-colors">
                Accede a tu cuenta
              </h2>
              <p className="text-gray-600 dark:text-beige/70 text-center text-sm transition-colors">
                Si ya tienes una cuenta en Uni-nova, inicia sesión para
                continuar explorando y compartiendo conocimientos.
              </p>
              <Link
                href="/auth/login"
                className="flex items-center justify-center gap-3 w-full bg-beige text-black py-3 px-4 rounded-lg font-medium
                  shadow-lg shadow-beige/10 hover:shadow-xl hover:bg-beige/80 
                  border border-beige/50
                  transition-all duration-300"
              >
                <LogIn className="h-5 w-5" />
                <span className="text-[#463B2E] font-semibold">
                  Iniciar Sesión
                </span>
              </Link>
            </div>

            {/* Línea divisoria */}
            <div className="md:h-52 md:w-px h-px w-full bg-gray-200 dark:bg-neutral-700/50 z-50 transition-colors"></div>

            {/* Sección de registro */}
            <div className="flex flex-col gap-4 w-full">
              <h2 className="text-black dark:text-beige text-lg font-bold text-center transition-colors">
                Crea tu cuenta
              </h2>
              <p className="text-gray-600 dark:text-beige/70 text-center text-sm transition-colors">
                Únete a Uni-nova y empieza a compartir tus proyectos académicos
                con la comunidad educativa.
              </p>
              <Link
                href="/auth/register"
                className="flex items-center justify-center gap-3 w-full bg-gray-100 dark:bg-black/40 text-gray-800 dark:text-beige py-3 px-4 rounded-lg font-medium
                  border border-gray-200 dark:border-beige/20 hover:border-gray-300 dark:hover:border-beige/40
                  hover:bg-gray-200 dark:hover:bg-black/60
                  transition-all duration-300"
              >
                <UserPlus className="h-5 w-5" />
                <span className="font-semibold">
                  Crear Cuenta
                </span>
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-4 mt-6 border-t border-gray-200 dark:border-neutral-700/50 transition-colors">
          <p className="text-center text-xs text-gray-500 dark:text-beige/60 transition-colors">
            © 2025 Uni-nova. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}



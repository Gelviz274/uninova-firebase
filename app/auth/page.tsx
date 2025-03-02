"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { LogIn, UserPlus } from "lucide-react";
function AuthPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Luces animadas de fondo */}
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-beige/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute top-40 -right-40 w-80 h-80 bg-[#463B2E]/40 rounded-full blur-[100px] animate-pulse delay-700" />
      <div className="absolute -bottom-52 left-40 w-80 h-80 bg-beige/30 rounded-full blur-[100px] animate-pulse delay-1000" />
      <div className="absolute -bottom-32 right-12 w-80 h-80 bg-beige/20 rounded-full blur-[100px] animate-pulse delay-1200" />

      <div className="bg-black/40 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-xl p-8 relative border border-white/10">
        <div className="flex flex-col items-center justify-center mb-8 border-b border-beige/10 pb-6">
          <Image
            width={125}
            height={125}
            alt="Logouninova"
            src="/LOGOUNINOVA.png"
          />
          <h1 className="text-beige text-3xl font-bold text-center">
            Uni-nova
          </h1>
          <p className="text-beige/60 text-center text-sm mt-2">
            Plataforma educativa para el futuro académico
          </p>
        </div>

        <div className="space-y-6">
        <div className="flex flex-col gap-5 items-center md:flex-row">

            {/* Sección de inicio de sesión */}
            <div className="flex flex-col gap-4 w-full">
              <h2 className="text-beige text-lg font-bold text-center">
                Accede a tu cuenta
              </h2>
              <p className="text-beige/70 text-center text-sm">
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
                <span className="text-[#463B2E] font-semibold ">
                  Iniciar Sesión
                </span>
              </Link>
            </div>

            {/* Línea divisoria */}
            <div className="md:h-52 md:w-px h-px w-full bg-beige/10 z-50"></div>

            {/* Sección de registro */}
            <div className="flex flex-col gap-4 w-full">
              <h2 className="text-beige text-lg font-bold text-center">
                Crea tu cuenta
              </h2>
              <p className="text-beige/70 text-center text-sm">
                Únete a Uni-nova y empieza a compartir tus proyectos académicos
                con la comunidad educativa.
              </p>
              <Link
                href="/auth/register"
                className="flex items-center justify-center gap-3 w-full bg-black/40 text-beige py-3 px-4 rounded-lg font-medium
        border border-beige/20 hover:border-beige/40
        hover:bg-black/60
        transition-all duration-300"
              >
                <UserPlus className="h-5 w-5" />
                <span className="text-beige font-semibold">
                  Crear Cuenta
                </span>
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-4 mt-6 border-t border-beige/10">
          <p className="text-center text-xs text-beige/60">
            © 2025 Uni-nova. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;

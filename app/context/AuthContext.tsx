"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/app/api/setAuth";
import Image from "next/image";

const PUBLIC_ROUTES = ["/auth/login", "/auth/register", "/auth"];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname(); // Obtener la ruta actual

  useEffect(() => {
    if (loading) return; // Esperar a que cargue la sesión

    if (user && PUBLIC_ROUTES.includes(pathname)) {
      router.replace("/"); // Si está autenticado y está en una ruta pública, lo redirige a /
    } else if (!user && !PUBLIC_ROUTES.includes(pathname)) {
      router.replace("/auth/"); // Si NO está autenticado y está en una ruta privada, lo redirige a login
    }
  }, [user, loading, pathname, router]);

  if (loading) return;
  <Image
    src="Logo_uninova.png"
    width={50}
    height={50}
    alt="Logo uninova"
  ></Image>; // Mientras carga, mostrar "Cargando..."

  return <>{children}</>;
}

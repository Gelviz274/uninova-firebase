"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/firebaseconfig";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [redirecting, setRedirecting] = useState(false); // Nuevo estado para evitar múltiples renders

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Redirecciones solo cuando loading sea false
  useEffect(() => {
    if (!loading && !redirecting) {
      setRedirecting(true);

      // Si NO hay usuario y está en una página protegida, redirigir a login
      if (!user && pathname !== "/auth/login" && pathname !== "/auth/register") {
        router.replace("/auth/login");
      }

      // Si hay usuario y está en login o register, redirigir al home
      if (user && (pathname === "/auth/login" || pathname === "/auth/register")) {
        router.replace("/");
      }

      setTimeout(() => setRedirecting(false), 500); // Pequeño delay para evitar múltiples redirecciones
    }
  }, [user, pathname, loading, redirecting, router]);

  
  return <>{children}</>;
};

export default AuthGuard;

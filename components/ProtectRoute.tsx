import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/router";
import { useEffect, ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode; // Especificamos que 'children' es un nodo React (puede ser JSX o un componente)
  authPage?: boolean;  // authPage es opcional y de tipo boolean
}

export default function ProtectedRoute({ children, authPage = false }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user && authPage) {
        router.push("/"); // Redirige a home si el usuario intenta entrar a /auth/login o /auth/register
      } else if (!user && !authPage) {
        router.push("/auth/login"); // Redirige al login si intenta acceder a una página privada
      }
    }
  }, [user, loading, router]);

  if (loading) return <p>Cargando...</p>;

  return <>{children}</>;
}

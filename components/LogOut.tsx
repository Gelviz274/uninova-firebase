"use client";

import { useRouter } from "next/navigation";
import { getAuth, signOut } from "firebase/auth";
import { Button } from "@/components/ui/button"; // Ajusta según tu configuración
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/auth/login"); // Redirige al login después de cerrar sesión
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <>
    <Button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white w-full">
      Cerrar Sesión
    <LogOut size={16} strokeWidth={2} className=" text-white ml-2" aria-hidden="true" />
    </Button>
    </>
  );
}

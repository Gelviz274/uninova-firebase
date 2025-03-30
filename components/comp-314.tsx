"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/firebaseconfig";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CircleAlertIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AlertComponent() {
  const router = useRouter();
  const [profileComplete, setProfileComplete] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setProfileComplete(null);
        setLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));

        if (userDoc.exists()) {
          const data = userDoc.data();
          console.log("Datos del perfil:", data);
          
          // Verificar explícitamente si profileCompleted es true
          const isProfileComplete = data?.profileCompleted === true;
          console.log("¿Perfil completo?:", isProfileComplete);
          
          setProfileComplete(isProfileComplete);
        } else {
          console.log("El documento del usuario no existe");
          setProfileComplete(false);
        }
      } catch (error: unknown) {
        console.error("Error al obtener el perfil de usuario:", error);
        setProfileComplete(false);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const HandleLink = () => {
    router.push("/auth/completar-perfil");
  };

  // No mostrar nada durante la carga o si el usuario no está autenticado
  if (loading || profileComplete === null) return null;
  
  // Solo mostrar la alerta si profileComplete es exactamente false
  if (profileComplete !== false) return null;

  return (
    <AlertDialog defaultOpen={true}>
      <AlertDialogContent className="dark:bg-neutral-800 bg-white text-white">
        <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4 max-w-xl">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-red-500"
            aria-hidden="true"
          >
            <CircleAlertIcon className="opacity-80 text-red-500" size={16} />
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-black dark:text-white">¡No has completado tu perfil!</AlertDialogTitle>
            <AlertDialogDescription className="text-black dark:text-white">
              Para una mejor experiencia en Uni-nova, por favor completa tu perfil.
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>
        <AlertDialogFooter>
          <AlertDialogAction 
            className={cn(
              "bg-red-500 hover:bg-red-600 text-white",
              "dark:bg-red-600 dark:hover:bg-red-700"
            )} 
            onClick={HandleLink}
          >
            Completar perfil
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

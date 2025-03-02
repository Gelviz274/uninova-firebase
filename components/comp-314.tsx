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

export default function AlertComponent() {
  const router = useRouter();
  const [profileComplete, setProfileComplete] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      auth.onAuthStateChanged(async (user) => {
        if (!user) {
          console.log("🔴 Usuario no autenticado");
          setProfileComplete(null);
          return;
        }

        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));

          if (userDoc.exists()) {
            const data = userDoc.data();
            console.log("📄 Datos obtenidos de Firestore:", data);

            // 🔹 Leer correctamente `profileCompleted` desde Firestore
            const isProfileComplete = data?.profileCompleted === true;
            console.log("✔️ ¿Perfil completo?", isProfileComplete);

            setProfileComplete(isProfileComplete);
          } else {
            console.log("❌ Documento no encontrado en Firestore");
            setProfileComplete(false);
          }
        } catch (error) {
          console.error("⚠️ Error obteniendo datos de Firestore:", error);
          setProfileComplete(false);
        }
      });
    };

    fetchUserProfile();
  }, []);

  const HandleLink = () => {
    router.push("/auth/completar-perfil");
  };

  // 🔹 Solo mostrar la alerta si `profileComplete` es exactamente `false`
  if (profileComplete !== false) return null;

  return (
    <AlertDialog defaultOpen={true}>
      <AlertDialogContent>
        <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4 max-w-xl">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-red-500"
            aria-hidden="true"
          >
            <CircleAlertIcon className="opacity-80 text-red-500" size={16} />
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>¡No has completado tu perfil!</AlertDialogTitle>
            <AlertDialogDescription>
              Para una mejor experiencia en Uni-nova, por favor completa tu perfil.
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>
        <AlertDialogFooter>
          <AlertDialogAction onClick={HandleLink}>
            Completar perfil
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

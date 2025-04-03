"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase/firebaseconfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { notFound } from "next/navigation";
import { Loading } from "@/components/ui/loading";
import { useParams } from "next/navigation";
import { ReactNode } from "react";


interface UserProfile {
  nombres: string;
  apellidos: string;
  email: string;
  photoURL: string;
  fotoportada: string;
  uid: string;
  username: string;
  universidad: string;
  carrera: string;
  descripcion: string;
  semestre: string;
}

interface LayoutProps {
  children: ReactNode;
}

export default function UserLayout({ children }: LayoutProps) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const username = params.username as string;

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", "==", username));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          notFound();
          return;
        }

        const userData = querySnapshot.docs[0].data() as UserProfile;
        setUserProfile(userData);
        setLoading(false);
        
        // Actualizar el título de la página con el nombre y apellido del usuario
        document.title = `${userData.nombres} ${userData.apellidos} | Uni-nova`;
      } catch (error) {
        console.error("Error al obtener perfil:", error);
        notFound();
      }
    };

    fetchUserProfile();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900">
        <Loading size="lg" />
      </div>
    );
  }

  if (!userProfile) return null;

  return (
    <div className="min-h-screen dark:bg-neutral-900 bg-neutral-50">
      {/* Contenido principal */}
      <main className="relative z-10 -mt-6 bg-neutral-50 dark:bg-neutral-900 rounded-t-3xl">
        <div className="max-w-7xl mx-auto border-y border-neutral-900">{children}</div>
      </main>
    </div>
  );
}

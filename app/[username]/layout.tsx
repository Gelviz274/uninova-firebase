"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase/firebaseconfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { notFound } from "next/navigation";
import { Loading } from "@/components/ui/loading";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { ReactNode } from "react";

import Image from "next/image";

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
  const router = useRouter();
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
      } catch (error) {
        console.error("Error al obtener perfil:", error);
        notFound();
      }
    };

    fetchUserProfile();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blacku">
        <Loading size="lg" />
      </div>
    );
  }

  if (!userProfile) return null;

  return (
    <div className="min-h-screen bg-blacku">
      {/* Barra de navegación superior */}
      <div className="fixed top-14 left-0 right-0 z-50 bg-blacku/60 backdrop-blur-lg border-y border-beige/10">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="text-beige/60 hover:text-beige hover:bg-beige/5"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              {userProfile.photoURL && (
                <Image
                  src={userProfile.photoURL}
                  alt={userProfile.nombres}
                  width={28}
                  height={28}
                  className="rounded-full object-cover border border-beige/10"
                />
              )}
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-beige">
                  {userProfile.nombres} {userProfile.apellidos}
                </p>
                <p className="text-xs text-beige/60">@{username}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <main className="relative z-10 -mt-6 bg-[#151515] rounded-t-3xl">
        <div className="max-w-7xl mx-auto px-4">{children}</div>
      </main>
    </div>
  );
}

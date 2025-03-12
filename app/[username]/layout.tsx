'use client';

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase/firebaseconfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { notFound } from "next/navigation";
import { Loading } from "@/components/ui/loading";
//import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, School } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { ReactNode } from "react";
import EditProfileUser from "@/components/comp-331";
import Image from 'next/image';

interface UserProfile {
  nombres: string;
  apellidos: string;
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
  //const { user } = useAuth();
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
      <div className="min-h-screen flex items-center justify-center bg-[#151515]">
        <Loading size="lg" />
      </div>
    );
  }

  if (!userProfile) return null;

  return (
    <div className="min-h-screen bg-[#151515]">
      {/* Barra de navegación superior */}
      <div className="fixed top-14 left-0 right-0 z-50 bg-[#202020]/60 backdrop-blur-lg border-y border-beige/10">
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

      {/* Contenedor principal */}
      <div className="pt-10">
        {/* Portada con efecto parallax */}
        <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center transform scale-110"
            style={{
              backgroundImage: userProfile.fotoportada 
                ? `url(${userProfile.fotoportada})`
                : 'linear-gradient(135deg, rgba(33,33,33,1) 0%, rgba(50,50,50,1) 100%)',
              transform: 'translateZ(0)'
            }}
          >
            {/* Overlay con gradiente moderno */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#151515]/50 to-[#151515]"></div>
          </div>

          {/* Contenido sobre la portada */}
          <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-end md:items-center gap-6">
              {/* Foto de perfil con borde brillante */}
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#D2B48C] via-[#BC8F8F] to-[#D2B48C] blur-md opacity-50"></div>
                <Image
                  src={userProfile.photoURL || "/default-user.avif"}
                  alt="Foto de perfil"
                  width={128}
                  height={128}
                  className="relative w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-[#202020] object-cover"
                  priority
                />
              </div>

              {/* Información del usuario */}
              <div className="flex-grow">
                <h1 className="text-2xl md:text-3xl font-bold text-beige mb-2">
                  {userProfile.nombres} {userProfile.apellidos}
                </h1>
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-sm text-beige/60">
                  <p className="flex items-center gap-1">
                    <School className="w-4 h-4" />
                    {userProfile.universidad}
                  </p>
                  <p className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {userProfile.carrera}
                  </p>
                </div>
              </div>

              {/* Botón de editar */}
              <div className="mt-4 md:mt-0">
                <EditProfileUser
                  id={userProfile.uid}
                  nombre={userProfile.nombres}
                  apellido={userProfile.apellidos}
                  fotoPerfil={userProfile.photoURL || ""}
                  username={userProfile.username}
                  universidad={userProfile.universidad}
                  carrera={userProfile.carrera}
                  sobremi={userProfile.descripcion}
                  semestre={parseInt(userProfile.semestre) || 1}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <main className="relative z-10 -mt-6 bg-[#151515] rounded-t-3xl">
          <div className="max-w-7xl mx-auto px-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

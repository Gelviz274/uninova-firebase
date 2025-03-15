"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import Link from "next/link";
import { db } from "@/lib/firebase/firebaseconfig";
import { ThumbsUp, MessageCircle, Bookmark, Share2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/context/AuthContext";
import { Loading } from "@/components/ui/loading";
import Image from "next/image";

const skeletonClasses = "bg-beige/30 dark:bg-beige/20";

// Definir interfaces para los usuarios y proyectos
interface UserProps {
  id?: string;
  nombres: string;
  apellidos: string;
  fotoPerfil: string;
  username: string;
  universidad: string;
  carrera: string;
  intereses?: string[];
}

interface ProjectProps {
  id?: string;
  title: string;
  description: string;
  autorId: string;
  autor?: UserProps;
  tags?: string[];
  projectLink?: string;
  createdAt: Date;
  likes: number;
  views: number;
  categoria?: string;
}

interface UserPreferences {
  carrera?: string;
  universidad?: string;
  intereses?: string[];
}

interface ListaProyectosProps {
  userId?: string;
  projectLink?: string;
  tags?: string[];
}

function ProjectSkeleton() {
  return (
    <li className="bg-[#202020] rounded-xl border border-beige/10 overflow-hidden flex flex-col h-96">
      {/* Header Skeleton */}
      <div className="p-4 flex items-center space-x-3">
        <Skeleton className={cn("h-10 w-10 rounded-full", skeletonClasses)} />
        <div className="space-y-2">
          <Skeleton className={cn("h-4 w-40", skeletonClasses)} />
          <Skeleton className={cn("h-3 w-32", skeletonClasses)} />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="px-4 pb-3 flex-grow">
        <Skeleton className={cn("h-6 w-3/4 mb-3", skeletonClasses)} />
        <div className="space-y-2">
          <Skeleton className={cn("h-4 w-full", skeletonClasses)} />
          <Skeleton className={cn("h-4 w-5/6", skeletonClasses)} />
          <Skeleton className={cn("h-4 w-4/6", skeletonClasses)} />
        </div>
      </div>

      {/* Actions Skeleton */}
      <div className="flex justify-around p-4 border-t border-white/10 bg-[#1e1e1e] mt-auto">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className={cn("h-6 w-16", skeletonClasses)} />
        ))}
      </div>
    </li>
  );
}

function calculateProjectScore(
  project: ProjectProps,
  userPreferences: UserPreferences | null
) {
  let score = 0;

  // Factor de tiempo (proyectos más recientes tienen mayor peso)
  const ageInDays =
    (new Date().getTime() - project.createdAt.getTime()) /
    (1000 * 60 * 60 * 24);
  score += Math.max(0, 100 - ageInDays) * 0.3; // 30% del score

  // Factor de engagement
  score += (project.likes * 0.7 + project.views * 0.3) * 0.2; // 20% del score

  // Coincidencia de categoría/carrera con el usuario
  if (
    userPreferences?.carrera &&
    project.autor?.carrera === userPreferences.carrera
  ) {
    score += 25; // 25% del score
  }

  // Coincidencia de universidad
  if (
    userPreferences?.universidad &&
    project.autor?.universidad === userPreferences.universidad
  ) {
    score += 15; // 15% del score
  }

  // Coincidencia de tags/intereses
  if (userPreferences?.intereses && project.tags) {
    const matchingTags = project.tags.filter(
      (tag) => userPreferences.intereses?.includes(tag) ?? false
    ).length;
    score += matchingTags * 5; // Hasta 10% del score
  }

  return score;
}

export default function ListaProyectos({
  userId,
  projectLink,
  tags,
}: ListaProyectosProps) {
  const [proyectos, setProyectos] = useState<ProjectProps[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        const proyectosRef = collection(db, "projects");
        const snapshot = await getDocs(
          userId
            ? query(proyectosRef, where("autorId", "==", userId))
            : proyectosRef
        );

        const proyectosData: ProjectProps[] = await Promise.all(
          snapshot.docs.map(async (docProject) => {
            const projectData = docProject.data();
            const project = {
              id: docProject.id,
              ...projectData,
              createdAt: projectData.createdAt?.toDate() || new Date(),
              likes: projectData.likes || 0,
              views: projectData.views || 0,
              tags: projectData.tags || [],
            } as ProjectProps;

            // Obtener datos del usuario (autor del proyecto)
            const userRef = doc(db, "users", project.autorId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              const userData = userSnap.data() as UserProps;
              project.autor = {
                ...userData,
                fotoPerfil:
                  userData.fotoPerfil && userData.fotoPerfil.trim() !== ""
                    ? userData.fotoPerfil
                    : "/default-user.avif",
              };
            } else {
              project.autor = {
                nombres: "Usuario desconocido",
                apellidos: "",
                fotoPerfil: "/default-user.avif",
                username: "desconocido",
                universidad: "desconocido",
                carrera: "desconocido",
              };
            }

            return project;
          })
        );

        // Ordenar proyectos por fecha de creación si estamos viendo los proyectos de un usuario específico
        // o por score si estamos viendo todos los proyectos
        const sortedProyectos = userId
          ? proyectosData.sort(
              (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
            )
          : proyectosData.sort((a, b) => {
              const userPrefs: UserPreferences = {
                carrera: (user as unknown as UserProps)?.carrera,
                universidad: (user as unknown as UserProps)?.universidad,
                intereses: (user as unknown as UserProps)?.intereses,
              };
              const scoreA = calculateProjectScore(a, userPrefs);
              const scoreB = calculateProjectScore(b, userPrefs);
              return scoreB - scoreA;
            });

        setProyectos(sortedProyectos);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener proyectos:", error);
        setLoading(false);
      }
    };

    fetchProyectos();
  }, [userId, user]);

  if (loading) {
    return (
      <div className="bg-transparent w-full h-auto">
        <ul className="space-y-4">
          {[1, 2, 3].map((i) => (
            <ProjectSkeleton key={i} />
          ))}
        </ul>
      </div>
    );
  }

  if (proyectos.length === 0) {
    return (
      <div className="min-h-[400px] w-full flex items-center justify-center text-[#D2B48C]">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="bg-transparent w-full h-auto">
      <ul className="space-y-4">
        {proyectos.map((proyecto) => (
          <li
            key={proyecto.id}
            className="bg-[#202020] rounded-xl border border-beige/10 overflow-hidden flex flex-col h-auto"
          >
            {/* Post Header */}
            <div className="p-4 flex items-center space-x-3">
              <Image
                src={proyecto.autor?.fotoPerfil || "/default-user.avif"}
                alt={`Foto de perfil de ${
                  proyecto.autor?.nombres || "Usuario desconocido"
                }`}
                width={40}
                height={40}
                className="rounded-full object-cover"
                priority={true}
              />
              <div>
                <div className="font-medium text-beige flex gap-2">
                  <Link href={`/${proyecto.autor?.username}`} className="flex">
                    <h4>
                      {proyecto.autor?.nombres} {proyecto.autor?.apellidos}
                    </h4>
                    <p className="text-muted-foreground">
                      / @{proyecto.autor?.username}
                    </p>
                  </Link>
                </div>
                <div className="text-sm text-beige/80 flex gap-1">
                  <p>{proyecto.autor?.universidad}</p>
                  <p>- {proyecto.autor?.carrera}</p>
                </div>
              </div>
            </div>

            {/* Post Content */}
            <div className="px-4 pb-3 flex-grow">
              <h4 className="text-lg font-semibold text-white">
                {proyecto.title}
              </h4>
              <p className="text-sm text-gray-200 mt-1 whitespace-pre-line">
                {proyecto.description}
              </p>
  {/* Link al proyecto 
              <Link
                href={proyecto.projectLink || "#"}
                className="flex items-center gap-1 text-gray-400 hover:text-beige"
              >
                <Share2 size={18} />
                <span className="text-sm"> Ver Proyecto</span>
              </Link>
          */}

              {proyecto.tags && proyecto.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {proyecto.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-beige/10 text-beige px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Botones de interacción */}
            <div className="flex justify-around p-4 border-t border-white/10 bg-[#1e1e1e] mt-auto">
              <button className="flex items-center gap-1 text-gray-400 hover:text-beige">
                <ThumbsUp size={18} />
                <span className="text-sm">{proyecto.likes || "Like"}</span>
              </button>
              <button className="flex items-center gap-1 text-gray-400 hover:text-beige">
                <MessageCircle size={18} />
                <span className="text-sm">Comentar</span>
              </button>
              <button className="flex items-center gap-1 text-gray-400 hover:text-beige">
                <Bookmark size={18} />
                <span className="text-sm">Guardar</span>
              </button>
              <button className="flex items-center gap-1 text-gray-400 hover:text-beige">
                <Share2 size={18} />
                <span className="text-sm">Compartir</span>
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

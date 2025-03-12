'use client';

import { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc, query, where, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firebaseconfig";
import { ThumbsUp, MessageCircle, Share2, Trash2, Edit } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import Image from "next/image";

const skeletonClasses = "bg-beige/30 dark:bg-beige/20";

interface UserProps {
  id?: string;
  nombres: string;
  apellidos: string;
  fotoPerfil: string;
  username: string;
  universidad: string;
  carrera: string;
}

interface ProjectProps {
  id?: string;
  title: string;
  description: string;
  autorId: string;
  autor?: UserProps;
  tags?: string[];
  createdAt: Date;
  likes: number;
  views: number;
  categoria?: string;
  projectLink?: string;
  image?: string;
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

interface MyProjectsProps {
  userId?: string;
}

export default function MyProjects({ userId }: MyProjectsProps) {
  const [proyectos, setProyectos] = useState<ProjectProps[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();
  const isOwnProfile = user?.uid === userId;

  useEffect(() => {
    const fetchProyectos = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const proyectosRef = collection(db, "projects");
        const q = query(proyectosRef, where("autorId", "==", userId));
        const snapshot = await getDocs(q);

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
            }

            return project;
          })
        );

        // Ordenar proyectos por fecha de creación (más recientes primero)
        const sortedProyectos = proyectosData.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        );

        setProyectos(sortedProyectos);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener proyectos:", error);
        setLoading(false);
      }
    };

    fetchProyectos();
  }, [userId]);

  const handleDeleteProject = async (projectId: string) => {
    try {
      const projectRef = doc(db, "projects", projectId);
      await deleteDoc(projectRef);
      
      // Actualizar la lista de proyectos
      setProyectos(prev => prev.filter(p => p.id !== projectId));
    } catch (error) {
      console.error("Error al eliminar el proyecto:", error);
    }
  };

  if (loading) {
    return (
      <div className="bg-transparent w-full h-auto px-44">
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <ProjectSkeleton key={i} />
          ))}
        </ul>
      </div>
    );
  }

  if (proyectos.length === 0) {
    return (
      <div className="min-h-[400px] w-full flex flex-col items-center justify-center gap-4 px-44">
        <p className="text-beige/60 text-lg">
          {isOwnProfile 
            ? "No has creado ningún proyecto aún" 
            : "Este usuario no tiene proyectos"}
        </p>
        {isOwnProfile && (
          <Button
            onClick={() => router.push('/create-project')}
            className="bg-[#D2B48C] hover:bg-[#D2B48C]/80 text-[#202020]"
          >
            Crear Proyecto
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-transparent w-full h-auto px-44">
      {isOwnProfile && (
        <div className="flex justify-end mb-6">
          <Button
            onClick={() => router.push('/create-project')}
            className="bg-[#D2B48C] hover:bg-[#D2B48C]/80 text-[#202020]"
          >
            Crear Proyecto
          </Button>
        </div>
      )}

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {proyectos.map((proyecto) => (
          <li
            key={proyecto.id}
            className="bg-[#202020] rounded-xl border border-beige/10 overflow-hidden flex flex-col h-[420px] hover:border-beige/20 transition-all hover:shadow-xl hover:shadow-beige/5"
          >
            {/* Project Image */}
            <div className="relative h-48 w-full overflow-hidden">
              <Image
                src={proyecto.image || "/default-project.jpg"}
                alt={proyecto.title}
                className="object-cover hover:scale-110 transition-transform duration-500"
                fill
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#202020] to-transparent opacity-50" />
            </div>

            {/* Content */}
            <div className="p-6 flex-grow">
              <h3 className="text-xl font-semibold text-beige mb-2 line-clamp-2">
                {proyecto.title}
              </h3>
              <p className="text-beige/60 text-sm line-clamp-3 mb-4">
                {proyecto.description}
              </p>
              {proyecto.tags && proyecto.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {proyecto.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs rounded-lg bg-beige/10 text-beige/80"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center p-4 border-t border-beige/10 bg-[#1a1a1a]">
              <div className="flex items-center gap-4">
                <button className="text-beige/60 hover:text-beige transition-colors flex items-center gap-1">
                  <ThumbsUp className="w-4 h-4" />
                  <span className="text-sm">{proyecto.likes}</span>
                </button>
                <button className="text-beige/60 hover:text-beige transition-colors flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm">0</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                {isOwnProfile && (
                  <>
                    <button
                      onClick={() => router.push(`/edit-project/${proyecto.id}`)}
                      className="p-2 rounded-lg hover:bg-beige/10 text-beige/60 hover:text-beige transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="p-2 rounded-lg hover:bg-red-500/10 text-red-500/60 hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Eliminar proyecto?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. El proyecto será eliminado permanentemente.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => proyecto.id && handleDeleteProject(proyecto.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                )}
                {proyecto.projectLink && (
                  <a
                    href={proyecto.projectLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg hover:bg-beige/10 text-beige/60 hover:text-beige transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

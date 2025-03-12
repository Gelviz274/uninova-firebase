'use client';

import { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc, query, where, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firebaseconfig";
import { ThumbsUp, MessageCircle, Bookmark, Share2, Trash2, Edit } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Loading } from "@/components/ui/loading";
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

export default function MyProjects() {
  const [proyectos, setProyectos] = useState<ProjectProps[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchProyectos = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const proyectosRef = collection(db, "projects");
        const q = query(proyectosRef, where("autorId", "==", user.uid));
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
  }, [user]);

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

  if (!user) {
    return (
      <div className="min-h-[400px] w-full flex flex-col items-center justify-center gap-4">
        <p className="text-beige/60 text-lg">Inicia sesión para ver tus proyectos</p>
        <Button
          onClick={() => router.push('/auth/signin')}
          className="bg-[#D2B48C] hover:bg-[#D2B48C]/80 text-[#202020]"
        >
          Iniciar Sesión
        </Button>
      </div>
    );
  }

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
      <div className="min-h-[400px] w-full flex flex-col items-center justify-center gap-4">
        <p className="text-beige/60 text-lg">No has creado ningún proyecto aún</p>
        <Button
          onClick={() => router.push('/create-project')}
          className="bg-[#D2B48C] hover:bg-[#D2B48C]/80 text-[#202020]"
        >
          Crear Proyecto
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-transparent w-full h-auto">
      <div className="flex justify-end mb-4">
        <Button
          onClick={() => router.push('/create-project')}
          className="bg-[#D2B48C] hover:bg-[#D2B48C]/80 text-[#202020]"
        >
          Crear Nuevo Proyecto
        </Button>
      </div>
      <ul className="space-y-4">
        {proyectos.map((proyecto) => (
          <li
            key={proyecto.id}
            className="bg-[#202020] rounded-xl border border-beige/10 overflow-hidden flex flex-col h-96"
          >
            {/* Post Header */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={proyecto.autor?.fotoPerfil}
                  alt="Foto de perfil"
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-beige">
                    {proyecto.autor?.nombres} {proyecto.autor?.apellidos}
                  </h3>
                  <p className="text-sm text-beige/60">
                    {new Date(proyecto.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => router.push(`/edit-project/${proyecto.id}`)}
                  variant="ghost"
                  size="icon"
                  className="text-beige/60 hover:text-beige"
                >
                  <Edit className="h-5 w-5" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-[#202020] border-beige/10">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-beige">
                        ¿Eliminar proyecto?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-beige/60">
                        Esta acción no se puede deshacer. El proyecto será eliminado permanentemente.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-transparent text-beige border-beige/10 hover:bg-beige/10">
                        Cancelar
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => proyecto.id && handleDeleteProject(proyecto.id)}
                        className="bg-red-500 hover:bg-red-600 text-white"
                      >
                        Eliminar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            {/* Post Content */}
            <div className="px-4 pb-3 flex-grow">
              <h2 className="text-xl font-bold text-beige mb-2">{proyecto.title}</h2>
              <p className="text-beige/80 line-clamp-3">{proyecto.description}</p>
              {proyecto.tags && proyecto.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {proyecto.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-[#D2B48C]/10 text-[#D2B48C] rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Post Actions */}
            <div className="flex justify-around p-4 border-t border-white/10 bg-[#1e1e1e] mt-auto">
              <button className="flex items-center gap-2 text-beige/60 hover:text-beige">
                <ThumbsUp className="h-5 w-5" />
                <span>{proyecto.likes}</span>
              </button>
              <button className="flex items-center gap-2 text-beige/60 hover:text-beige">
                <MessageCircle className="h-5 w-5" />
                <span>0</span>
              </button>
              <button className="flex items-center gap-2 text-beige/60 hover:text-beige">
                <Bookmark className="h-5 w-5" />
                <span>Guardar</span>
              </button>
              <button className="flex items-center gap-2 text-beige/60 hover:text-beige">
                <Share2 className="h-5 w-5" />
                <span>Compartir</span>
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

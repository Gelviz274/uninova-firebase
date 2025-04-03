"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase/firebaseconfig";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { Loading } from "@/components/ui/loading";
import Image from "next/image";

interface UserData {
  id: string;
  nombres: string;
  apellidos: string;
  username: string;
  photoURL: string;
  universidad: string;
  carrera: string;
}

interface ProjectData {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  createdAt: Timestamp;
  autorId: string;
}

interface UpdateData {
  id: string;
  content: string;
  createdAt: Timestamp;
  likes: number;
  commentsCount: number;
  authorId: string;
}

function ViewProjectPage() {
  const params = useParams();
  const projectId = params?.idproject as string | undefined;
  const [project, setProject] = useState<ProjectData | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [updates, setUpdates] = useState<UpdateData[]>([]);
  const [authors, setAuthors] = useState<Record<string, UserData>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectData = async () => {
      if (!projectId) return;

      try {
        const projectRef = doc(db, "projects", projectId);
        const projectSnap = await getDoc(projectRef);

        if (!projectSnap.exists()) {
          setError("Proyecto no encontrado");
          return;
        }

        const projectData = {
          id: projectSnap.id,
          ...projectSnap.data(),
        } as ProjectData;

        setProject(projectData);
        
        // Actualizar el título de la página con el título del proyecto
        document.title = `${projectData.title} | Uni-nova`;

        // Obtener datos del autor del proyecto
        if (projectData.autorId) {
          const userRef = doc(db, "users", projectData.autorId);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            setUserData({
              id: userSnap.id,
              ...userSnap.data(),
            } as UserData);
          }
        }

        // Obtener actualizaciones del proyecto
        const updatesRef = collection(db, "projects", projectId, "updates");
        const updatesQuery = query(updatesRef, orderBy("createdAt", "desc"));
        const updatesSnap = await getDocs(updatesQuery);

        if (updatesSnap.empty) {
          console.warn("No hay actualizaciones para este proyecto.");
          setUpdates([]);
          return;
        }

        const updatesData = updatesSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as UpdateData[];

        setUpdates(updatesData);

        // Obtener datos de los autores de las actualizaciones
        const authorIds = [
          ...new Set(updatesData.map((update) => update.authorId)),
        ];
        const authorsData: Record<string, UserData> = {};

        await Promise.all(
          authorIds.map(async (authorId) => {
            const userRef = doc(db, "users", authorId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              authorsData[authorId] = {
                id: userSnap.id,
                ...userSnap.data(),
              } as UserData;
            }
          })
        );

        setAuthors(authorsData);
      } catch (err: unknown) {
        console.error("Error al obtener datos:", err);
        setError(
          err instanceof Error ? err.message : "Error al cargar el proyecto"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loading size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl text-red-500">{error}</h2>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl text-beige/60">Proyecto no encontrado</h2>
      </div>
    );
  }

  return (
    <div className="py-8 min-h-screen bg-white dark:bg-neutral-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4">
        <div className="rounded-xl overflow-hidden shadow-lg bg-white/80 dark:bg-neutral-900 backdrop-blur-md border border-gray-100 dark:border-beige/10 transition-all duration-300">
          {project.imageUrl && (
            <div className="w-full h-[400px] relative">
              <Image
                src={project.imageUrl}
                alt={project.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
          )}

          <div className="p-8">
            <div className="flex items-center mb-6">
              {userData && (
                <>
                  <Image
                    src={userData.photoURL || "/default-user.avif"}
                    alt={userData.nombres || "Usuario"}
                    width={48}
                    height={48}
                    className="rounded-full mr-4 ring-2 ring-cafe/20 dark:ring-beige/20"
                  />
                  <div>
                    <div className="font-medium text-gray-800 dark:text-beige flex gap-2">
                      <h4>
                        {userData.nombres} {userData.apellidos}
                      </h4>
                      <p className="text-gray-500 dark:text-muted-foreground">
                        / @{userData.username}
                      </p>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-beige/80 flex gap-1">
                      <p>
                        Publicado:{" "}
                        {project.createdAt instanceof Timestamp
                          ? new Date(
                              project.createdAt.toDate()
                            ).toLocaleDateString()
                          : "Fecha desconocida"}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>

            <h1 className="text-3xl font-bold text-neutral-900 dark:text-beige mb-6">
              {project.title}
            </h1>
            <p className="text-neutral-700 dark:text-beige/80 whitespace-pre-line text-lg leading-relaxed">
              {project.description}
            </p>

            {/* 🔥 Sección de Actualizaciones 🔥 */}
            <div className="mt-12">
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-beige mb-6">
                Actualizaciones
              </h2>
              {updates.length > 0 ? (
                <ul className="space-y-6">
                  {updates.map((update) => {
                    const author = authors[update.authorId];
                    return (
                      <li
                        key={update.id}
                        className="bg-gray-50 dark:bg-neutral-800/30 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-beige/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
                      >
                        <div className="flex items-center mb-4">
                          {author ? (
                            <Image
                              src={author.photoURL || "/default-user.avif"}
                              alt={author.nombres}
                              width={40}
                              height={40}
                              className="rounded-full mr-3 ring-2 ring-cafe/20 dark:ring-beige/20"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-neutral-200 dark:bg-neutral-800 rounded-full mr-3"></div>
                          )}
                          <div>
                            <div className="font-medium text-gray-800 dark:text-beige flex gap-2">
                              <h4>
                                {author
                                  ? `${author.nombres} ${author.apellidos}`
                                  : "Anónimo"}
                              </h4>
                              <p className="text-gray-500 dark:text-muted-foreground">
                                / @{author?.username || "Desconocido"}
                              </p>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-beige/80 flex gap-1">
                              <p>
                                {author?.universidad}- {author?.carrera}
                              </p>
                            </div>
                          </div>
                        </div>
                        <p className="text-neutral-700 dark:text-beige text-lg mb-4">
                          {update.content}
                        </p>
                        <div className="flex items-center justify-between text-sm text-neutral-500 dark:text-beige/40">
                          <span>
                            {update.createdAt instanceof Timestamp
                              ? `Actualizado el ${new Date(
                                  update.createdAt.toDate()
                                ).toLocaleDateString()}`
                              : "Fecha desconocida"}
                          </span>
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <span className="text-red-500">❤️</span>{" "}
                              {update.likes}
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="text-blue-500">💬</span>{" "}
                              {update.commentsCount}
                            </span>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="text-center py-8 bg-neutral-50 dark:bg-beige/5 rounded-xl border border-gray-100 dark:border-gray-800">
                  <p className="text-neutral-600 dark:text-beige/60 text-lg">
                    No hay actualizaciones aún.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewProjectPage;

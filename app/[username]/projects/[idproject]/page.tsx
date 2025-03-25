"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase/firebaseconfig";
import { doc, getDoc, collection, getDocs, query, orderBy, Timestamp } from "firebase/firestore";
import { Loading } from "@/components/ui/loading";
import Image from "next/image";

interface UserData {
  id: string;
  nombres: string;
  apellidos: string;
  username: string;
  photoURL: string;
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
        const authorIds = [...new Set(updatesData.map((update) => update.authorId))];
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
        setError(err instanceof Error ? err.message : "Error al cargar el proyecto");
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
    <div className="py-16 bg-blacku min-h-screen">
      <div className="rounded-xl overflow-hidden shadow-lg">
        {project.imageUrl && (
          <div className="w-full h-[300px] relative">
            <Image
              src={project.imageUrl}
              alt={project.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="p-6">
          <div className="flex items-center mb-4">
            {userData && (
              <>
                <Image
                  src={userData.photoURL || "/default-user.avif"}
                  alt={userData.nombres || "Usuario"}
                  width={40}
                  height={40}
                  className="rounded-full mr-3"
                />
                <div>
                  <p className="text-beige font-medium">
                    {userData.nombres} {userData.apellidos}
                  </p>
                  <p className="text-beige/60 text-sm">@{userData.username}</p>

                  <p className="text-beige/60 text-sm">
                    Publicado:{" "}
                    {project.createdAt instanceof Timestamp
                      ? new Date(project.createdAt.toDate()).toLocaleDateString()
                      : "Fecha desconocida"}
                  </p>
                </div>
              </>
            )}
          </div>

          <h1 className="text-2xl font-bold text-beige mb-4">{project.title}</h1>
          <p className="text-beige/80 whitespace-pre-line">{project.description}</p>

          {/* 🔥 Sección de Actualizaciones 🔥 */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-beige">Actualizaciones</h2>
            {updates.length > 0 ? (
              <ul className="mt-4 space-y-4">
                {updates.map((update) => {
                  const author = authors[update.authorId];
                  return (
                    <li key={update.id} className="bg-beige/10 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        {author ? (
                          <Image
                            src={author.photoURL || "/default-user.avif"}
                            alt={author.nombres}
                            width={30}
                            height={30}
                            className="rounded-full mr-2"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-gray-300 rounded-full mr-2"></div>
                        )}
                        <p className="text-beige font-medium">
                          {author ? `${author.nombres} ${author.apellidos}` : "Anónimo"}
                        </p>
                        <p className="text-beige/60 text-sm">
                          @{author?.username || "Desconocido"}
                        </p>
                      </div>
                      <p className="text-beige">{update.content}</p>
                      <p className="text-sm text-beige/60 mt-2">
                        {update.createdAt instanceof Timestamp
                          ? `Actualizado el ${new Date(update.createdAt.toDate()).toLocaleDateString()}`
                          : "Fecha desconocida"}
                      </p>
                      <div className="text-sm text-beige/60 mt-2">
                        ❤️ {update.likes} - 💬 {update.commentsCount} comentarios
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-beige/60 mt-2">No hay actualizaciones aún.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewProjectPage;
